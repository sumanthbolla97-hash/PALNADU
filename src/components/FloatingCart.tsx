import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth, db, auth } from "./AuthContext";
import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export function FloatingCart() {
  const { items, totalItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, profileData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [autoAddress, setAutoAddress] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isSaving, setIsSaving] = useState(false);
  
  // New Address States
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  const shipping = cartTotal > 500 || cartTotal === 0 ? 0 : 50;
  const finalTotal = cartTotal + shipping;

  // Fetch saved address on drawer open
  useEffect(() => {
    if (isOpen && profileData && !hasLoadedProfile) {
      setPhone(profileData.phone || "");
      setAutoAddress(profileData.autoAddress || profileData.address || "");
      setManualAddress(profileData.manualAddress || "");
      setLat(profileData.lat || "");
      setLng(profileData.lng || "");

      if (profileData.phone && (profileData.autoAddress || profileData.address || profileData.manualAddress)) {
        setIsAddressSaved(true);
      }
      setHasLoadedProfile(true);
    }
  }, [isOpen, profileData, hasLoadedProfile]);

  useEffect(() => {
    if (!isOpen) {
      setHasLoadedProfile(false);
    }
  }, [isOpen]);

  const handleGetLocation = () => {
    setIsLoadingAddress(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLat(latitude.toFixed(6));
        setLng(longitude.toFixed(6));
        setAccuracy(Math.round(position.coords.accuracy));
        
        try {
          // Reverse Geocoding API to auto-generate string address from GPS
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAutoAddress(data.display_name);
          }
        } catch (e) {
          console.log("Geocoding failed, using coordinates instead.");
        } finally {
          setIsLoadingAddress(false);
        }
      }, (err) => {
        console.error(err);
        setError("Location access denied.");
        setIsLoadingAddress(false);
      });
    } else {
      setError("Geolocation not supported.");
      setIsLoadingAddress(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!phone || (!autoAddress && !manualAddress)) {
      setError("Please provide your phone number and delivery address.");
      return;
    }

    const isSame = phone === (profileData?.phone || "") &&
                   manualAddress === (profileData?.manualAddress || "") &&
                   autoAddress === (profileData?.autoAddress || "");

    if (isSame) {
      setError("");
      setIsAddressSaved(true);
      return;
    }

    setError("");
    setIsSaving(true);
    
    if (!auth.currentUser) {
      setIsSaving(false);
      return;
    }

    try {
      const finalAddress = `${manualAddress ? manualAddress + ', ' : ''}${autoAddress}`;
      const payload = JSON.parse(JSON.stringify({
        phone: phone || "", 
        autoAddress: autoAddress || "", 
        manualAddress: manualAddress || "",
        address: finalAddress || "",
        lat: lat || "", 
        lng: lng || "",
        name: user?.name || "User",
        email: user?.email || "",
      }));

      // Optimistic UI update: Instantly switch to saved view
      setIsAddressSaved(true);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...payload,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
    } catch (err: any) {
      setError(err.message || "Failed to save address.");
      setIsAddressSaved(false); // Re-open on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckout = async () => {
    if (!user || !auth.currentUser) {
      setError("Please login to place your order.");
      return;
    }
    
    if (!phone || (!autoAddress && !manualAddress)) {
      setError("Please provide delivery details.");
      return;
    }
    
    if (!isAddressSaved) {
      setError("Please save your address before proceeding.");
      return;
    }

    setError("");
    setIsCheckingOut(true);

    try {
      const finalAddress = `${manualAddress ? manualAddress + ', ' : ''}${autoAddress}`;
      const orderData = {
        userId: auth.currentUser.uid,
        customerName: user.name || "User",
        customerEmail: user.email || "",
        phone: phone || "",
        autoAddress: autoAddress || "",
        manualAddress: manualAddress || "",
        address: finalAddress || "",
        lat: lat || "",
        lng: lng || "",
        items: items,
        subtotal: cartTotal,
        shipping: shipping,
        total: finalTotal,
        status: "Processing",
        paymentMethod: paymentMethod,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);
      
      // Save the delivery details to the user's profile
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name: user.name,
        email: user.email,
        phone: phone,
        address: finalAddress,
        lat: lat,
        lng: lng,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      // Generate WhatsApp Message
      const itemList = items.map(item => `${item.quantity}x ${item.product.name}`).join('\n');
      const waText = `*New Order Alert!*\n\n*Customer:* ${user.name}\n*Phone:* ${phone}\n*Address:* ${finalAddress}\n\n*Items:*\n${itemList}\n\n*Total:* ₹${finalTotal}\n*Payment Method:* ${paymentMethod.toUpperCase()}`;
      const waUrl = `https://wa.me/917799934943?text=${encodeURIComponent(waText)}`;
      
      setWhatsappUrl(waUrl);
      
      // Try to open WhatsApp automatically
      setTimeout(() => window.open(waUrl, '_blank'), 300);

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Checkout failed:", err);
      setError("Failed to process order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] w-16 h-16 bg-brand-red text-brand-bg shadow-2xl shadow-brand-red/40 flex items-center justify-center group border border-brand-red-light rounded-full"
      >
        <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-text text-brand-bg text-[10px] font-bold flex items-center justify-center border border-brand-bg rounded-full">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[30rem] bg-brand-bg shadow-2xl z-[80] overflow-hidden flex flex-col border-l border-brand-text/10"
            >
              {/* Header */}
              <div className="p-6 md:p-8 flex justify-between items-center border-b border-brand-text/10 bg-brand-surface/50">
                <h2 className="text-2xl font-serif text-brand-text flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-brand-red" /> Your Cart
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-brand-surface rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-text" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 hide-scrollbar">
                {orderSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                    <h3 className="text-3xl font-serif text-brand-text mb-2">Order placed successfully!</h3>
                    <p className="text-brand-text/60 font-light mb-8">Our agent will get in contact with you shortly.</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-brand-text/20 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand-surface transition-colors flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" /> Continue to WhatsApp
                    </a>
                  </div>
                ) : items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="text-xl font-serif">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex gap-4 p-4 bg-brand-surface/30 rounded-2xl border border-brand-text/5">
                        <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl bg-brand-surface" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-brand-text pr-4">{item.product.name}</h4>
                            <button onClick={() => removeFromCart(item.product.id)} className="text-brand-text/40 hover:text-brand-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center border border-brand-text/10 rounded-full bg-brand-bg">
                              <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="p-1 hover:bg-brand-surface rounded-full"><Minus className="w-3 h-3 text-brand-text" /></button>
                              <span className="w-8 text-center text-xs font-medium text-brand-text">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 hover:bg-brand-surface rounded-full"><Plus className="w-3 h-3 text-brand-text" /></button>
                            </div>
                            <span className="font-serif text-brand-text">₹{item.product.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Order Summary */}
              {!orderSuccess && items.length > 0 && (
                <div className="p-6 md:p-8 bg-brand-surface/50 border-t border-brand-text/10">
                  <div className="flex flex-col gap-3 mb-6 text-sm font-light text-brand-text/80">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${shipping}`}</span></div>
                    <div className="h-px bg-brand-text/10 my-1" />
                    <div className="flex justify-between text-lg font-serif text-brand-text"><span>Total</span><span>₹{finalTotal}</span></div>
                  </div>
                  
                  {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
                  
                  {user ? (
                    <div className="flex flex-col gap-5">
                      {isAddressSaved ? (
                        <div className="bg-brand-bg p-4 rounded-xl border border-brand-text/10 relative">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] tracking-widest uppercase text-brand-red font-bold">Default Address</p>
                            <button onClick={() => setIsAddressSaved(false)} className="text-brand-red text-xs hover:underline uppercase tracking-widest font-bold">Edit</button>
                          </div>
                          <p className="text-sm font-medium text-brand-text mb-1">{phone}</p>
                          <p className="text-sm text-brand-text/80 leading-relaxed line-clamp-2 mb-1">{manualAddress || "No manual address provided"}</p>
                          {autoAddress && (
                            <p className="text-green-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Auto Location Detected</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 p-4 bg-brand-surface/30 rounded-xl border border-brand-text/10">
                          <p className="text-[10px] tracking-widest uppercase text-brand-text/50 font-medium mb-1">Add Delivery Details</p>
                          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                          
                          <div className="flex gap-2">
                            <input type="text" placeholder="Latitude" value={lat} readOnly className="w-1/2 bg-brand-bg/50 border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text/40 cursor-not-allowed" />
                            <input type="text" placeholder="Longitude" value={lng} readOnly className="w-1/2 bg-brand-bg/50 border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text/40 cursor-not-allowed" />
                          </div>
                          {accuracy !== null && (
                            <p className="text-[10px] text-brand-text/50 ml-1 -mt-1 font-medium tracking-wide">Accuracy: within {accuracy} meters</p>
                          )}
                          
                          <button onClick={handleGetLocation} disabled={isLoadingAddress} className="w-full py-2.5 bg-brand-text text-brand-bg text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-text/80 transition-colors flex justify-center items-center gap-2">
                            {isLoadingAddress ? "Detecting Location..." : <><MapPin className="w-3 h-3" /> Detect Location</>}
                          </button>

                          {autoAddress && (
                            <div className="flex items-center gap-2 text-green-500 text-xs font-medium bg-green-500/10 p-3 rounded-xl border border-green-500/20 mt-1">
                              <CheckCircle className="w-4 h-4" /> Auto Location Detected
                            </div>
                          )}
                        <textarea placeholder="Manual Entry (House No, Flat, Landmark)" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} rows={2} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors resize-none mt-1"></textarea>
                          
                          <button onClick={handleSaveAddress} disabled={isSaving} className="w-full py-3 border border-brand-red text-brand-red text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red hover:text-brand-bg transition-colors mt-1 disabled:opacity-50">
                            {isSaving ? "Saving..." : "Save Address"}
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] tracking-widest uppercase text-brand-text/50 font-medium ml-1">Payment Method</p>
                        <div className="grid grid-cols-3 gap-2">
                          {['upi', 'card', 'cod'].map((method) => (
                            <button key={method} onClick={() => setPaymentMethod(method)} className={`py-3 text-xs tracking-widest uppercase font-medium rounded-xl border transition-all ${paymentMethod === method ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-brand-text/10 text-brand-text/60 hover:border-brand-text/30 bg-brand-bg'}`}>
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full py-4 mt-2 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm rounded-2xl hover:bg-brand-red-light transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-brand-red/20">
                        {isCheckingOut ? "Processing..." : `Pay ₹${finalTotal}`} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-4 bg-brand-text text-brand-bg font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-text/80 transition-colors flex items-center justify-center gap-3">
                      Login to Checkout
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

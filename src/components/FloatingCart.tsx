import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth, db, auth, Address } from "./AuthContext";
import { useState, useEffect } from "react";
import { ref, push, set, serverTimestamp } from "firebase/database";
import { Link } from "react-router-dom";

export function FloatingCart() {
  const { items, totalItems, subtotal, deliveryCharge, tax, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, userAddresses } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  
  // Address Selection State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // Always ensure a default address is selected if none is chosen
  useEffect(() => {
    if (userAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
      setSelectedAddressId(defaultAddr?.id || null);
    }
  }, [userAddresses, selectedAddressId]);

  // Reset success screen when drawer closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setOrderSuccess(false), 300); // 300ms delay to allow close animation to finish smoothly
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSaveAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setError("Please provide all required address fields.");
      return;
    }

    setError("");
    setIsSavingAddress(true);
    
    if (!auth.currentUser) {
      setIsSavingAddress(false);
      return;
    }

    try {
      let isFirst = userAddresses.length === 0;
      const addressPayload = {
        ...newAddress,
        isDefault: isFirst
      };

      const newAddrRef = push(ref(db, `users/${auth.currentUser.uid}/addresses`));
      set(newAddrRef, addressPayload)
        .then(() => {
          setSelectedAddressId(newAddrRef.key);
          setIsAddingNewAddress(false);
          setNewAddress({
            fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", landmark: ""
          });
        })
        .catch(err => {
          setError(err.message || "Failed to save address.");
        })
        .finally(() => setIsSavingAddress(false));
    } catch (err: any) {
      setError(err.message || "Failed to save address.");
      setIsSavingAddress(false);
    }
  };

  const handleCheckout = async (viaWhatsApp: boolean = false) => {
    if (!user || !auth.currentUser) {
      setError("Please login to place your order.");
      return;
    }
    
    if (!selectedAddressId) {
      setError("Please select or add a delivery address.");
      return;
    }

    setError("");
    setIsCheckingOut(true);

    try {
      const deliveryAddress = userAddresses.find(a => a.id === selectedAddressId);
      if (!deliveryAddress) {
        throw new Error("Selected address not found");
      }
      const finalAddressStr = `${deliveryAddress.addressLine1}${deliveryAddress.addressLine2 ? ', ' + deliveryAddress.addressLine2 : ''}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`;

      const orderData = {
        userId: auth.currentUser.uid,
        customerName: user.name || "User",
        customerEmail: user.email || "",
        phone: deliveryAddress.phone || "",
        address: finalAddressStr,
        fullAddressObj: deliveryAddress,
        items: items,
        subtotal: subtotal,
        tax: tax,
        shipping: deliveryCharge,
        total: total,
        status: "Processing",
        paymentMethod: viaWhatsApp ? "whatsapp" : paymentMethod,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        createdAt: serverTimestamp(),
      };

      const orderRef = push(ref(db, "orders"));
      await set(orderRef, orderData);

      // Generate WhatsApp Message
      const itemList = items.map(item => `${item.quantity}x ${item.product.name}`).join('\n');
      const waText = `*New Order Alert!*\n\n*Order ID:* ${orderRef.key?.slice(-8)?.toUpperCase() || 'N/A'}\n*Customer:* ${user.name}\n*Phone:* ${deliveryAddress.phone}\n*Address:* ${finalAddressStr}\n\n*Items:*\n${itemList}\n\n*Subtotal:* ₹${subtotal}\n*Shipping:* ${deliveryCharge === 0 ? 'Free' : '₹' + deliveryCharge}\n*Total:* ₹${total}\n*Payment Method:* ${viaWhatsApp ? 'WhatsApp Payment' : paymentMethod.toUpperCase()}`;
      const waUrl = `https://wa.me/917799934943?text=${encodeURIComponent(waText)}`;
      
      setWhatsappUrl(waUrl);
      
      if (viaWhatsApp) {
        setTimeout(() => window.open(waUrl, '_blank'), 300);
      }

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
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-brand-text/40 backdrop-blur-sm z-[70]"
          />
        )}
        {isOpen && (
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed top-0 right-0 h-full w-full md:w-[30rem] bg-brand-bg shadow-2xl z-[80] overflow-hidden flex flex-col border-l border-brand-text/10"
          >
              {/* Header */}
              <div className="p-6 md:p-8 flex justify-between items-center border-b border-brand-text/10 bg-brand-surface/50 shrink-0">
                <h2 className="text-2xl font-serif text-brand-text flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-brand-red" /> Your Cart
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-brand-surface rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-text" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
                <div className={`p-6 md:p-8 ${orderSuccess || items.length === 0 ? 'flex-1 flex flex-col' : ''}`}>
                  <AnimatePresence mode="wait">
                {orderSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                    <h3 className="text-3xl font-serif text-brand-text mb-2">Order placed successfully!</h3>
                    <p className="text-brand-text/60 font-light mb-8">Our agent will get in contact with you shortly.</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 mb-4 bg-[#25D366] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-[#1da851] transition-colors flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" /> Continue to WhatsApp
                    </a>
                    <button onClick={() => setIsOpen(false)} className="px-6 py-3 border border-brand-text/20 text-brand-text rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand-surface transition-colors">
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : items.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="text-xl font-serif">Your cart is empty</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                    {items.map((item) => (
                      <motion.div layout key={item.product.id} className="flex gap-4 p-4 bg-brand-surface/30 rounded-2xl border border-brand-text/5">
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
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                </AnimatePresence>
                </div>

                {/* Footer / Order Summary */}
                {!orderSuccess && items.length > 0 && (
                  <div className="p-6 md:p-8 bg-brand-surface/50 border-t border-brand-text/10 mt-auto shrink-0">
                  <div className="flex flex-col gap-3 mb-6 text-sm font-light text-brand-text/80">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between"><span>Delivery</span><span>{deliveryCharge === 0 ? <span className="text-green-600 font-medium">Free</span> : `₹${deliveryCharge}`}</span></div>
                    <div className="h-px bg-brand-text/10 my-1" />
                    <div className="flex justify-between text-lg font-serif text-brand-text"><span>Total</span><span>₹{total}</span></div>
                  </div>
                  
                  {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
                  
                  {user ? (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] tracking-widest uppercase text-brand-text/50 font-medium">Delivery Address</p>
                          {!isAddingNewAddress && (
                            <button onClick={() => setIsAddingNewAddress(true)} className="text-brand-red text-xs font-bold uppercase tracking-widest hover:underline">+ Add New</button>
                          )}
                        </div>
                        
                        {!isAddingNewAddress && userAddresses.length > 0 ? (
                          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto hide-scrollbar">
                            {userAddresses.map((addr) => (
                              <div 
                                key={addr.id} 
                                onClick={() => setSelectedAddressId(addr.id!)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-red bg-brand-red/5' : 'border-brand-text/10 bg-brand-bg hover:border-brand-text/30'}`}
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-brand-text text-sm font-medium">{addr.fullName} <span className="text-brand-text/60 ml-2">{addr.phone}</span></p>
                                  {selectedAddressId === addr.id && <CheckCircle className="w-4 h-4 text-brand-red" />}
                                </div>
                                <p className="text-brand-text/80 text-xs mt-1 leading-relaxed">
                                  {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br/>
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                        <div className="flex flex-col gap-3 p-4 bg-brand-surface/30 rounded-xl border border-brand-text/10">
                          <input type="text" placeholder="Full Name *" value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                          <input type="tel" placeholder="Phone Number *" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                          <input type="text" placeholder="Address Line 1 *" value={newAddress.addressLine1} onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <input type="text" placeholder="City *" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                            <input type="text" placeholder="Pincode *" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                          </div>
                          <input type="text" placeholder="State *" value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                          <div className="flex gap-2 mt-1">
                            {userAddresses.length > 0 && (
                              <button onClick={() => setIsAddingNewAddress(false)} className="w-1/3 py-3 border border-brand-text/20 text-brand-text text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-surface transition-colors">Cancel</button>
                            )}
                            <button onClick={handleSaveAddress} disabled={isSavingAddress} className="flex-1 py-3 bg-brand-red text-brand-bg text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red-light transition-colors disabled:opacity-50">
                              {isSavingAddress ? "Saving..." : "Save & Select"}
                          </button>
                          </div>
                        </div>
                      )}
                      </div>

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
                      
                      <div className="flex flex-col gap-3 mt-2">
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleCheckout(false)} disabled={isCheckingOut} className="w-full py-4 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm rounded-2xl hover:bg-brand-red-light transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-brand-red/20 hover:-translate-y-0.5">
                          {isCheckingOut ? "Processing..." : `Pay ₹${total}`} <ArrowRight className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleCheckout(true)} disabled={isCheckingOut} className="w-full py-4 bg-[#25D366] text-white font-medium tracking-widest uppercase text-sm rounded-2xl hover:bg-[#1da851] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#25D366]/20 hover:-translate-y-0.5">
                          Order via WhatsApp
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <motion.div whileTap={{ scale: 0.98 }} className="w-full py-4 bg-brand-text text-brand-bg font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-text/80 transition-colors flex items-center justify-center gap-3 hover:-translate-y-0.5 shadow-lg shadow-brand-text/10">
                        Login to Checkout
                      </motion.div>
                    </Link>
                  )}
                </div>
              )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from "react";
import { useAuth, db, auth } from "../components/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, ShoppingBag, Clock, Package, User, LogOut, CheckCircle2, ChevronRight, AlertTriangle, X } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export function Profile() {
  const { user, logout, profileData, userOrders } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [phone, setPhone] = useState("");
  const [autoAddress, setAutoAddress] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const timelineSteps = ["Processing", "Preparing", "Shipped", "Out for Delivery", "Delivered"];

  useEffect(() => {
    if (profileData && !hasInitialized) {
      setPhone(profileData.phone || "");
      setAutoAddress(profileData.autoAddress || profileData.address || "");
      setManualAddress(profileData.manualAddress || "");
      setLat(profileData.lat || "");
      setLng(profileData.lng || "");
      setHasInitialized(true);
      
      if (!profileData.phone && !profileData.address && !profileData.autoAddress && !profileData.manualAddress) {
        setIsEditingAddress(true);
      }
    }
  }, [profileData, hasInitialized]);

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
        setAddressError("Location access denied.");
        setIsLoadingAddress(false);
      });
    } else {
      setAddressError("Geolocation not supported.");
      setIsLoadingAddress(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!phone || (!autoAddress && !manualAddress)) {
      setAddressError("Please provide your phone number and delivery address.");
      return;
    }

    const isSame = phone === (profileData?.phone || "") &&
                   manualAddress === (profileData?.manualAddress || "") &&
                   autoAddress === (profileData?.autoAddress || "");

    if (isSame) {
      setAddressError("");
      setIsEditingAddress(false);
      return;
    }

    setAddressError("");
    setIsSaving(true);
    
    if (!auth.currentUser) {
      setIsSaving(false);
      return;
    }

    try {
      const finalAddress = `${manualAddress ? manualAddress + ', ' : ''}${autoAddress}`;
      
      let prevAddresses = profileData?.savedAddresses || [];
      if (profileData?.address && profileData.address !== finalAddress) {
        const oldAddressObj = {
          id: "addr-" + Date.now(),
          phone: profileData.phone || "",
          lat: profileData.lat || "",
          lng: profileData.lng || "",
          autoAddress: profileData.autoAddress || "",
          manualAddress: profileData.manualAddress || "",
          address: profileData.address || ""
        };
        if (!prevAddresses.some((a: any) => a.address === oldAddressObj.address)) {
          prevAddresses = [oldAddressObj, ...prevAddresses];
        }
      }
      prevAddresses = prevAddresses.filter((a: any) => a.address !== finalAddress);

      // Sanitize payload: Removes hidden undefined values that crash Firestore
      const payload = JSON.parse(JSON.stringify({
        phone: phone || "", 
        lat: lat || "", 
        lng: lng || "",
        autoAddress: autoAddress || "", 
        manualAddress: manualAddress || "",
        address: finalAddress || "",
        name: user?.name || "User",
        email: user?.email || "",
        savedAddresses: prevAddresses || []
      }));

      // Optimistic UI update: Instantly close editor for snappy UX
      setIsEditingAddress(false);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...payload,
        lastUpdated: serverTimestamp()
      }, { merge: true });
        
      } catch (err: any) {
        console.error("Error saving address:", err);
        setAddressError(err.message || "Failed to save address.");
        setIsEditingAddress(true); // Re-open if it actually failed
      } finally {
        setIsSaving(false);
      }
  };

  const handleSetDefaultAddress = async (addr: any) => {
    if (!auth.currentUser) return;
    try {
      let prevAddresses = profileData?.savedAddresses || [];
      if (profileData?.address) {
        const oldAddressObj = {
          id: "addr-" + Date.now(),
          phone: profileData.phone || "",
          lat: profileData.lat || "",
          lng: profileData.lng || "",
          autoAddress: profileData.autoAddress || "",
          manualAddress: profileData.manualAddress || "",
          address: profileData.address
        };
        if (!prevAddresses.some((a: any) => a.address === oldAddressObj.address)) {
          prevAddresses = [oldAddressObj, ...prevAddresses];
        }
      }
      prevAddresses = prevAddresses.filter((a: any) => a.id !== addr.id && a.address !== addr.address);

      const payload = JSON.parse(JSON.stringify({
        phone: addr.phone || "",
        lat: addr.lat || "",
        lng: addr.lng || "",
        autoAddress: addr.autoAddress || "",
        manualAddress: addr.manualAddress || "",
        address: addr.address || "",
        savedAddresses: prevAddresses
      }));

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        ...payload,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      setPhone(addr.phone || "");
      setAutoAddress(addr.autoAddress || "");
      setManualAddress(addr.manualAddress || "");
      setLat(addr.lat || "");
      setLng(addr.lng || "");
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-between items-start border-b border-brand-text/10 pb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif text-brand-text mb-2">My Account</h1>
            <p className="text-brand-text/60 font-light tracking-widest uppercase text-sm">Welcome back, {user.name}</p>
          </div>
          <Link to="/" className="p-2 hover:bg-brand-surface rounded-full transition-colors mt-2">
            <X className="w-6 h-6 text-brand-text" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile Details Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10">
              <h3 className="text-xl font-serif text-brand-text mb-6 flex items-center gap-2 uppercase"><MapPin className="w-5 h-5 text-brand-red" /> SAVED ADDRESSES</h3>
              
              {!profileData ? (
                <p className="text-brand-text/40 text-sm">Loading details...</p>
              ) : isEditingAddress ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] tracking-widest uppercase text-brand-text/50 font-medium mb-1">Update Delivery Details</p>
                  {addressError && <p className="text-red-500 text-xs">{addressError}</p>}
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
                      <CheckCircle2 className="w-4 h-4" /> Auto Location Detected
                    </div>
                  )}
                  <textarea placeholder="Manual Entry (House No, Flat, Landmark)" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} rows={2} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors resize-none mt-1"></textarea>
                  
                  <div className="flex gap-2 mt-1">
                    {(profileData?.autoAddress || profileData?.address) && (
                      <button onClick={() => setIsEditingAddress(false)} className="w-1/3 py-3 border border-brand-text/20 text-brand-text text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-surface transition-colors">
                        Cancel
                      </button>
                    )}
                    <button onClick={handleSaveAddress} disabled={isSaving} className="flex-1 py-3 bg-brand-red text-brand-bg text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red-light transition-colors disabled:opacity-50">
                      {isSaving ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-brand-text/80 text-sm font-light">
                  <div className="flex flex-col"><span className="text-brand-text/40 text-xs tracking-widest uppercase mb-1">Email</span>{user.email}</div>
                  
                  <div className="bg-brand-bg p-4 rounded-xl border border-brand-red/30 relative mt-2 shadow-sm">
                    <span className="absolute top-0 right-0 bg-brand-red text-brand-bg text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-bl-lg rounded-tr-xl">Active Default</span>
                    <div className="flex flex-col pr-16 mb-4">
                      <span className="text-brand-red text-[10px] font-bold tracking-widest uppercase mb-1">Default Address</span>
                      <span className="text-brand-text text-sm font-medium mb-1">{profileData.phone || "No phone provided"}</span>
                      <span className="leading-relaxed text-brand-text/80 text-sm mb-1">{profileData.manualAddress || "No manual address provided"}</span>
                      {profileData.autoAddress && (
                        <span className="text-green-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Auto Location Detected</span>
                      )}
                    </div>
                    <button onClick={() => { setIsEditingAddress(true); handleGetLocation(); }} className="w-full py-2.5 border border-brand-text/20 text-brand-text text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-surface transition-colors">
                      Edit Default Address
                    </button>
                  </div>

                  {profileData?.savedAddresses && profileData.savedAddresses.length > 0 && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-brand-text/10 pt-6">
                      <h4 className="text-xs tracking-widest uppercase text-brand-text/50 font-medium mb-2">Previous Addresses</h4>
                      {profileData.savedAddresses.map((addr: any) => (
                        <div key={addr.id} className="bg-brand-surface/30 p-4 rounded-xl border border-brand-text/10 flex flex-col gap-3">
                          <div>
                            <p className="text-brand-text text-sm font-medium mb-1">{addr.phone}</p>
                            <p className="text-brand-text/80 text-sm leading-relaxed mb-1">{addr.manualAddress || "No manual address provided"}</p>
                            {addr.autoAddress && (
                              <p className="text-green-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Auto Location Detected</p>
                            )}
                          </div>
                          <button onClick={() => handleSetDefaultAddress(addr)} className="w-full py-2 bg-brand-text/5 hover:bg-brand-text/10 border border-brand-text/10 text-brand-text text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
                            Set as Default
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Orders History Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
            <h3 className="text-2xl font-serif text-brand-text mb-6 flex items-center gap-3"><ShoppingBag className="w-6 h-6 text-brand-red" /> Order History</h3>
            
            {!profileData ? (
              <p className="text-brand-text/40">Loading orders...</p>
            ) : userOrders.length === 0 ? (
              <div className="bg-brand-surface/30 p-12 rounded-[2rem] border border-brand-text/10 text-center flex flex-col items-center">
                <Package className="w-12 h-12 text-brand-text/20 mb-4" />
                <p className="text-brand-text/60 font-light text-lg">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {userOrders.map(order => (
                  <div key={order.id} className="bg-brand-surface/30 rounded-2xl border border-brand-text/10 overflow-hidden hover:border-brand-text/20 transition-colors">
                    <div 
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-brand-surface/20 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-brand-text">Order #{order.id.slice(-6).toUpperCase()}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-medium ${order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' : order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-brand-text/10 text-brand-text/70'}`}>{order.status}</span>
                        </div>
                        <div className="text-xs text-brand-text/50 flex items-center gap-2"><Clock className="w-3 h-3" /> {order.date} • {order.items?.length || 0} items</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-serif text-brand-text">₹{order.total}</div>
                        <ChevronRight className={`w-5 h-5 text-brand-text/40 transition-transform ${expandedOrderId === order.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedOrderId === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-brand-text/5 bg-brand-surface/10"
                        >
                          <div className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                              <h4 className="text-xs tracking-widest uppercase font-medium text-brand-text/50">Items</h4>
                              {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                  <span className="text-brand-text/80"><span className="font-bold text-brand-text mr-2">{item.quantity}x</span> {item.product?.name || item.name}</span>
                                  <span className="font-serif">₹{(item.product?.price || item.price) * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-col gap-3 pt-4 border-t border-brand-text/5">
                              <h4 className="text-xs tracking-widest uppercase font-medium text-brand-text/50">Payment Details</h4>
                              <div className="flex justify-between text-sm">
                                <span className="text-brand-text/80">Method</span>
                                <span className="uppercase font-medium text-brand-text">{order.paymentMethod || 'UPI'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-brand-text/80">Shipping</span>
                                <span className="font-serif">{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Right Logout Button */}
        <div className="mt-16 flex justify-end border-t border-brand-text/10 pt-8">
          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-brand-red/50 text-brand-red hover:bg-brand-red hover:text-brand-bg transition-colors text-xs font-bold tracking-widest uppercase"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setShowLogoutConfirm(false)} 
              className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-brand-surface border border-brand-text/10 p-8 rounded-[2rem] shadow-2xl relative z-10 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-serif text-brand-text mb-2">Sign Out</h3>
              <p className="text-brand-text/60 text-sm font-light mb-8">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-xl border border-brand-text/20 text-brand-text text-xs font-bold tracking-widest uppercase hover:bg-brand-bg transition-colors">Cancel</button>
                <button onClick={logout} className="flex-1 py-3 rounded-xl bg-brand-red text-brand-bg text-xs font-bold tracking-widest uppercase hover:bg-brand-red-light transition-colors">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
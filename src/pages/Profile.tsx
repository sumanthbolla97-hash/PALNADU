import { useState, useEffect } from "react";
import { useAuth, db, auth, Address, Order } from "../components/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, ShoppingBag, Clock, Package, User, LogOut, CheckCircle2, ChevronRight, AlertTriangle, X, Edit2, Trash2, Plus, Receipt, RotateCcw } from "lucide-react";
import { ref, push, set, update, remove } from "firebase/database";
import { useCart } from "../components/CartContext";

export function Profile() {
  const { user, logout, profileData, userOrders, userAddresses } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false
  });

  const timelineSteps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReorder = (order: Order) => {
    order.items?.forEach((item) => {
      if (item.product) {
        addToCart(item.product, item.quantity);
      }
    });
    setToastMessage("Items added to cart!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const content = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .subtitle { color: #666; font-size: 14px; }
            .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
            table { border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
            th { background: #f9f9f9; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .totals { width: 300px; margin-left: auto; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.bold { font-weight: bold; font-size: 18px; border-top: 2px solid #eee; margin-top: 8px; padding-top: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">INVOICE</h1>
              <p class="subtitle">Palnadu Spices</p>
            </div>
            <div style="text-align: right">
              <p style="margin:0; font-weight:bold;">Order #${order.id?.slice(-8)?.toUpperCase() ?? 'N/A'}</p>
              <p class="subtitle">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <p style="margin:0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase;">Billed To</p>
              <p style="margin:0; font-weight:bold;">${order.customerName}</p>
              <p style="margin:5px 0; color:#444;">${order.phone}</p>
              <p style="margin:0; color:#444; max-width: 250px;">${order.address}</p>
            </div>
            <div style="text-align: right">
              <p style="margin:0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase;">Payment Method</p>
              <p style="margin:0; font-weight:bold; text-transform: uppercase;">${order.paymentMethod || 'UPI'}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items?.map((item) => `
                <tr>
                  <td>${item.product?.name || item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.product?.price || item.price}</td>
                  <td style="text-align:right">₹${(item.product?.price || item.price) * item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>₹${order.subtotal || order.total}</span>
            </div>
            <div class="totals-row">
              <span>Shipping</span>
              <span>${order.shipping === 0 ? 'Free' : `₹${order.shipping || 0}`}</span>
            </div>
            <div class="totals-row bold">
              <span>Total</span>
              <span>₹${order.total}</span>
            </div>
          </div>
          
          <script>
            window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const handleAddNewAddress = () => {
    setFormData({ fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", landmark: "", isDefault: userAddresses.length === 0 });
    setEditingAddressId(null);
    setIsEditingAddress(true);
  };

  const handleEditAddress = (addr: Address) => {
    setFormData({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      landmark: addr.landmark || "",
      isDefault: addr.isDefault || false
    });
    setEditingAddressId(addr.id || null);
    setIsEditingAddress(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await remove(ref(db, `users/${auth.currentUser.uid}/addresses/${id}`));
      const deletedWasDefault = userAddresses.find(a => a.id === id)?.isDefault;
      if (deletedWasDefault) {
        const remaining = userAddresses.filter(a => a.id !== id);
        if (remaining.length > 0) {
          await update(ref(db, `users/${auth.currentUser.uid}/addresses/${remaining[0].id!}`), { isDefault: true });
        }
      }
    } catch (e) {
      console.error("Error deleting address", e);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      const updates: any = {};
      userAddresses.forEach(addr => {
        if (addr.id === id) {
          updates[`users/${auth.currentUser.uid}/addresses/${addr.id}/isDefault`] = true;
        } else if (addr.isDefault) {
          updates[`users/${auth.currentUser.uid}/addresses/${addr.id}/isDefault`] = false;
        }
      });
      await update(ref(db), updates);
    } catch (e) {
      console.error("Error setting default address", e);
    }
  };

  const handleSaveAddress = async () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      setAddressError("Please fill in all required fields (Name, Phone, Address Line 1, City, State, Pincode).");
      return;
    }
    setAddressError("");
    setIsSaving(true);
    
    try {
      if (!auth.currentUser) return;
      
      let finalIsDefault = formData.isDefault;
      if (userAddresses.length === 0) finalIsDefault = true;

      const newAddress = {
        fullName: formData.fullName,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
        isDefault: finalIsDefault
      };

      if (finalIsDefault) {
        const updates: any = {};
        userAddresses.forEach(addr => {
           if (addr.isDefault && addr.id !== editingAddressId) {
             updates[`users/${auth.currentUser.uid}/addresses/${addr.id}/isDefault`] = false;
           }
        });
        await update(ref(db), updates);
      }

      if (editingAddressId) {
        await update(ref(db, `users/${auth.currentUser.uid}/addresses/${editingAddressId}`), newAddress);
      } else {
        const newRef = push(ref(db, `users/${auth.currentUser.uid}/addresses`));
        await set(newRef, newAddress);
      }

      setIsEditingAddress(false);
    } catch (e: any) {
      setAddressError(e.message || "Failed to save address.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
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
                  <p className="text-[10px] tracking-widest uppercase text-brand-text/50 font-medium mb-1">{editingAddressId ? "Edit" : "Add"} Delivery Address</p>
                  {addressError && <p className="text-red-500 text-xs">{addressError}</p>}
                  
                  <input type="text" placeholder="Full Name *" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  <input type="tel" placeholder="Phone Number *" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  <input type="text" placeholder="Address Line 1 (House No, Building) *" value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  <input type="text" placeholder="Address Line 2 (Area, Street)" value={formData.addressLine2} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="City *" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                    <input type="text" placeholder="State *" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Pincode *" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                    <input type="text" placeholder="Landmark" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} className="w-full bg-brand-bg border border-brand-text/10 rounded-xl py-3 px-4 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                  
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 accent-brand-red rounded" />
                    <span className="text-sm text-brand-text/80">Set as default address</span>
                  </label>

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setIsEditingAddress(false)} className="w-1/3 py-3 border border-brand-text/20 text-brand-text text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-surface transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSaveAddress} disabled={isSaving} className="flex-1 py-3 bg-brand-red text-brand-bg text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-red-light transition-colors disabled:opacity-50">
                      {isSaving ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 text-brand-text/80 text-sm font-light">
                  <div className="flex flex-col"><span className="text-brand-text/40 text-xs tracking-widest uppercase mb-1">Email</span>{user.email}</div>
                  
                  <div className="mt-2 flex flex-col gap-3">
                    <h4 className="text-xs tracking-widest uppercase text-brand-text/50 font-medium mb-2">Saved Addresses</h4>
                    {userAddresses.length === 0 && <p className="text-sm">No addresses saved yet.</p>}
                    {userAddresses.map((addr: Address) => (
                      <div key={addr.id} className={`p-4 rounded-xl border relative transition-colors ${addr.isDefault ? 'border-brand-red/50 bg-brand-red/5 shadow-sm' : 'border-brand-text/10 bg-brand-surface/30 hover:border-brand-text/30'}`}>
                        {addr.isDefault && <span className="absolute top-0 right-0 bg-brand-red text-brand-bg text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-bl-lg rounded-tr-xl">Default</span>}
                        <div className="flex flex-col pr-12 gap-1">
                          <p className="text-brand-text text-sm font-medium">{addr.fullName} <span className="text-brand-text/60 ml-2">{addr.phone}</span></p>
                          <div>
                            <p className="text-brand-text/80 text-sm leading-relaxed">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                            <p className="text-brand-text/80 text-sm leading-relaxed">{addr.city}, {addr.state} - {addr.pincode}</p>
                            {addr.landmark && <p className="text-brand-text/60 text-xs mt-1">Landmark: {addr.landmark}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefaultAddress(addr.id!)} className="flex-1 py-1.5 border border-brand-text/20 text-brand-text text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand-surface transition-colors">Set Default</button>
                          )}
                          <button onClick={() => handleEditAddress(addr)} className="p-2 bg-brand-text/5 hover:bg-brand-text/10 text-brand-text rounded-lg transition-colors" title="Edit Address"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteAddress(addr.id!)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" title="Delete Address"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={handleAddNewAddress} className="w-full py-3 mt-2 border border-dashed border-brand-text/30 text-brand-text text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-brand-surface hover:border-brand-text/50 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add New Address
                    </button>
                  </div>
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
                          <span className="text-sm font-medium text-brand-text">Order #{order.id?.slice(-6)?.toUpperCase() || 'N/A'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-medium ${order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' : order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-brand-text/10 text-brand-text/70'}`}>{order.status}</span>
                        </div>
                        <div className="text-xs text-brand-text/50 flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items</div>
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
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="border-t border-brand-text/5 bg-brand-surface/10 overflow-hidden"
                        >
                          <div className="p-6 flex flex-col gap-6">
                            {/* Status Timeline */}
                            <div className="px-2 py-8 mb-2 overflow-x-auto hide-scrollbar">
                              <div className="flex justify-between relative min-w-[300px]">
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-text/10 -translate-y-1/2"></div>
                                <div 
                                  className="absolute top-1/2 left-0 h-0.5 bg-brand-red transition-all duration-500 -translate-y-1/2" 
                                  style={{ width: `${(Math.max(0, timelineSteps.indexOf(order.status)) / (timelineSteps.length - 1)) * 100}%` }}
                                ></div>
                                
                                {timelineSteps.map((step, idx) => {
                                  const stepIndex = timelineSteps.indexOf(order.status);
                                  const isCompleted = stepIndex >= idx;
                                  const isCurrent = stepIndex === idx;
                                  
                                  return (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-brand-red border-brand-red shadow-[0_0_10px_rgba(255,51,51,0.4)]' : 'bg-brand-surface border-brand-text/20'} transition-all duration-500`} />
                                      <span className={`text-[9px] uppercase tracking-widest font-bold absolute top-6 whitespace-nowrap transition-colors duration-500 ${isCurrent ? 'text-brand-red' : isCompleted ? 'text-brand-text' : 'text-brand-text/40'}`}>{step}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="flex flex-col gap-3">
                                <h4 className="text-xs tracking-widest uppercase font-medium text-brand-text/50">Items</h4>
                                {order.items?.map((item, i: number) => (
                                  <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-brand-text/80"><span className="font-bold text-brand-text mr-2">{item.quantity}x</span> {item.product?.name || item.name}</span>
                                    <span className="font-serif">₹{(item.product?.price || item.price) * item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-col gap-3 md:pl-8 md:border-l border-brand-text/5">
                                <h4 className="text-xs tracking-widest uppercase font-medium text-brand-text/50">Summary</h4>
                                
                                <div className="flex flex-col gap-1 text-sm mb-2 text-brand-text/80">
                                  <span className="font-medium text-brand-text">Delivery To:</span>
                                  <span className="leading-relaxed text-xs">{order.address || "Address not available"}</span>
                                  <span className="mt-1 text-xs">Phone: {order.phone}</span>
                                </div>

                                <div className="flex justify-between text-sm pt-2 border-t border-brand-text/5">
                                  <span className="text-brand-text/80">Payment Method</span>
                                  <span className="font-medium uppercase">{order.paymentMethod || 'UPI'}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                  <span className="text-brand-text/80">Subtotal</span>
                                  <span className="font-serif">₹{order.subtotal || order.total}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-brand-text/80">Shipping</span>
                                  <span className="font-serif">{order.shipping === 0 ? 'Free' : `₹${order.shipping || 0}`}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium pt-2 border-t border-brand-text/5 mt-1">
                                  <span className="text-brand-text">Total</span>
                                  <span className="font-serif text-brand-text">₹{order.total}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-6 border-t border-brand-text/5">
                              <button 
                                onClick={() => handlePrintInvoice(order)}
                                className="px-6 py-2.5 bg-brand-surface border border-brand-text/10 hover:border-brand-text/30 text-brand-text text-xs font-bold tracking-widest uppercase rounded-full transition-colors flex items-center gap-2"
                              >
                                <Receipt className="w-4 h-4" /> Invoice
                              </button>
                              <button 
                                onClick={() => handleReorder(order)}
                                className="px-6 py-2.5 bg-brand-text text-brand-bg hover:bg-brand-text/80 text-xs font-bold tracking-widest uppercase rounded-full transition-colors flex items-center gap-2"
                              >
                                <RotateCcw className="w-4 h-4" /> Reorder
                              </button>
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
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(8px)" }} exit={{ opacity: 0, backdropFilter: "blur(0px)" }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setShowLogoutConfirm(false)} 
              className="absolute inset-0 bg-brand-bg/60" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, filter: "blur(4px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} exit={{ scale: 0.95, opacity: 0, filter: "blur(4px)" }} 
              transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-brand-text text-brand-bg px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
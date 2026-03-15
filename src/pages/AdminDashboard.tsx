import { useState, useEffect, Fragment } from "react";
import { useAuth, db } from "../components/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Package, Users, ShoppingBag, Activity, Search, TrendingUp, Clock, ChevronRight, ChevronDown, MapPin, Phone, LayoutDashboard, Settings, Bell, Tag, ArrowUpRight, DollarSign, Plus, Edit, Trash2, Menu, X, LogOut, ExternalLink, MoreVertical } from "lucide-react";
import { ref, onValue, push, set, update, serverTimestamp } from "firebase/database";

export function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bulk Update States
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Real-time Database States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // 1. Real-time Orders Listener
    const unsubscribeOrders = onValue(ref(db, "orders"), (snapshot) => {
      const data = snapshot.val() || {};
      const ordersList = Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val }));
      ordersList.sort((a, b) => {
        const timeA = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt ? Date.now() : 0);
        const timeB = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt ? Date.now() : 0);
        return timeB - timeA;
      });
      setOrders(ordersList);
    },
      (error) => console.log("Orders listener error (safe to ignore if DB is empty):", error.message)
    );

    // 2. Real-time Products Listener
    const unsubscribeProducts = onValue(ref(db, "products"), (snapshot) => {
      const data = snapshot.val() || {};
      setProducts(Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })));
    },
      (error) => console.log("Products listener error:", error.message)
    );

    // 3. Real-time Customers Listener
    const unsubscribeCustomers = onValue(ref(db, "users"), (snapshot) => {
      const data = snapshot.val() || {};
      setCustomers(Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val })));
    },
      (error) => console.log("Customers listener error:", error.message)
    );

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeCustomers();
    };
  }, [isAdmin]);

  // Real-time Status Update Function
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selectedOrders.length === 0) return;
    setIsUpdating(true);
    try {
      const updates: any = {};
      selectedOrders.forEach(id => {
        if (!id.startsWith('ORD-')) updates[`orders/${id}/status`] = bulkStatus;
      });
      await update(ref(db), updates);
      setSelectedOrders([]);
      setBulkStatus('');
    } catch (error) {
      console.error("Error bulk updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Mock Data Generators for Testing (A, B, C, D)
  const generateMockOrder = async (type: string) => {
    const mockData = {
      A: { customerName: "Rahul Sharma", customerEmail: "rahul@example.com", phone: "+91 9876543210", address: "123 Jubilee Hills, Hyderabad, TS", items: [{product: {name: "Palnadu Karam Podi", price: 299, image: "/traditional-spices.png"}, quantity: 2}], total: 598, status: "Processing", paymentMethod: "UPI" },
      B: { customerName: "Sneha Reddy", customerEmail: "sneha@example.com", phone: "+91 8765432109", address: "45 Banjara Hills, Hyderabad, TS", items: [{product: {name: "Guntur Idli Karam", price: 249, image: "/traditional-spices.png"}, quantity: 1}], total: 249, status: "Shipped", paymentMethod: "Card" },
      C: { customerName: "Karthik V.", customerEmail: "karthik@example.com", phone: "+91 7654321098", address: "789 Indiranagar, Bangalore, KA", items: [{product: {name: "Nallakaram Podi", price: 279, image: "/traditional-spices.png"}, quantity: 3}], total: 837, status: "Delivered", paymentMethod: "UPI" },
      D: { customerName: "Ananya S.", customerEmail: "ananya@example.com", phone: "+91 6543210987", address: "12 Anna Nagar, Chennai, TN", items: [{product: {name: "Palnadu Karam Podi", price: 299, image: "/traditional-spices.png"}, quantity: 5}], total: 1495, status: "Processing", paymentMethod: "COD" },
    };
    const order = mockData[type as keyof typeof mockData];
    
    const newOrderRef = push(ref(db, "orders"));
    await set(newOrderRef, {
      ...order,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      createdAt: serverTimestamp(),
      userId: "mock-test-user"
    });
  };

  // Fallback Mock Data (Shows if Firebase collections are empty)
  const baseOrders = orders.length > 0 ? orders : [
    { id: "ORD-9921", customerName: "Rahul Sharma", customerEmail: "rahul@example.com", phone: "+91 9876543210", address: "123 Jubilee Hills, Hyd", total: 1250, status: "Processing", date: "10 mins ago", items: [{product: {name: "Palnadu Karam Podi", price: 299, image: "/traditional-spices.png"}, quantity: 2}], paymentMethod: "UPI" },
    { id: "ORD-9920", customerName: "Sneha Reddy", customerEmail: "sneha@example.com", phone: "+91 8765432109", address: "45 Banjara Hills, Hyd", total: 850, status: "Shipped", date: "2 hours ago", items: [{product: {name: "Guntur Idli Karam", price: 249, image: "/traditional-spices.png"}, quantity: 1}], paymentMethod: "Card" },
    { id: "ORD-9919", customerName: "Karthik V.", customerEmail: "karthik@example.com", phone: "+91 7654321098", address: "789 Indiranagar, Blr", total: 3200, status: "Delivered", date: "1 day ago", items: [{product: {name: "Nallakaram Podi", price: 279, image: "/traditional-spices.png"}, quantity: 3}], paymentMethod: "UPI" }
  ];

  const displayOrders = baseOrders.filter(order => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.id?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.phone?.toLowerCase().includes(q) ||
      order.customerEmail?.toLowerCase().includes(q)
    );
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedOrders(displayOrders.map(o => o.id));
    else setSelectedOrders([]);
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]);
  };

  const displayProducts = products.length > 0 ? products : [
    { id: "P-1", name: "Palnadu Karam Podi", price: 299, stock: 145, status: "In Stock", sales: 1240 },
    { id: "P-2", name: "Guntur Idli Karam", price: 249, stock: 12, status: "Low Stock", sales: 856 },
    { id: "P-3", name: "Nallakaram Podi", price: 279, stock: 0, status: "Out of Stock", sales: 432 }
  ];

  const displayCustomers = customers.length > 0 ? customers : [
    { id: "C-1", name: "Rahul Sharma", email: "rahul.s@example.com", orders: 5, spent: 4500, joinDate: "Oct 12, 2023" },
    { id: "C-2", name: "Sneha Reddy", email: "sneha.r@example.com", orders: 2, spent: 1700, joinDate: "Nov 05, 2023" },
    { id: "C-3", name: "Karthik V.", email: "karthik.v@example.com", orders: 12, spent: 14200, joinDate: "Jan 22, 2023" }
  ];

  // If not logged in, or not the admin email, kick them out to home page
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-brand-bg pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif text-brand-text mb-2">Admin CRM</h1>
            <p className="text-brand-text/60 font-light tracking-widest uppercase text-sm">Welcome back, {user.name}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex gap-2 bg-brand-surface/50 p-1.5 rounded-full border border-brand-text/10 shadow-inner">
              {['A', 'B', 'C', 'D'].map(type => (
                <button key={type} onClick={() => generateMockOrder(type)} className="w-10 h-10 rounded-full bg-brand-bg border border-brand-text/10 flex items-center justify-center text-sm font-bold text-brand-text hover:bg-brand-red hover:text-brand-bg hover:border-brand-red transition-colors shadow-sm">{type}</button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/40" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-surface/30 border border-brand-text/10 rounded-full py-3 pl-12 pr-6 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-brand-text/10 relative">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'text-brand-bg' : 'text-brand-text/60 hover:bg-brand-surface hover:text-brand-text'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="adminTab" className="absolute inset-0 bg-brand-red rounded-full -z-10 shadow-lg shadow-brand-red/20" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
          
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-brand-text/5 rounded-xl"><TrendingUp className="w-6 h-6 text-brand-red" /></div>
                    <span className="text-brand-text/40 text-xs tracking-widest uppercase">Today</span>
                  </div>
                  <div>
                    <p className="text-brand-text/50 text-sm tracking-widest uppercase mb-1">Total Revenue</p>
                    <h3 className="text-4xl font-serif text-brand-text">₹24,500</h3>
                  </div>
                </div>
                
                <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-brand-text/5 rounded-xl"><ShoppingBag className="w-6 h-6 text-brand-red" /></div>
                    <span className="text-brand-text/40 text-xs tracking-widest uppercase">Active</span>
                  </div>
                  <div>
                    <p className="text-brand-text/50 text-sm tracking-widest uppercase mb-1">Pending Orders</p>
                    <h3 className="text-4xl font-serif text-brand-text">{displayOrders.length}</h3>
                  </div>
                </div>

                <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-3 bg-brand-text/5 rounded-xl"><Users className="w-6 h-6 text-brand-red" /></div>
                    <span className="text-brand-text/40 text-xs tracking-widest uppercase">Total</span>
                  </div>
                  <div>
                    <p className="text-brand-text/50 text-sm tracking-widest uppercase mb-1">Total Customers</p>
                    <h3 className="text-4xl font-serif text-brand-text">{displayCustomers.length}</h3>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {selectedOrders.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-brand-surface/50 border border-brand-text/10 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <span className="text-sm font-medium text-brand-text ml-2">{selectedOrders.length} orders selected</span>
                      <div className="flex gap-3 items-center w-full md:w-auto">
                        <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} className="bg-brand-bg border border-brand-text/10 rounded-lg px-4 py-2.5 text-sm text-brand-text focus:outline-none focus:border-brand-red w-full md:w-auto cursor-pointer">
                          <option value="">Update Status...</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button onClick={handleBulkUpdate} disabled={isUpdating || !bulkStatus} className="bg-brand-red text-brand-bg px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-red-light transition-colors disabled:opacity-50 whitespace-nowrap">
                          {isUpdating ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-brand-surface/30 rounded-[2rem] border border-brand-text/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-surface/50 text-brand-text/60 text-[10px] tracking-[0.2em] uppercase border-b border-brand-text/10">
                        <th className="py-6 px-6 w-12 text-center">
                          <input type="checkbox" checked={selectedOrders.length === displayOrders.length && displayOrders.length > 0} onChange={handleSelectAll} className="w-4 h-4 accent-brand-red cursor-pointer" />
                        </th>
                        <th className="py-6 px-8 font-medium">Order ID</th>
                        <th className="py-6 px-8 font-medium">Customer</th>
                        <th className="py-6 px-8 font-medium">Date</th>
                        <th className="py-6 px-8 font-medium">Total</th>
                        <th className="py-6 px-8 font-medium">Status</th>
                        <th className="py-6 px-8 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayOrders.map(order => (
                        <Fragment key={order.id}>
                          <tr 
                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            className="border-b border-brand-text/5 hover:bg-brand-surface/40 transition-colors group cursor-pointer"
                          >
                            <td className="py-6 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => toggleOrderSelection(order.id)} className="w-4 h-4 accent-brand-red cursor-pointer" />
                            </td>
                            <td className="py-6 px-8 text-brand-text text-sm font-medium">{order.id?.slice(-6)?.toUpperCase() || 'N/A'}</td>
                            <td className="py-6 px-8 text-brand-text/80 text-sm">{order.customerName}</td>
                            <td className="py-6 px-8 text-brand-text/60 text-sm flex items-center gap-2"><Clock className="w-3 h-3" /> {order.date}</td>
                            <td className="py-6 px-8 text-brand-text text-sm">₹{order.total}</td>
                            <td className="py-6 px-8" onClick={(e) => e.stopPropagation()}>
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold outline-none cursor-pointer appearance-none ${order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-brand-text/10 text-brand-text/70 border border-brand-text/20'}`}
                              >
                                <option value="Processing" className="text-brand-text bg-brand-bg">Processing</option>
                                <option value="Shipped" className="text-brand-text bg-brand-bg">Shipped</option>
                                <option value="Out for Delivery" className="text-brand-text bg-brand-bg">Out for Delivery</option>
                                <option value="Delivered" className="text-brand-text bg-brand-bg">Delivered</option>
                                <option value="Cancelled" className="text-brand-text bg-brand-bg">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-6 px-8 text-right">
                              <button className="text-brand-text/40 hover:text-brand-red transition-colors">
                                {expandedOrderId === order.id ? <ChevronDown className="w-5 h-5 ml-auto" /> : <ChevronRight className="w-5 h-5 ml-auto" />}
                              </button>
                            </td>
                          </tr>
                          
                          {/* Expanded Order Details Row */}
                          {expandedOrderId === order.id && (
                            <tr className="bg-brand-surface/20 border-b border-brand-text/5">
                              <td colSpan={7} className="py-8 px-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="flex flex-col gap-4 text-sm text-brand-text/80">
                                    <div className="flex items-start gap-3">
                                      <Phone className="w-4 h-4 text-brand-text/40 mt-0.5" /> 
                                      <span><strong>Phone:</strong> {order.phone || 'Not provided'}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                      <MapPin className="w-4 h-4 text-brand-text/40 mt-0.5" /> 
                                      <div className="flex flex-col gap-1.5">
                                        <span><strong>Delivery Address:</strong></span>
                                        {order.fullAddressObj ? (
                                          <div className="text-brand-text/60 mt-1 flex flex-col gap-0.5 text-sm leading-relaxed">
                                            <span className="font-medium text-brand-text/80">{order.fullAddressObj.fullName}</span>
                                            <span>{order.fullAddressObj.addressLine1}{order.fullAddressObj.addressLine2 ? `, ${order.fullAddressObj.addressLine2}` : ''}</span>
                                            <span>{order.fullAddressObj.city}, {order.fullAddressObj.state} - {order.fullAddressObj.pincode}</span>
                                            {order.fullAddressObj.landmark && <span className="text-xs mt-0.5 text-brand-text/40">Landmark: {order.fullAddressObj.landmark}</span>}
                                            {(order.lat && order.lng) && <span className="text-xs mt-0.5 text-brand-text/40">GPS: {order.lat}, {order.lng}</span>}
                                          </div>
                                        ) : (
                                          <span className="text-brand-text/60 mt-1 block leading-relaxed">{order.address || 'Not provided'}</span>
                                        )}
                                        {order.address && (
                                          <a href={`https://www.google.com/maps/search/?api=1&query=${order.lat && order.lng ? `${order.lat},${order.lng}` : encodeURIComponent(order.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-brand-red hover:underline tracking-widest uppercase font-bold mt-2">
                                            <ExternalLink className="w-3 h-3" /> View on Maps
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-brand-bg rounded-xl p-6 border border-brand-text/5 shadow-inner">
                                    <h4 className="text-xs tracking-widest uppercase font-medium text-brand-text/60 mb-4 flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Ordered Items</h4>
                                    <ul className="flex flex-col gap-3">
                                      {order.items?.map((item: any, i: number) => (
                                        <li key={i} className="flex justify-between items-center text-sm border-b border-brand-text/5 pb-2 last:border-0 last:pb-0"><span className="text-brand-text/80"><span className="font-medium mr-2">{item.quantity}x</span> {item.product?.name || item.name}</span> <span className="font-serif">₹{(item.product?.price || item.price) * item.quantity}</span></li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-brand-surface/30 rounded-[2rem] border border-brand-text/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-surface/50 text-brand-text/60 text-[10px] tracking-[0.2em] uppercase border-b border-brand-text/10">
                        <th className="py-6 px-8 font-medium">Product Name</th>
                        <th className="py-6 px-8 font-medium">Price</th>
                        <th className="py-6 px-8 font-medium">Stock</th>
                        <th className="py-6 px-8 font-medium">Total Sales</th>
                        <th className="py-6 px-8 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayProducts.map(product => (
                        <tr key={product.id} className="border-b border-brand-text/5 hover:bg-brand-surface/40 transition-colors">
                          <td className="py-6 px-8 text-brand-text text-sm font-medium">{product.name}</td>
                          <td className="py-6 px-8 text-brand-text/80 text-sm">₹{product.price}</td>
                          <td className="py-6 px-8 text-brand-text/80 text-sm">{product.stock} units</td>
                          <td className="py-6 px-8 text-brand-text/80 text-sm">{product.sales}</td>
                          <td className="py-6 px-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-medium ${product.status === 'In Stock' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : product.status === 'Out of Stock' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-brand-surface/30 rounded-[2rem] border border-brand-text/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-surface/50 text-brand-text/60 text-[10px] tracking-[0.2em] uppercase border-b border-brand-text/10">
                        <th className="py-6 px-8 font-medium">Customer Name</th>
                        <th className="py-6 px-8 font-medium">Email</th>
                        <th className="py-6 px-8 font-medium">Total Orders</th>
                        <th className="py-6 px-8 font-medium">Lifetime Spent</th>
                        <th className="py-6 px-8 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayCustomers.map(customer => (
                        <tr key={customer.id} className="border-b border-brand-text/5 hover:bg-brand-surface/40 transition-colors">
                          <td className="py-6 px-8 text-brand-text text-sm font-medium">{customer.name}</td>
                          <td className="py-6 px-8 text-brand-text/60 text-sm">{customer.email}</td>
                          <td className="py-6 px-8 text-brand-text/80 text-sm">{customer.orders}</td>
                          <td className="py-6 px-8 text-brand-text/80 text-sm">₹{customer.spent}</td>
                          <td className="py-6 px-8 text-brand-text/60 text-sm">{customer.joinDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
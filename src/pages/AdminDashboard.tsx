import { useState, useEffect, Fragment } from "react";
import { useAuth, db } from "../components/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Package, Users, ShoppingBag, Activity, Search, TrendingUp, Clock, ChevronRight, ChevronDown, MapPin, Phone, LayoutDashboard, Settings, Bell, Tag, ArrowUpRight, DollarSign, Plus, Edit, Trash2, Menu, X, LogOut, ExternalLink, MoreVertical } from "lucide-react";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

export function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Real-time Database States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    // 1. Real-time Orders Listener
    const unsubscribeOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snapshot) => setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      (error) => console.log("Orders listener error (safe to ignore if DB is empty):", error.message)
    );

    // 2. Real-time Products Listener
    const unsubscribeProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      (error) => console.log("Products listener error:", error.message)
    );

    // 3. Real-time Customers Listener
    const unsubscribeCustomers = onSnapshot(
      collection(db, "users"),
      (snapshot) => setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
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
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Mock Data Generators for Testing (A, B, C, D)
  const generateMockOrder = async (type: string) => {
    const mockData = {
      A: { customerName: "Rahul Sharma", customerEmail: "rahul@example.com", phone: "+91 9876543210", address: "123 Jubilee Hills, Hyderabad, TS", items: [{product: {name: "Palnadu Karam Podi", price: 299, image: "/hero-image.png"}, quantity: 2}], total: 598, status: "Processing", paymentMethod: "UPI" },
      B: { customerName: "Sneha Reddy", customerEmail: "sneha@example.com", phone: "+91 8765432109", address: "45 Banjara Hills, Hyderabad, TS", items: [{product: {name: "Guntur Idli Karam", price: 249, image: "/traditional-spices.png"}, quantity: 1}], total: 249, status: "Shipped", paymentMethod: "Card" },
      C: { customerName: "Karthik V.", customerEmail: "karthik@example.com", phone: "+91 7654321098", address: "789 Indiranagar, Bangalore, KA", items: [{product: {name: "Nallakaram Podi", price: 279, image: "/hero-image.png"}, quantity: 3}], total: 837, status: "Delivered", paymentMethod: "UPI" },
      D: { customerName: "Ananya S.", customerEmail: "ananya@example.com", phone: "+91 6543210987", address: "12 Anna Nagar, Chennai, TN", items: [{product: {name: "Palnadu Karam Podi", price: 299, image: "/hero-image.png"}, quantity: 5}], total: 1495, status: "Processing", paymentMethod: "COD" },
    };
    const order = mockData[type as keyof typeof mockData];
    
    await addDoc(collection(db, "orders"), {
      ...order,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      createdAt: serverTimestamp(),
      userId: "mock-test-user"
    });
  };

  // Fallback Mock Data (Shows if Firebase collections are empty)
  const displayOrders = orders.length > 0 ? orders : [
    { id: "ORD-9921", customerName: "Rahul Sharma", customerEmail: "rahul@example.com", phone: "+91 9876543210", address: "123 Jubilee Hills, Hyd", total: 1250, status: "Processing", date: "10 mins ago", items: [{product: {name: "Palnadu Karam Podi", price: 299, image: "/hero-image.png"}, quantity: 2}], paymentMethod: "UPI" },
    { id: "ORD-9920", customerName: "Sneha Reddy", customerEmail: "sneha@example.com", phone: "+91 8765432109", address: "45 Banjara Hills, Hyd", total: 850, status: "Shipped", date: "2 hours ago", items: [{product: {name: "Guntur Idli Karam", price: 249, image: "/traditional-spices.png"}, quantity: 1}], paymentMethod: "Card" },
    { id: "ORD-9919", customerName: "Karthik V.", customerEmail: "karthik@example.com", phone: "+91 7654321098", address: "789 Indiranagar, Blr", total: 3200, status: "Delivered", date: "1 day ago", items: [{product: {name: "Nallakaram Podi", price: 279, image: "/hero-image.png"}, quantity: 3}], paymentMethod: "UPI" }
  ];

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
    <section className="min-h-screen bg-brand-bg pt-24 pb-24 px-6">
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
                className="w-full bg-brand-surface/30 border border-brand-text/10 rounded-full py-3 pl-12 pr-6 text-sm text-brand-text focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2 border-b border-brand-text/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-brand-red text-brand-bg shadow-lg shadow-brand-red/20' 
                : 'text-brand-text/60 hover:bg-brand-surface hover:text-brand-text'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
          
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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
              <div className="bg-brand-surface/30 rounded-[2rem] border border-brand-text/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-surface/50 text-brand-text/60 text-[10px] tracking-[0.2em] uppercase border-b border-brand-text/10">
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
                            <td className="py-6 px-8 text-brand-text text-sm font-medium">{order.id?.slice(-6).toUpperCase()}</td>
                            <td className="py-6 px-8 text-brand-text/80 text-sm">{order.customerName}</td>
                            <td className="py-6 px-8 text-brand-text/60 text-sm flex items-center gap-2"><Clock className="w-3 h-3" /> {order.date}</td>
                            <td className="py-6 px-8 text-brand-text text-sm">₹{order.total}</td>
                            <td className="py-6 px-8">
                              <span className={`px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-medium ${order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-brand-text/10 text-brand-text/70 border border-brand-text/20'}`}>
                                {order.status}
                              </span>
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
                              <td colSpan={6} className="py-8 px-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="flex flex-col gap-4 text-sm text-brand-text/80">
                                    <div className="flex items-start gap-3"><Phone className="w-4 h-4 text-brand-text/40 mt-0.5" /> <span><strong>Phone:</strong> {order.phone || 'Not provided'}</span></div>
                                    <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-brand-text/40 mt-0.5" /> <span><strong>Delivery Address:</strong> <br/><span className="text-brand-text/60 mt-1 block leading-relaxed">{order.address || 'Not provided'}</span></span></div>
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
    </section>
  );
}
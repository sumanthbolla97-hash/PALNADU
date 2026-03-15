import { useState, useEffect } from "react";
import { useAuth, db, auth } from "../components/AuthContext";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, ShoppingBag, Clock, Package, User, LogOut, CheckCircle2, ChevronRight } from "lucide-react";
import { collection, query, where, orderBy, getDocs, doc, getDoc } from "firebase/firestore";

export function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const timelineSteps = ["Processing", "Preparing", "Shipped", "Out for Delivery", "Delivered"];

  useEffect(() => {
    async function fetchUserData() {
      if (!user || !auth.currentUser) return;
      
      try {
        // 1. Fetch User Profile Data (Phone/Address)
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setProfileData(userDocSnap.data());
        }

        // 2. Fetch User's Order History
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const ordersSnap = await getDocs(ordersQuery);
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex justify-between items-end border-b border-brand-text/10 pb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif text-brand-text mb-2">My Account</h1>
            <p className="text-brand-text/60 font-light tracking-widest uppercase text-sm">Welcome back, {user.name}</p>
          </div>
          <button onClick={logout} className="text-xs tracking-widest uppercase font-medium text-brand-red hover:text-brand-text transition-colors">
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile Details Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10">
              <h3 className="text-xl font-serif text-brand-text mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-red" /> Delivery Details</h3>
              
              {loading ? (
                <p className="text-brand-text/40 text-sm">Loading details...</p>
              ) : profileData ? (
                <div className="flex flex-col gap-4 text-brand-text/80 text-sm font-light">
                  <div className="flex flex-col"><span className="text-brand-text/40 text-xs tracking-widest uppercase mb-1">Email</span>{user.email}</div>
                  <div className="flex flex-col"><span className="text-brand-text/40 text-xs tracking-widest uppercase mb-1">Phone</span>{profileData.phone || "Not provided"}</div>
                  <div className="flex flex-col"><span className="text-brand-text/40 text-xs tracking-widest uppercase mb-1">Saved Address</span><span className="leading-relaxed">{profileData.address || "Not provided"}</span></div>
                </div>
              ) : (
                <p className="text-brand-text/60 text-sm font-light">No address saved yet. Place an order to save your delivery details.</p>
              )}
            </div>
          </motion.div>

          {/* Orders History Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
            <h3 className="text-2xl font-serif text-brand-text mb-6 flex items-center gap-3"><ShoppingBag className="w-6 h-6 text-brand-red" /> Order History</h3>
            
            {loading ? (
              <p className="text-brand-text/40">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="bg-brand-surface/30 p-12 rounded-[2rem] border border-brand-text/10 text-center flex flex-col items-center">
                <Package className="w-12 h-12 text-brand-text/20 mb-4" />
                <p className="text-brand-text/60 font-light text-lg">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-brand-surface/30 p-6 rounded-2xl border border-brand-text/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-brand-surface/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-brand-text">Order #{order.id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-medium ${order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' : order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-brand-text/10 text-brand-text/70'}`}>{order.status}</span>
                      </div>
                      <div className="text-xs text-brand-text/50 flex items-center gap-2"><Clock className="w-3 h-3" /> {order.date} • {order.items?.length || 0} items</div>
                    </div>
                    <div className="text-lg font-serif text-brand-text">
                      ₹{order.total}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
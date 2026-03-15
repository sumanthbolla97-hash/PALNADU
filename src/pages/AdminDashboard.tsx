import { useAuth } from "../components/AuthContext";
import { Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Settings, Package, Users } from "lucide-react";

export function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  // If not logged in, or not the admin email, kick them out to home page
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="min-h-screen bg-brand-bg pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl lg:text-5xl font-serif text-brand-text mb-2">Admin Dashboard</h1>
          <p className="text-brand-text/60 font-light tracking-widest uppercase text-sm mb-12">Welcome back, {user.name}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dummy Stat Cards */}
            <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10">
              <Package className="w-8 h-8 text-brand-red mb-4" />
              <h3 className="text-2xl font-serif text-brand-text mb-1">Products</h3>
              <p className="text-brand-text/50">Manage inventory</p>
            </div>
            
            <div className="bg-brand-surface/30 p-8 rounded-[2rem] border border-brand-text/10">
              <Users className="w-8 h-8 text-brand-red mb-4" />
              <h3 className="text-2xl font-serif text-brand-text mb-1">Customers</h3>
              <p className="text-brand-text/50">View registered users</p>
            </div>
          </div>
          
          {/* You can add a table or real data here later */}
        </motion.div>
      </div>
    </section>
  );
}
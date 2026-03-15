import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      if (isLogin) {
        await loginWithEmail(formData.email, formData.password);
      } else {
        await signupWithEmail(formData.email, formData.password, formData.name);
      }
      navigate("/"); 
    } catch (err: any) {
      setError(err.message.includes("auth/") ? "Invalid credentials or user exists." : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setIsLoading(true); setError("");
      await loginWithGoogle();
      navigate("/");
    } catch (err: any) {
      setError("Google sign in failed.");
      setIsLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex bg-brand-bg">
      {/* Left Panel - Imagery (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-brand-black/40 z-10" />
        <img src="/traditional-spices.png" alt="Palnadu Spices" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent z-10" />
        <div className="absolute bottom-20 left-20 right-20 z-20">
          <Link to="/" className="text-3xl font-serif tracking-wide text-brand-cream block mb-12">Palnadu</Link>
          <h2 className="text-5xl font-serif text-brand-cream leading-tight mb-6">A legacy of flavor,<br/>crafted for you.</h2>
          <p className="text-brand-cream/70 text-lg font-light max-w-md">Join us to experience authentic, slow-roasted Andhra spices delivered straight to your door.</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-24 py-20 relative">
        <Link to="/" className="lg:hidden text-2xl font-serif tracking-wide text-brand-text absolute top-8 left-6">Palnadu</Link>
        
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-serif text-brand-text mb-3">{isLogin ? "Welcome Back" : "Create Account"}</h1>
                <p className="text-brand-text/60 font-light">
                  {isLogin ? "Sign in to access your saved details and track orders." : "Join us to save your details and track your spicy deliveries."}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="flex flex-col gap-5 mb-8">
                {!isLogin && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
                    <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-brand-surface/30 border border-brand-text/10 rounded-2xl py-4 pl-12 pr-4 text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
                  <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-brand-surface/30 border border-brand-text/10 rounded-2xl py-4 pl-12 pr-4 text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text/40" />
                  <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-brand-surface/30 border border-brand-text/10 rounded-2xl py-4 pl-12 pr-4 text-brand-text focus:outline-none focus:border-brand-red transition-colors" />
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-4 mt-2 bg-brand-red text-brand-bg font-medium tracking-widest uppercase text-sm rounded-2xl hover:bg-brand-red-light transition-colors flex items-center justify-center gap-3 disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isLogin ? "Sign In" : "Sign Up"} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-text/10"></div></div>
                <span className="relative bg-brand-bg px-4 text-xs tracking-widest uppercase text-brand-text/40 font-medium">Or continue with</span>
              </div>

              <button type="button" onClick={handleGoogle} disabled={isLoading} className="w-full py-4 bg-brand-surface/50 border border-brand-text/10 text-brand-text font-medium tracking-widest uppercase text-xs rounded-2xl hover:bg-brand-surface transition-colors flex items-center justify-center gap-3 disabled:opacity-50">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>

              <p className="text-center text-brand-text/60 text-sm mt-10">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-brand-red font-medium hover:underline focus:outline-none">
                  {isLogin ? "Create one" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
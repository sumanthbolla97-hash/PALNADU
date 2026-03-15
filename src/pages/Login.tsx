import { motion } from "motion/react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate("/admin"); // Redirect to admin or home after login
  };

  if (user) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-brand-text mb-4">You are already logged in</h2>
          <button onClick={() => navigate("/")} className="text-brand-red uppercase tracking-widest text-sm underline">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-brand-bg flex items-center justify-center px-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-brand-surface/30 p-8 md:p-12 rounded-[2rem] border border-brand-text/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-brand-text mb-2">Welcome Back</h1>
          <p className="text-brand-text/60 font-light">Sign in to access your account</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-black font-medium tracking-widest uppercase text-xs rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 border border-gray-200 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          <p className="text-center text-xs text-brand-text/40 mt-4 tracking-wider">Email/Password sign up coming soon.</p>
        </div>
      </motion.div>
    </section>
  );
}
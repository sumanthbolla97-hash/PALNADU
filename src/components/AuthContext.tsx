import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

// It is strongly recommended to use environment variables for Firebase configuration
// Create a .env.local file in the root of your project and add your Firebase keys like so:
// VITE_FIREBASE_API_KEY="your-api-key"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDQOXEDOZihk6KP6SMAf4HP8UtIigcWbbs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "palnadudb.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://palnadudb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "palnadudb",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "palnadudb.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "182787729039",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:182787729039:web:62b9054b6dbe1d755e72fa",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-81ZKJ5E251"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

interface User {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id?: string;
  name?: string;
  quantity: number;
  price?: number;
  product?: any;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shipping?: number;
  address: string;
  phone: string;
  customerName: string;
  status: string;
  createdAt: number;
  date?: string;
  paymentMethod?: string;
}

interface AuthContextType {
  user: User | null;
  profileData: any;
  userOrders: Order[];
  userAddresses: Address[];
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<any>(() => {
    try {
      const cached = localStorage.getItem('palnadu_profile');
      return cached && cached !== "undefined" ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [userOrders, setUserOrders] = useState<Order[]>(() => {
    try {
      const cached = localStorage.getItem('palnadu_orders');
      const parsed = cached && cached !== "undefined" ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  const [userAddresses, setUserAddresses] = useState<Address[]>(() => {
    try {
      const cached = localStorage.getItem('palnadu_addresses');
      const parsed = cached && cached !== "undefined" ? JSON.parse(cached) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;
    let unsubAddresses: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined
        });

        unsubProfile = onValue(ref(db, `users/${firebaseUser.uid}`), (snapshot) => {
          const data = snapshot.val() || {};
          setProfileData(data);
          localStorage.setItem('palnadu_profile', JSON.stringify(data));
        }, (error) => {
          console.error("Profile Sync Error:", error);
          setProfileData({}); // Fallback to prevent infinite loading
        });

        const q = query(ref(db, "orders"), orderByChild("userId"), equalTo(firebaseUser.uid));
        unsubOrders = onValue(q, (snap) => {
          const data = snap.val() || {};
          const orders: Order[] = Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val }));
          
          // Client-side sort to ensure newest orders are at the top
          orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          
          setUserOrders(orders);
          localStorage.setItem('palnadu_orders', JSON.stringify(orders));
        }, (error) => {
          console.error("🔥 Firebase Permission Denied: Your DB Rules are blocking the app from loading orders.", error.message);
          console.log("To fix this, go to Firebase Console -> Realtime Database -> Rules and update them.");
          setUserOrders([]); // Fallback to prevent infinite loading
        });

        const addressesRef = ref(db, `users/${firebaseUser.uid}/addresses`);
        unsubAddresses = onValue(addressesRef, (snap) => {
          const data = snap.val() || {};
          const addresses = Object.entries(data).map(([key, val]: [string, any]) => ({ id: key, ...val } as Address));
          setUserAddresses(addresses);
          localStorage.setItem('palnadu_addresses', JSON.stringify(addresses));
        }, (error) => {
          console.error("Addresses Sync Error:", error);
          setUserAddresses([]);
        });
      } else {
        setUser(null);
        setProfileData(null);
        setUserOrders([]);
        setUserAddresses([]);
        localStorage.removeItem('palnadu_profile');
        localStorage.removeItem('palnadu_orders');
        localStorage.removeItem('palnadu_addresses');
        if (unsubProfile) unsubProfile();
        if (unsubOrders) unsubOrders();
        if (unsubAddresses) unsubAddresses();
      }
      setLoading(false);
    });

    // Safety fallback: If Firebase is blocked by an ad-blocker, force load the app after 3 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      if (unsubOrders) unsubOrders();
      if (unsubAddresses) unsubAddresses();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
  };

  const loginWithGoogle = async () => {
    // Prevent silent failure if Firebase is not actually configured
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
      throw new Error("FIREBASE_NOT_CONFIGURED");
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error; // Throw the error so the UI can catch it and stop the redirect
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const isAdmin = user?.email === 'sumanthbolla97@gmail.com';

  const contextValue = useMemo(() => ({
    user, profileData, userOrders, userAddresses, loginWithEmail, signupWithEmail, loginWithGoogle, logout, isAdmin, loading
  }), [user, profileData, userOrders, userAddresses, isAdmin, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-brand-text">
          <div className="text-center animate-pulse">
            <h2 className="text-4xl font-serif mb-2">Palnadu</h2>
            <p className="text-xs tracking-[0.2em] uppercase text-brand-text/50">Loading Experience...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, onSnapshot, doc, collection, query, where, orderBy } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDQOXEDOZihk6KP6SMAf4HP8UtIigcWbbs",
  authDomain: "palnadudb.firebaseapp.com",
  databaseURL: "https://palnadudb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palnadudb",
  storageBucket: "palnadudb.firebasestorage.app",
  messagingSenderId: "182787729039",
  appId: "1:182787729039:web:62b9054b6dbe1d755e72fa",
  measurementId: "G-81ZKJ5E251"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

interface User {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  profileData: any;
  userOrders: any[];
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
  const [userOrders, setUserOrders] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('palnadu_orders');
      return cached && cached !== "undefined" ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    let unsubOrders: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined
        });

        unsubProfile = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
          const data = docSnap.exists() ? docSnap.data() : {};
          setProfileData(data);
          localStorage.setItem('palnadu_profile', JSON.stringify(data));
        }, (error) => {
          console.error("Profile Sync Error:", error);
          setProfileData({}); // Fallback to prevent infinite loading
        });

        // Removed orderBy to prevent "Missing Composite Index" crash in Firestore
        const q = query(collection(db, "orders"), where("userId", "==", firebaseUser.uid));
        unsubOrders = onSnapshot(q, (snap) => {
          const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          // Client-side sort to ensure newest orders are at the top
          orders.sort((a: any, b: any) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
          });
          
          setUserOrders(orders);
          localStorage.setItem('palnadu_orders', JSON.stringify(orders));
        }, (error) => {
          console.error("Orders Sync Error:", error);
          setUserOrders([]); // Fallback to prevent infinite loading
        });
      } else {
        setUser(null);
        setProfileData(null);
        setUserOrders([]);
        localStorage.removeItem('palnadu_profile');
        localStorage.removeItem('palnadu_orders');
        if (unsubProfile) unsubProfile();
        if (unsubOrders) unsubOrders();
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      if (unsubOrders) unsubOrders();
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
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
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

  return (
    <AuthContext.Provider value={{ user, profileData, userOrders, loginWithEmail, signupWithEmail, loginWithGoogle, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
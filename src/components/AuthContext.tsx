import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
  email: string;
  name: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
    <AuthContext.Provider value={{ user, loginWithEmail, signupWithEmail, loginWithGoogle, logout, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
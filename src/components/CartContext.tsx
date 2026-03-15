import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';
import { useAuth, db } from './AuthContext';
import { ref, set, get } from 'firebase/database';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('palnadu_cart');
      return savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  // Fetch saved cloud cart when a user logs in (if local cart is empty)
  useEffect(() => {
    if (user) {
      const fetchCloudCart = async () => {
        try {
          const snap = await get(ref(db, `carts/${user.uid}`));
          if (snap.exists() && items.length === 0) {
            const cloudItems = snap.val().items || [];
            if (cloudItems.length > 0) setItems(cloudItems);
          }
        } catch (e) {
          console.error("Failed to fetch cloud cart", e);
        }
      };
      fetchCloudCart();
    }
  }, [user]);

  // Persist to Local Storage (always) and Firestore (if logged in)
  useEffect(() => {
    localStorage.setItem('palnadu_cart', JSON.stringify(items));
    if (user) {
      set(ref(db, `carts/${user.uid}`), { items }).catch(console.error);
    }
  }, [items, user]);

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => setItems(prev => prev.filter(item => item.product.id !== productId));
  const updateQuantity = (productId: string, quantity: number) => setItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Centralized Cart Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const tax = 0; // Maintained for interface compatibility, set to 0
  const total = subtotal + deliveryCharge;
  const cartTotal = subtotal; // Maintained for backward compatibility

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, cartTotal, subtotal, deliveryCharge, tax, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
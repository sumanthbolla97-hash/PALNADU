import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
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
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Helper to prevent app crashes from corrupted local storage data
  const sanitizeItems = (data: any): CartItem[] => {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: CartItem[], item: any) => {
      if (item && item.product && item.product.id && typeof item.product.price === 'number') {
        acc.push({
          ...item,
          quantity: typeof item.quantity === 'number' ? Math.max(1, item.quantity) : 1
        });
      }
      return acc;
    }, []);
  };

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('palnadu_cart');
      const parsed = savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : [];
      return sanitizeItems(parsed);
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
            const sanitized = sanitizeItems(cloudItems);
            if (sanitized.length > 0) setItems(sanitized);
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
      // Debounce Firebase writes by 500ms to avoid network spam on rapid clicks
      const timeoutId = setTimeout(() => {
        set(ref(db, `carts/${user.uid}`), { items }).catch(console.error);
      }, 500); 
      return () => clearTimeout(timeoutId);
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

  // Wrap derived calculations in useMemo to prevent unnecessary calculations on every render
  const { totalItems, cartTotal, subtotal, deliveryCharge, tax, total } = useMemo(() => {
    const calculatedSubtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const calculatedDeliveryCharge = calculatedSubtotal > 500 || calculatedSubtotal === 0 ? 0 : 50;
    const calculatedTax = 0;
    
    return {
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: calculatedSubtotal,
      subtotal: calculatedSubtotal,
      deliveryCharge: calculatedDeliveryCharge,
      tax: calculatedTax,
      total: calculatedSubtotal + calculatedDeliveryCharge
    };
  }, [items]);
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, cartTotal, subtotal, deliveryCharge, tax, total, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
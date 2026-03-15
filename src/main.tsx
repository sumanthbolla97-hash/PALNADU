import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { CartProvider } from './components/CartContext';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product } from './pages/Product';
import { Profile } from './pages/Profile';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingCart } from './components/FloatingCart';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Footer />
          <FloatingCart />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);

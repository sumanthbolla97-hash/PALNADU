import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product } from './pages/Product';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingCart } from './components/FloatingCart';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
        <Footer />
        <FloatingCart />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Product } from "./pages/Product";
import { FloatingCart } from "./components/FloatingCart";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans selection:bg-brand-red selection:text-brand-bg">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
          </Routes>
        </div>
        <Footer />
        <FloatingCart />
      </div>
    </Router>
  );
}

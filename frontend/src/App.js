import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

import TopBar        from './components/TopBar/TopBar';
import Navbar        from './components/Navbar/Navbar';
import Hero          from './components/Hero/Hero';
import Stats         from './components/Stats/Stats';
import Gallery       from './components/Gallery/Gallery';
import Shop          from './components/Shop/Shop';
import About         from './components/About/About';
import CeoBanner     from './components/About/CeoBanner';
import HowWeWork     from './components/HowWeWork/HowWeWork';
import Testimonials  from './components/Testimonials/Testimonials';
import Contact       from './components/Contact/Contact';
import Footer        from './components/Footer/Footer';
import Cart          from './components/Cart/Cart';
import WhatsAppFloat from './components/Shared/WhatsAppFloat';
import ScrollTop     from './components/Shared/ScrollTop';
import Admin from './components/Admin/Admin';
import ShopPage      from './pages/Shop/ShopPage';
import ProductDetail from './pages/Shop/ProductDetail';

if (!document.querySelector('link[href*="font-awesome"]')) {
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  document.head.appendChild(link);
}

function Layout({ children }) {
  return (
    <>
      <TopBar />
      <Navbar />
      <Cart />
      {children}
      <Footer />
      <WhatsAppFloat />
      <ScrollTop />
    </>
  );
}

function HomePage() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <Gallery />
      <Shop />
      <About />
      <CeoBanner />
      <HowWeWork />
      <Testimonials />
      <Contact />
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Toaster position="top-right" toastOptions={{
          style: { fontFamily: "'Nunito Sans', sans-serif", fontSize: '.88rem' },
          success: { iconTheme: { primary: '#00b4b4', secondary: '#fff' } },
        }} />
        <Routes>
          <Route path="/admin"       element={<Admin />} />
          <Route path="/shop"        element={<Layout><ShopPage /></Layout>} />
          <Route path="/shop/:id"    element={<Layout><ProductDetail /></Layout>} />
          <Route path="/"            element={<HomePage />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}
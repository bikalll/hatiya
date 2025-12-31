import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import './App.css';

// Layout wrapper that conditionally renders Navbar/Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const noLayoutPages = ['/login', '/signup'];
  const showLayout = !noLayoutPages.includes(location.pathname);

  return (
    <>
      {showLayout && <Navbar />}
      <main>{children}</main>
      {showLayout && <Footer />}
    </>
  );
};

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CartDrawer from './components/CartDrawer';
import SaturdayGuard from './components/SaturdayGuard';


import Profile from './pages/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin Routes - Separate Layout */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Public Routes - Main Layout */}
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

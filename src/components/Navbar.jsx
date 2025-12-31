import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount, toggleCart } = useCart();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const styles = {
        navbar: {
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #E5E7EB',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        },
        topBar: {
            backgroundColor: '#065F46',
            padding: '10px 60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: '#D1FAE5',
        },
        mainNav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 60px',
            backgroundColor: 'white',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
        },
        logoIcon: {
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoText: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#065F46',
            letterSpacing: '-0.5px',
        },
        navLinks: {
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
        },
        navLink: {
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            color: '#374151',
            transition: 'color 0.2s',
        },
        navLinkActive: {
            color: '#059669',
        },
        navRight: {
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
        },
        searchBar: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            padding: '10px 16px',
            width: '240px',
            gap: '10px',
            border: '1px solid #E5E7EB',
        },
        searchInput: {
            border: 'none',
            backgroundColor: 'transparent',
            outline: 'none',
            fontSize: '14px',
            color: '#6B7280',
            width: '100%',
        },
        iconBtn: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        },
        cartBadge: {
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#059669',
            color: 'white',
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 6px',
            borderRadius: '10px',
        },
        authBtn: {
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            textDecoration: 'none',
        },
        authBtnOutline: {
            backgroundColor: 'transparent',
            color: '#374151',
            border: '1px solid #E5E7EB',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            textDecoration: 'none',
        },
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={styles.navbar}>
            {/* Top Bar */}
            <div style={styles.topBar}>
                <span>Authentic Nepali Products | Handcrafted with Care</span>
                <span>Free Shipping on Orders Over $75</span>
            </div>

            {/* Main Navigation */}
            <div style={styles.mainNav}>
                <Link to="/" style={styles.logo}>
                    <div style={styles.logoIcon}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 2L4 10v12l12 8 12-8V10L16 2z" fill="#059669" />
                            <path d="M16 6L8 11v10l8 5 8-5V11L16 6z" fill="#10B981" />
                            <path d="M16 10l-4 2.5v5L16 20l4-2.5v-5L16 10z" fill="#34D399" />
                        </svg>
                    </div>
                    <span style={styles.logoText}>Himalayan</span>
                </Link>

                <div style={styles.navLinks}>
                    <Link
                        to="/"
                        style={{ ...styles.navLink, ...(isActive('/') ? styles.navLinkActive : {}) }}
                    >
                        Home
                    </Link>
                    <Link
                        to="/shop"
                        style={{ ...styles.navLink, ...(isActive('/shop') ? styles.navLinkActive : {}) }}
                    >
                        Shop
                    </Link>
                    <Link
                        to="/about"
                        style={{ ...styles.navLink, ...(isActive('/about') ? styles.navLinkActive : {}) }}
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        style={{ ...styles.navLink, ...(isActive('/contact') ? styles.navLinkActive : {}) }}
                    >
                        Contact
                    </Link>
                </div>

                <div style={styles.navRight}>
                    <div style={styles.searchBar}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            style={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    <button style={styles.iconBtn} onClick={toggleCart}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                    </button>

                    {user ? (
                        <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#059669',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                                overflow: 'hidden'
                            }}>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    (user.user_metadata?.first_name || user.email || 'U').charAt(0).toUpperCase()
                                )}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                                {user.user_metadata?.first_name || 'Account'}
                            </span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" style={styles.authBtnOutline}>Log In</Link>
                            <Link to="/signup" style={styles.authBtn}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount, toggleCart } = useCart();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fetch Notifications
    React.useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .or(`user_id.eq.${user.id},user_id.is.null`)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
        };

        fetchNotifications();

        // Real-time subscription could go here
        const channel = supabase
            .channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
                if (payload.new.user_id === user.id || payload.new.user_id === null) {
                    setNotifications(prev => [payload.new, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const markAsRead = async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

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
            cursor: 'pointer',
            textDecoration: 'none',
        },
        notificationDropdown: {
            position: 'absolute',
            top: '50px',
            right: '80px',
            width: '320px',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1001,
            maxHeight: '400px',
            overflowY: 'auto',
        },
        notificationItem: {
            padding: '12px',
            borderBottom: '1px solid #F3F4F6',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        notificationTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px',
        },
        notificationMessage: {
            fontSize: '13px',
            color: '#6B7280',
            lineHeight: '1.4',
        },
        notificationTime: {
            fontSize: '11px',
            color: '#9CA3AF',
            marginTop: '4px',
        },
        unreadDot: {
            display: 'inline-block',
            width: '8px',
            height: '8px',
            backgroundColor: '#EF4444',
            borderRadius: '50%',
            marginRight: '8px',
        }
    };

    const isActive = (path) => location.pathname === path;

    const MobileMenu = () => (
        <div
            className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <div
                className="mobile-menu-content"
                onClick={(e) => e.stopPropagation()}
                style={{ transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#065F46' }}>Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Link to="/" style={{ ...styles.navLink, fontSize: '16px' }} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/shop" style={{ ...styles.navLink, fontSize: '16px' }} onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                    <Link to="/about" style={{ ...styles.navLink, fontSize: '16px' }} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                    <Link to="/contact" style={{ ...styles.navLink, fontSize: '16px' }} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                    <Link
                        to="/seller/signup"
                        style={{
                            backgroundColor: '#059669',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            textAlign: 'center'
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Become a Seller
                    </Link>
                    <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '8px 0' }} />
                    {user ? (
                        <>
                            <Link to="/profile" style={{ ...styles.navLink, fontSize: '16px' }} onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                            <button onClick={() => { toggleCart(); setIsMobileMenuOpen(false); }} style={{ ...styles.authBtnOutline, textAlign: 'left' }}>Cart ({cartCount})</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.authBtnOutline} onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                            <Link to="/signup" style={styles.authBtn} onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <nav style={styles.navbar}>
            {/* Top Bar - Hidden on mobile via CSS class 'top-bar' */}
            <div style={styles.topBar} className="top-bar">
                <span>Authentic Nepali Products | Handcrafted with Care</span>
                <span>Free Shipping on Orders Over $75</span>
            </div>

            {/* Main Navigation */}
            <div style={styles.mainNav} className="nav-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Hamburger Button */}
                    <button className="nav-mobile-btn" onClick={() => setIsMobileMenuOpen(true)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <Link to="/" style={styles.logo}>
                        <img src="/favicon.png" alt="Sanibare Hatiya" style={{ height: '40px', objectFit: 'contain' }} />
                        <span style={styles.logoText} className="nav-logo-text">Sanibare</span>
                    </Link>
                </div>

                {/* Mobile-visible account/cart icons */}
                <div className="nav-mobile-icons" style={{ display: 'none', alignItems: 'center', gap: '12px' }}>
                    <button style={styles.iconBtn} onClick={toggleCart}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                    </button>
                    {user && (
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
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
                        </Link>
                    )}
                </div>

                <div style={styles.navLinks} className="nav-links-desktop">
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
                    <Link
                        to="/seller/signup"
                        style={{
                            backgroundColor: '#059669',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            marginLeft: '8px'
                        }}
                    >
                        Become a Seller
                    </Link>
                </div>

                <div style={styles.navRight} className="nav-right-desktop">
                    <div style={styles.searchBar} className="nav-search-bar">
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

                    <button style={styles.iconBtn} onClick={toggleNotifications}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {unreadCount > 0 && <span style={{ ...styles.cartBadge, backgroundColor: '#EF4444' }}>{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div style={styles.notificationDropdown}>
                            <div style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', fontSize: '14px' }}>Notifications</span>
                                <button onClick={() => setShowNotifications(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
                            </div>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>No notifications</div>
                            ) : (
                                notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        style={{ ...styles.notificationItem, backgroundColor: notification.is_read ? 'white' : '#F9FAFB' }}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div style={styles.notificationTitle}>
                                            {!notification.is_read && <span style={styles.unreadDot}></span>}
                                            {notification.title}
                                        </div>
                                        <div style={styles.notificationMessage}>{notification.message}</div>
                                        <div style={styles.notificationTime}>{new Date(notification.created_at).toLocaleDateString()}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

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

            <MobileMenu />
        </nav >
    );
};

export default Navbar;

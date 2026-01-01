import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

const categories = [
    { name: 'Handicrafts', image: 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=300&h=300&fit=crop', count: 45 },
    { name: 'Textiles', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop', count: 32 },
    { name: 'Art', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop', count: 28 },
    { name: 'Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', count: 24 },
    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop', count: 38 },
    { name: 'Decor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop', count: 29 },
];

const Home = () => {
    const { addToCart } = useCart();
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*, profiles(store_name)')
                .eq('is_featured', true)
                .limit(4);

            if (data) setFeaturedProducts(data);
            if (error) console.error('Error fetching featured products:', error);
        };
        fetchFeatured();
    }, []);

    const styles = {
        page: {
            backgroundColor: '#FAFAFA',
            minHeight: '100vh',
        },

        // Revamped Hero
        hero: {
            position: 'relative',
            height: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            overflow: 'hidden',
        },
        heroBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Using a high-quality landscape image for the hero background
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
        },
        heroContent: {
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            padding: '0 20px',
        },
        heroTag: {
            color: '#D1FAE5',
            fontSize: '14px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '24px',
            display: 'inline-block',
            padding: '8px 16px',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50px',
            backdropFilter: 'blur(5px)',
        },
        heroTitle: {
            fontSize: '64px',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '24px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        },
        heroSubtitle: {
            fontSize: '20px',
            color: '#E5E7EB',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        heroButtons: {
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
        },
        primaryBtn: {
            backgroundColor: '#059669',
            color: 'white',
            padding: '16px 40px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'transform 0.2s, background-color 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
        secondaryBtn: {
            backgroundColor: 'white',
            color: '#111827',
            padding: '16px 40px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },

        // Revamped Categories
        section: {
            padding: '100px 60px',
        },
        sectionHeader: {
            textAlign: 'center',
            marginBottom: '60px',
        },
        sectionTitle: {
            fontSize: '36px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px',
        },
        sectionSubtitle: {
            fontSize: '16px',
            color: '#6B7280',
        },
        viewAllLink: {
            color: '#059669',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '20px',
        },
        categoriesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px',
        },
        categoryCard: {
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            height: '300px',
            textDecoration: 'none',
        },
        categoryImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s',
        },
        categoryOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '30px',
        },
        categoryName: {
            color: 'white',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '8px',
        },
        categoryCount: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },

        // Revamped Products
        productsSection: {
            padding: '100px 60px',
            backgroundColor: 'white',
        },
        productsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '30px',
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #F3F4F6',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
        },
        productImage: {
            width: '100%',
            height: '280px',
            objectFit: 'cover',
            backgroundColor: '#F9FAFB',
        },
        productImageContainer: {
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: '16px',
            left: '16px',
            backgroundColor: 'white',
            color: '#059669',
            padding: '6px 14px',
            borderRadius: '50px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        productInfo: {
            padding: '24px',
        },
        productCategory: {
            fontSize: '12px',
            color: '#6B7280',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
        },
        productVendor: {
            fontSize: '12px',
            color: '#9CA3AF',
            marginBottom: '4px',
            fontStyle: 'italic'
        },
        productName: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '12px',
            lineHeight: '1.4',
        },
        productPriceRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        productPrice: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#059669',
        },
        originalPrice: {
            fontSize: '14px',
            color: '#9CA3AF',
            textDecoration: 'line-through',
            marginLeft: '8px',
        },
        addBtn: {
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: '#059669',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        // Features
        featuresSection: {
            padding: '80px 60px',
            backgroundColor: '#F9FAFB',
        },
        featuresGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
        },
        featureCard: {
            textAlign: 'center',
            padding: '20px',
        },
        featureIcon: {
            width: '64px',
            height: '64px',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D1FAE5',
            borderRadius: '50%',
            color: '#059669',
        },
        featureTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '10px',
        },
        featureDesc: {
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.6',
        },

        // Newsletter
        newsletter: {
            padding: '100px 60px',
            backgroundColor: '#065F46',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
        },
        newsletterPattern: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '30px 30px',
        },
        newsletterContent: {
            position: 'relative',
            zIndex: 1,
            maxWidth: '600px',
            margin: '0 auto',
        },
        newsletterTitle: {
            fontSize: '36px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
        },
        newsletterSubtitle: {
            fontSize: '16px',
            color: '#D1FAE5',
            marginBottom: '40px',
        },
        newsletterForm: {
            display: 'flex',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '8px',
            borderRadius: '50px',
        },
        newsletterInput: {
            flex: 1,
            padding: '16px 24px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '15px',
            outline: 'none',
            backgroundColor: 'transparent',
            color: 'white',
        },
        newsletterBtn: {
            backgroundColor: 'white',
            color: '#065F46',
            padding: '16px 36px',
            borderRadius: '50px',
            fontSize: '15px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
        },
    };

    return (
        <div style={styles.page}>
            {/* Hero */}
            <section style={styles.hero}>
                <div style={styles.heroBackground}></div>
                <div style={styles.heroContent}>
                    <div style={styles.heroTag}>Handcrafted in Nepal</div>
                    <h1 style={styles.heroTitle}>
                        Authentic Treasures<br />for Modern Living
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Discover a curated collection of artisanal products that blend
                        traditional craftsmanship with contemporary design.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/shop" style={styles.primaryBtn}>Shop Now</Link>
                        <Link to="/about" style={styles.secondaryBtn}>Read Our Story</Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Curated Collections</h2>
                    <p style={styles.sectionSubtitle}>Browse products by category</p>
                </div>
                <div style={styles.categoriesGrid}>
                    {categories.map((cat) => (
                        <Link
                            to={`/shop?category=${cat.name}`}
                            key={cat.name}
                            style={styles.categoryCard}
                        >
                            <img src={cat.image} alt={cat.name} style={styles.categoryImage} />
                            <div style={styles.categoryOverlay}>
                                <div style={styles.categoryName}>{cat.name}</div>
                                <div style={styles.categoryCount}>
                                    <span>Explore Collection</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/shop" style={styles.viewAllLink}>
                        View All Categories
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Products */}
            <section style={styles.productsSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Featured Arrivals</h2>
                    <p style={styles.sectionSubtitle}>Handpicked items just for you</p>
                </div>
                <div style={styles.productsGrid}>
                    {featuredProducts.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#6B7280' }}>
                            <p>Checking out our latest arrivals...</p>
                        </div>
                    ) : (
                        featuredProducts.map((product) => (
                            <Link to="/shop" key={product.id} style={{ textDecoration: 'none' }}>
                                <div style={styles.productCard}>
                                    <div style={styles.productImageContainer}>
                                        <img src={product.image_url} alt={product.name} style={styles.productImage} />
                                        {product.badge && <span style={styles.badge}>{product.badge}</span>}
                                        <button
                                            style={styles.addBtn}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation(); // Prevent Link navigation
                                                addToCart(product);
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div style={styles.productInfo}>
                                        <div style={styles.productCategory}>{product.category}</div>
                                        <div style={styles.productVendor}>By {product.profiles?.store_name || 'Sanibare Hatiya'}</div>
                                        <div style={styles.productName}>{product.name}</div>
                                        <div style={styles.productPrice}>${product.price}</div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/shop" style={styles.viewAllLink}>
                        Shop All Products
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section style={styles.featuresSection}>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Artisan Crafted</h3>
                        <p style={styles.featureDesc}>Created by skilled hands, preserving ancient traditions.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Global Delivery</h3>
                        <p style={styles.featureDesc}>Secure shipping to over 50 countries worldwide.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Ethical Trade</h3>
                        <p style={styles.featureDesc}>Supporting artisan communities with fair wages.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Quality Assured</h3>
                        <p style={styles.featureDesc}>Every item is inspected for premium quality.</p>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section style={styles.newsletter}>
                <div style={styles.newsletterPattern}></div>
                <div style={styles.newsletterContent}>
                    <h2 style={styles.newsletterTitle}>Join Our Community</h2>
                    <p style={styles.newsletterSubtitle}>Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <div style={styles.newsletterForm}>
                        <input type="email" placeholder="Enter your email address" style={styles.newsletterInput} />
                        <button style={styles.newsletterBtn}>Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

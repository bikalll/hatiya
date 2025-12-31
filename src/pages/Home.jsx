import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Products with real Unsplash images
const products = [
    { id: 1, category: 'Handicrafts', name: 'Tibetan Singing Bowl', price: '$89', originalPrice: '$129', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1545147986-a9d6f2ab03b5?w=400&h=400&fit=crop' },
    { id: 2, category: 'Art', name: 'Thangka Painting', price: '$245', originalPrice: null, badge: 'Handmade', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
    { id: 3, category: 'Textiles', name: 'Pashmina Shawl', price: '$156', originalPrice: '$199', badge: 'Sale', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop' },
    { id: 4, category: 'Spices', name: 'Himalayan Tea Collection', price: '$34', originalPrice: null, badge: null, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop' },
    { id: 5, category: 'Jewelry', name: 'Silver Filigree Earrings', price: '$45', originalPrice: null, badge: 'Artisan', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 6, category: 'Decor', name: 'Handwoven Rug', price: '$189', originalPrice: '$220', badge: 'Sale', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop' },
    { id: 7, category: 'Handicrafts', name: 'Wooden Buddha Statue', price: '$125', originalPrice: null, badge: null, image: 'https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=400&h=400&fit=crop' },
    { id: 8, category: 'Spices', name: 'Organic Spice Set', price: '$28', originalPrice: null, badge: 'Organic', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop' },
];

const categories = [
    { name: 'Handicrafts', image: 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=300&h=300&fit=crop', count: 45 },
    { name: 'Textiles', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop', count: 32 },
    { name: 'Art & Paintings', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop', count: 28 },
    { name: 'Herbs & Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop', count: 24 },
    { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop', count: 38 },
    { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop', count: 29 },
];

const Home = () => {
    const styles = {
        page: {
            backgroundColor: '#FAFAFA',
        },

        // Hero
        hero: {
            backgroundColor: '#065F46',
            padding: '100px 60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '500px',
        },
        heroContent: {
            maxWidth: '500px',
        },
        heroTag: {
            color: '#6EE7B7',
            fontSize: '13px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px',
        },
        heroTitle: {
            fontSize: '52px',
            fontWeight: '600',
            color: 'white',
            lineHeight: '1.15',
            marginBottom: '20px',
        },
        heroSubtitle: {
            fontSize: '17px',
            color: '#A7F3D0',
            marginBottom: '32px',
            lineHeight: '1.7',
        },
        heroButtons: {
            display: 'flex',
            gap: '16px',
        },
        primaryBtn: {
            backgroundColor: 'white',
            color: '#065F46',
            padding: '14px 32px',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none',
        },
        secondaryBtn: {
            backgroundColor: 'transparent',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '500',
            border: '1px solid rgba(255,255,255,0.3)',
            cursor: 'pointer',
            textDecoration: 'none',
        },
        heroImage: {
            width: '500px',
            height: '400px',
            borderRadius: '12px',
            objectFit: 'cover',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        },

        // Categories
        section: {
            padding: '80px 60px',
        },
        sectionHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
        },
        sectionTitle: {
            fontSize: '28px',
            fontWeight: '600',
            color: '#111827',
        },
        viewAllLink: {
            color: '#059669',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        categoriesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '20px',
        },
        categoryCard: {
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
            aspectRatio: '1',
        },
        categoryImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s',
        },
        categoryOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 16px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        },
        categoryName: {
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
        },
        categoryCount: {
            color: 'rgba(255,255,255,0.7)',
            fontSize: '12px',
        },

        // Products
        productsSection: {
            padding: '80px 60px',
            backgroundColor: 'white',
        },
        productsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #E5E7EB',
        },
        productImage: {
            width: '100%',
            height: '220px',
            objectFit: 'cover',
        },
        productImageContainer: {
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: '#059669',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
        },
        productInfo: {
            padding: '16px',
        },
        productCategory: {
            fontSize: '12px',
            color: '#059669',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
        },
        productName: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '8px',
        },
        productPriceRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        productPrice: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
        },
        originalPrice: {
            fontSize: '13px',
            color: '#9CA3AF',
            textDecoration: 'line-through',
            marginLeft: '8px',
        },
        addBtn: {
            backgroundColor: '#F3F4F6',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer',
        },

        // Features
        featuresSection: {
            padding: '60px',
            backgroundColor: '#F9FAFB',
            borderTop: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
        },
        featuresGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
        },
        featureCard: {
            textAlign: 'center',
        },
        featureIcon: {
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        featureTitle: {
            fontSize: '15px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '6px',
        },
        featureDesc: {
            fontSize: '13px',
            color: '#6B7280',
            lineHeight: '1.5',
        },

        // Newsletter
        newsletter: {
            padding: '80px 60px',
            backgroundColor: '#065F46',
            textAlign: 'center',
        },
        newsletterTitle: {
            fontSize: '28px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '12px',
        },
        newsletterSubtitle: {
            fontSize: '15px',
            color: '#A7F3D0',
            marginBottom: '28px',
        },
        newsletterForm: {
            display: 'flex',
            gap: '12px',
            maxWidth: '450px',
            margin: '0 auto',
        },
        newsletterInput: {
            flex: 1,
            padding: '14px 20px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            outline: 'none',
        },
        newsletterBtn: {
            backgroundColor: '#111827',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.page}>
            {/* Hero */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroTag}>Authentic Nepali Products</div>
                    <h1 style={styles.heroTitle}>
                        Discover Nepal's<br />Hidden Treasures
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Explore our curated collection of handcrafted products made by skilled
                        artisans from the Himalayas. Each piece tells a story of tradition.
                    </p>
                    <div style={styles.heroButtons}>
                        <Link to="/shop" style={styles.primaryBtn}>Shop Collection</Link>
                        <Link to="/about" style={styles.secondaryBtn}>Our Story</Link>
                    </div>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=600&h=500&fit=crop"
                    alt="Nepali Handicrafts"
                    style={styles.heroImage}
                />
            </section>

            {/* Categories */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Shop by Category</h2>
                    <Link to="/shop" style={styles.viewAllLink}>
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div style={styles.categoriesGrid}>
                    {categories.map((cat) => (
                        <div key={cat.name} style={styles.categoryCard}>
                            <img src={cat.image} alt={cat.name} style={styles.categoryImage} />
                            <div style={styles.categoryOverlay}>
                                <div style={styles.categoryName}>{cat.name}</div>
                                <div style={styles.categoryCount}>{cat.count} items</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products */}
            <section style={styles.productsSection}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Featured Products</h2>
                    <Link to="/shop" style={styles.viewAllLink}>
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                <div style={styles.productsGrid}>
                    {products.map((product) => (
                        <div key={product.id} style={styles.productCard}>
                            <div style={styles.productImageContainer}>
                                <img src={product.image} alt={product.name} style={styles.productImage} />
                                {product.badge && <span style={styles.badge}>{product.badge}</span>}
                            </div>
                            <div style={styles.productInfo}>
                                <div style={styles.productCategory}>{product.category}</div>
                                <div style={styles.productName}>{product.name}</div>
                                <div style={styles.productPriceRow}>
                                    <div>
                                        <span style={styles.productPrice}>{product.price}</span>
                                        {product.originalPrice && (
                                            <span style={styles.originalPrice}>{product.originalPrice}</span>
                                        )}
                                    </div>
                                    <button style={styles.addBtn}>Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={styles.featuresSection}>
                <div style={styles.featuresGrid}>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>100% Handcrafted</h3>
                        <p style={styles.featureDesc}>Each product is handmade by skilled artisans</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <rect x="1" y="3" width="15" height="13" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Worldwide Shipping</h3>
                        <p style={styles.featureDesc}>We deliver to over 50 countries safely</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Fair Trade</h3>
                        <p style={styles.featureDesc}>Direct partnership with artisan communities</p>
                    </div>
                    <div style={styles.featureCard}>
                        <div style={styles.featureIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3 style={styles.featureTitle}>Authenticity Guaranteed</h3>
                        <p style={styles.featureDesc}>Certificate of origin with every purchase</p>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section style={styles.newsletter}>
                <h2 style={styles.newsletterTitle}>Join Our Community</h2>
                <p style={styles.newsletterSubtitle}>Subscribe for updates on new arrivals and artisan stories.</p>
                <div style={styles.newsletterForm}>
                    <input type="email" placeholder="Enter your email" style={styles.newsletterInput} />
                    <button style={styles.newsletterBtn}>Subscribe</button>
                </div>
            </section>
        </div>
    );
};

export default Home;

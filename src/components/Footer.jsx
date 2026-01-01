import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: '#111827',
            color: '#9CA3AF',
            padding: 'clamp(30px, 6vw, 60px) clamp(16px, 4vw, 60px) clamp(20px, 4vw, 30px)',
        },
        footerGrid: {
            display: 'grid',
            gap: 'clamp(24px, 5vw, 60px)',
            marginBottom: '40px',
        },
        footerSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '12px',
        },
        logoText: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#F9FAFB',
        },
        footerDesc: {
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#9CA3AF',
        },
        sectionTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#F9FAFB',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
        },
        footerLinks: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        },
        footerLink: {
            color: '#9CA3AF',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s',
        },
        newsletter: {
            marginTop: '8px',
        },
        newsletterInput: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '6px',
            border: '1px solid #374151',
            backgroundColor: '#1F2937',
            color: '#F9FAFB',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '12px',
        },
        newsletterBtn: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#059669',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
        },
        footerBottom: {
            borderTop: '1px solid #374151',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        copyright: {
            fontSize: '13px',
            color: '#6B7280',
        },
        socialLinks: {
            display: 'flex',
            gap: '16px',
        },
        socialLink: {
            color: '#6B7280',
            transition: 'color 0.2s',
        },
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.footerGrid} className="footer-grid">
                {/* Brand Section */}
                <div style={styles.footerSection}>
                    <div style={styles.logo}>
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <path d="M16 2L4 10v12l12 8 12-8V10L16 2z" fill="#059669" />
                            <path d="M16 6L8 11v10l8 5 8-5V11L16 6z" fill="#10B981" />
                        </svg>
                        <span style={styles.logoText}>Himalayan</span>
                    </div>
                    <p style={styles.footerDesc}>
                        Bringing authentic Nepali craftsmanship to the world. Each product
                        tells a story of tradition and skilled artisanship.
                    </p>
                </div>

                {/* Quick Links */}
                <div style={styles.footerSection}>
                    <h4 style={styles.sectionTitle}>Quick Links</h4>
                    <div style={styles.footerLinks}>
                        <Link to="/" style={styles.footerLink}>Home</Link>
                        <Link to="/shop" style={styles.footerLink}>Shop</Link>
                        <Link to="/about" style={styles.footerLink}>About Us</Link>
                        <Link to="/contact" style={styles.footerLink}>Contact</Link>
                    </div>
                </div>

                {/* Categories */}
                <div style={styles.footerSection}>
                    <h4 style={styles.sectionTitle}>Categories</h4>
                    <div style={styles.footerLinks}>
                        <a href="#" style={styles.footerLink}>Handicrafts</a>
                        <a href="#" style={styles.footerLink}>Textiles</a>
                        <a href="#" style={styles.footerLink}>Herbs & Spices</a>
                        <a href="#" style={styles.footerLink}>Art & Paintings</a>
                        <a href="#" style={styles.footerLink}>Jewelry</a>
                    </div>
                </div>

                {/* Newsletter */}
                <div style={styles.footerSection}>
                    <h4 style={styles.sectionTitle}>Newsletter</h4>
                    <p style={styles.footerDesc}>
                        Subscribe for updates on new arrivals and offers.
                    </p>
                    <div style={styles.newsletter}>
                        <input
                            type="email"
                            placeholder="Your email"
                            style={styles.newsletterInput}
                        />
                        <button style={styles.newsletterBtn}>Subscribe</button>
                    </div>
                </div>
            </div>

            <div style={styles.footerBottom}>
                <p style={styles.copyright}>
                    2024 Himalayan. All rights reserved.
                </p>
                <div style={styles.socialLinks}>
                    <a href="#" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                    </a>
                    <a href="#" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a href="#" style={styles.socialLink}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

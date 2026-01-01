import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const SellerLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await signIn({
                email: formData.email,
                password: formData.password,
            });
            if (error) throw error;

            // Check if user is actually a seller?
            // Optionally we can fetch the profile and check 'seller_status'.
            // For now, we'll just redirect to dashboard, and the dashboard will handle permissions/status views.

            navigate('/seller/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        page: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F9FAFB',
            fontFamily: "'Inter', sans-serif",
            padding: '20px',
        },
        container: {
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            padding: '48px',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.02)',
        },
        brand: {
            display: 'inline-block',
            textDecoration: 'none',
            color: '#059669',
            marginBottom: '32px',
            fontSize: '20px',
            fontWeight: '700',
            letterSpacing: '-0.5px',
        },
        title: {
            fontSize: '28px',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
        },
        subtitle: {
            fontSize: '15px',
            color: '#6B7280',
            marginBottom: '40px',
            lineHeight: '1.5',
        },
        formGroup: {
            marginBottom: '20px',
            textAlign: 'left'
        },
        label: {
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        input: {
            width: '100%',
            padding: '14px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: '#F9FAFB',
            color: '#111827',
        },
        button: {
            width: '100%',
            padding: '16px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.2)',
        },
        link: {
            color: '#059669',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'color 0.2s',
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <Link to="/" style={styles.brand}>
                    Sanibare Hatiya
                </Link>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Enter your credentials to access your seller dashboard.</p>

                {error && (
                    <div style={{
                        backgroundColor: '#FEF2F2',
                        color: '#991B1B',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginBottom: '24px',
                        border: '1px solid #FECACA'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="name@store.com"
                            required
                            onFocus={(e) => {
                                e.target.style.borderColor = '#059669';
                                e.target.style.backgroundColor = 'white';
                                e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#E5E7EB';
                                e.target.style.backgroundColor = '#F9FAFB';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                            onFocus={(e) => {
                                e.target.style.borderColor = '#059669';
                                e.target.style.backgroundColor = 'white';
                                e.target.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#E5E7EB';
                                e.target.style.backgroundColor = '#F9FAFB';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                        onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-1px)')}
                        onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', borderTop: '1px solid #F3F4F6', paddingTop: '24px' }}>
                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                        New to Sanibare? <Link to="/seller/signup" style={styles.link}>Join as a Seller</Link>
                    </p>
                    <p style={{ marginTop: '12px', fontSize: '14px', color: '#9CA3AF' }}>
                        <Link to="/login" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Customer Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;

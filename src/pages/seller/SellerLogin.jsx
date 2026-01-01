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
            backgroundColor: '#F3F4F6'
        },
        container: {
            margin: 'auto',
            width: '100%',
            maxWidth: '420px',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            textAlign: 'center'
        },
        brand: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#059669',
            marginBottom: '32px',
            fontSize: '24px',
            fontWeight: 'bold'
        },
        title: {
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '8px'
        },
        subtitle: {
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '32px'
        },
        formGroup: {
            marginBottom: '20px',
            textAlign: 'left'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.15s ease-in-out',
        },
        button: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '10px'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <Link to="/" style={styles.brand}>
                    Sanibare Hatiya Seller
                </Link>
                <h2 style={styles.title}>Seller Login</h2>
                <p style={styles.subtitle}>Access your store dashboard</p>

                {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="you@company.com"
                            required
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
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '14px', color: '#6B7280' }}>
                    Don't have a seller account? <Link to="/seller/signup" style={{ color: '#059669', fontWeight: '500' }}>Register</Link>
                </p>
                <p style={{ marginTop: '12px', fontSize: '13px', color: '#9CA3AF' }}>
                    <Link to="/login" style={{ color: '#6B7280' }}>Login as Customer</Link>
                </p>
            </div>
        </div>
    );
};

export default SellerLogin;

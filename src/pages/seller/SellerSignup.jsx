import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const SellerSignup = () => {
    const [formData, setFormData] = useState({
        storeName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // 1. Sign up user
            const { data, error: signUpError } = await signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) throw signUpError;
            if (!data.user) throw new Error("Signup failed");

            // 2. Update profile with seller info
            // Note: We need to handle this carefully. The 'handle_new_user' trigger
            // creates a profile automatically. We need to update it.
            // But we must wait for the trigger to fire, or rely on RLS allowing us modification.

            // Retry loop or immediate update?
            // The trigger fires synchronously usually, so profile should exist.

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    store_name: formData.storeName,
                    seller_status: 'pending',
                    // user remains 'customer' role generally, but has 'pending' seller status.
                })
                .eq('id', data.user.id);

            if (updateError) {
                console.error("Error updating seller profile:", updateError);
                // Continue anyway to dashboard? Or show error?
                // If this fails, they are just a regular user.
                throw new Error("Failed to register as seller. Please contact support.");
            }

            navigate('/seller/dashboard'); // Redirect to dashboard which will show 'pending' status
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        // ... Reusing styles from Login/Signup or creating new ones. 
        // Let's create a distinct look for Seller Portal (maybe a darker green or different accent)
        page: {
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#F3F4F6'
        },
        container: {
            margin: 'auto',
            width: '100%',
            maxWidth: '480px',
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
                <h2 style={styles.title}>Become a Seller</h2>
                <p style={styles.subtitle}>Start selling your products on our platform today.</p>

                {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Store Name</label>
                        <input
                            type="text"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="My Awesome Shop"
                            required
                        />
                    </div>
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
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '14px', color: '#6B7280' }}>
                    Already a seller? <Link to="/seller/login" style={{ color: '#059669', fontWeight: '500' }}>Sign in</Link>
                </p>
                <p style={{ marginTop: '12px', fontSize: '13px', color: '#9CA3AF' }}>
                    <Link to="/signup" style={{ color: '#6B7280' }}>Register as a Customer instead</Link>
                </p>
            </div>
        </div>
    );
};

export default SellerSignup;

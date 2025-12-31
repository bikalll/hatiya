import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await signIn({
                email: formData.email,
                password: formData.password,
            });
            if (error) throw error;
            navigate('/profile');
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
        },
        leftPanel: {
            flex: 1,
            backgroundColor: '#065F46',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
        },
        leftContent: {
            maxWidth: '400px',
            color: 'white',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '48px',
            textDecoration: 'none',
        },
        logoText: {
            fontSize: '24px',
            fontWeight: '600',
            color: 'white',
        },
        leftTitle: {
            fontSize: '36px',
            fontWeight: '600',
            lineHeight: '1.2',
            marginBottom: '16px',
        },
        leftSubtitle: {
            fontSize: '15px',
            color: '#A7F3D0',
            lineHeight: '1.7',
        },

        rightPanel: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
            backgroundColor: '#FAFAFA',
        },
        formContainer: {
            width: '100%',
            maxWidth: '380px',
        },
        formTitle: {
            fontSize: '28px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
        },
        formSubtitle: {
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '32px',
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px',
        },
        input: {
            width: '100%',
            padding: '12px 14px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
            backgroundColor: 'white',
            boxSizing: 'border-box',
        },
        checkboxRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
        },
        checkboxLabel: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#6B7280',
            cursor: 'pointer',
        },
        checkbox: {
            width: '16px',
            height: '16px',
            accentColor: '#059669',
        },
        forgotLink: {
            color: '#059669',
            fontSize: '13px',
            textDecoration: 'none',
            fontWeight: '500',
        },
        submitBtn: {
            width: '100%',
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '20px',
        },
        divider: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
        },
        dividerLine: {
            flex: 1,
            height: '1px',
            backgroundColor: '#E5E7EB',
        },
        dividerText: {
            fontSize: '12px',
            color: '#9CA3AF',
        },
        socialBtn: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            backgroundColor: 'white',
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
            marginBottom: '12px',
        },
        signupText: {
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280',
            marginTop: '24px',
        },
        signupLink: {
            color: '#059669',
            fontWeight: '500',
            textDecoration: 'none',
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.leftPanel}>
                <div style={styles.leftContent}>
                    <Link to="/" style={styles.logo}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M16 2L4 10v12l12 8 12-8V10L16 2z" fill="#10B981" />
                            <path d="M16 6L8 11v10l8 5 8-5V11L16 6z" fill="#34D399" />
                        </svg>
                        <span style={styles.logoText}>Himalayan</span>
                    </Link>
                    <h2 style={styles.leftTitle}>
                        Welcome Back
                    </h2>
                    <p style={styles.leftSubtitle}>
                        Sign in to access your account, track orders, and continue
                        exploring authentic Nepali treasures.
                    </p>
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.formContainer}>
                    <h1 style={styles.formTitle}>Sign In</h1>
                    <p style={styles.formSubtitle}>Enter your credentials to continue</p>
                    {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                style={styles.input}
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
                                placeholder="Enter your password"
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.checkboxRow}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    style={styles.checkbox}
                                />
                                Remember me
                            </label>
                            <a href="#" style={styles.forgotLink}>Forgot password?</a>
                        </div>

                        <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={styles.signupText}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={styles.signupLink}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

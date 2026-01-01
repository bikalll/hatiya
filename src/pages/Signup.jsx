import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeTerms) {
            setError('You must agree to the terms');
            return;
        }

        try {
            setLoading(true);
            const { error } = await signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                    }
                }
            });
            if (error) throw error;
            alert('Account created! Please check your email to confirm.');
            navigate('/login');
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
            backgroundColor: '#FAFAFA',
        },
        formContainer: {
            width: '100%',
            maxWidth: '420px',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '40px',
            textDecoration: 'none',
        },
        logoText: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#065F46',
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
        formRow: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
        },
        formGroup: {
            marginBottom: '18px',
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
        checkboxLabel: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '13px',
            color: '#6B7280',
            cursor: 'pointer',
            marginBottom: '24px',
            lineHeight: '1.5',
        },
        checkbox: {
            width: '16px',
            height: '16px',
            accentColor: '#059669',
            marginTop: '2px',
        },
        termsLink: {
            color: '#059669',
            textDecoration: 'none',
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
        loginText: {
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280',
            marginTop: '24px',
        },
        loginLink: {
            color: '#059669',
            fontWeight: '500',
            textDecoration: 'none',
        },

        rightPanel: {
            flex: 1,
            backgroundColor: '#065F46',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '60px',
        },
        rightContent: {
            maxWidth: '400px',
            color: 'white',
        },
        rightTitle: {
            fontSize: '36px',
            fontWeight: '600',
            lineHeight: '1.2',
            marginBottom: '16px',
        },
        rightSubtitle: {
            fontSize: '15px',
            color: '#A7F3D0',
            lineHeight: '1.7',
            marginBottom: '32px',
        },
        benefitsList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        benefitItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
        },
        benefitIcon: {
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };
    // Check if mobile
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ ...styles.page, flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ ...styles.leftPanel, flex: isMobile ? 'none' : 1, minHeight: isMobile ? '100vh' : 'auto', padding: isMobile ? '40px 20px' : '60px' }}>
                <div style={styles.formContainer}>
                    <Link to="/" style={styles.logo}>
                        <img src="/favicon.png" alt="Logo" style={{ height: '40px' }} />
                        <span style={styles.logoText}>Sanibare Hatiya</span>
                    </Link>

                    <h1 style={styles.formTitle}>Create Account</h1>
                    <p style={styles.formSubtitle}>Join our community of craft enthusiasts</p>
                    {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

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

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create password"
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                style={styles.checkbox}
                            />
                            <span>
                                I agree to the{' '}
                                <a href="#" style={styles.termsLink}>Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" style={styles.termsLink}>Privacy Policy</a>
                            </span>
                        </label>

                        <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.loginLink}>Sign in</Link>
                    </p>
                </div>
            </div>

            {!isMobile && (
                <div style={styles.rightPanel}>
                    <div style={styles.rightContent}>
                        <h2 style={styles.rightTitle}>
                            Join 15,000+<br />Happy Customers
                        </h2>
                        <p style={styles.rightSubtitle}>
                            Create your account and start exploring authentic Nepali
                            craftsmanship from the comfort of your home.
                        </p>
                        <div style={styles.benefitsList}>
                            <div style={styles.benefitItem}>
                                <div style={styles.benefitIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span>Exclusive member discounts up to 20%</span>
                            </div>
                            <div style={styles.benefitItem}>
                                <div style={styles.benefitIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span>Free shipping on your first order</span>
                            </div>
                            <div style={styles.benefitItem}>
                                <div style={styles.benefitIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <span>Early access to new collections</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        alert('Account created successfully!');
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

    return (
        <div style={styles.page}>
            <div style={styles.leftPanel}>
                <div style={styles.formContainer}>
                    <Link to="/" style={styles.logo}>
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <path d="M16 2L4 10v12l12 8 12-8V10L16 2z" fill="#059669" />
                            <path d="M16 6L8 11v10l8 5 8-5V11L16 6z" fill="#10B981" />
                        </svg>
                        <span style={styles.logoText}>Himalayan</span>
                    </Link>

                    <h1 style={styles.formTitle}>Create Account</h1>
                    <p style={styles.formSubtitle}>Join our community of craft enthusiasts</p>

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

                        <button type="submit" style={styles.submitBtn}>Create Account</button>
                    </form>

                    <div style={styles.divider}>
                        <div style={styles.dividerLine}></div>
                        <span style={styles.dividerText}>or</span>
                        <div style={styles.dividerLine}></div>
                    </div>

                    <button style={styles.socialBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.loginLink}>Sign in</Link>
                    </p>
                </div>
            </div>

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
        </div>
    );
};

export default Signup;

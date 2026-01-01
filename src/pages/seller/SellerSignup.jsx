import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const SellerSignup = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;

    const [formData, setFormData] = useState({
        // Step 1: Account
        email: '',
        password: '',
        confirmPassword: '',

        // Step 2: Business Info
        businessName: '',
        businessType: 'individual',
        businessRegistrationNumber: '',
        taxId: '',

        // Step 3: Store Details
        storeName: '',
        storeDescription: '',

        // Step 4: Contact Info
        phone: '',
        country: '',
        city: '',
        address: '',
        postalCode: '',

        // Step 5: Bank Details
        bankName: '',
        bankAccountName: '',
        bankAccountNumber: '',
        bankSwiftCode: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateStep = () => {
        setError(null);
        switch (currentStep) {
            case 1:
                if (!formData.email || !formData.password) {
                    setError('Email and password are required');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return false;
                }
                break;
            case 2:
                if (!formData.businessName || !formData.businessType) {
                    setError('Business name and type are required');
                    return false;
                }
                break;
            case 3:
                if (!formData.storeName) {
                    setError('Store name is required');
                    return false;
                }
                break;
            case 4:
                if (!formData.phone || !formData.country || !formData.city) {
                    setError('Phone, country, and city are required');
                    return false;
                }
                break;
            case 5:
                // Bank details optional for now
                break;
        }
        return true;
    };

    const checkEmailExists = async (email) => {
        try {
            // Try to check if email exists by querying profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (data) {
                return true; // Email exists
            }
            return false;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    const nextStep = async () => {
        if (!validateStep()) return;

        // Check email on step 1
        if (currentStep === 1) {
            setLoading(true);
            const exists = await checkEmailExists(formData.email);
            setLoading(false);

            if (exists) {
                setError('An account with this email already exists. Please use a different email or sign in.');
                return;
            }
        }

        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const [signupComplete, setSignupComplete] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setLoading(true);
        setError(null);

        try {
            // 1. Sign up user
            const { data, error: signUpError } = await signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) throw signUpError;
            if (!data.user) throw new Error("Signup failed");

            // 2. Wait a moment for the profile to be created by Supabase trigger
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. Update profile with ALL seller information
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    // Seller Status
                    seller_status: 'pending',
                    seller_applied_at: new Date().toISOString(),

                    // Store Details
                    store_name: formData.storeName,
                    store_description: formData.storeDescription || null,

                    // Business Info
                    business_name: formData.businessName,
                    business_type: formData.businessType,
                    business_registration_number: formData.businessRegistrationNumber || null,
                    tax_id: formData.taxId || null,

                    // Contact Info
                    phone: formData.phone,
                    country: formData.country,
                    city: formData.city,
                    address: formData.address || null,
                    postal_code: formData.postalCode || null,

                    // Bank Details
                    bank_name: formData.bankName || null,
                    bank_account_name: formData.bankAccountName || null,
                    bank_account_number: formData.bankAccountNumber || null,
                    bank_swift_code: formData.bankSwiftCode || null,
                })
                .eq('id', data.user.id);

            if (updateError) {
                console.error("Error updating profile:", updateError);
                throw new Error("Failed to complete seller registration. Please contact support.");
            }

            // Show success message
            setSignupComplete(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#F8FAFC',
            fontFamily: "'Inter', sans-serif",
        },
        header: {
            background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
            padding: '32px 24px',
            textAlign: 'center',
            color: 'white',
        },
        headerTitle: {
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: '700',
            marginBottom: '8px',
        },
        headerSubtitle: {
            fontSize: 'clamp(13px, 2vw, 15px)',
            opacity: 0.9,
        },
        container: {
            maxWidth: '720px',
            margin: '0 auto',
            padding: '32px 24px',
        },
        progressBar: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '40px',
            position: 'relative',
        },
        progressLine: {
            position: 'absolute',
            top: '14px',
            left: '20px',
            right: '20px',
            height: '2px',
            backgroundColor: '#E5E7EB',
            zIndex: 0,
        },
        progressLineFill: {
            position: 'absolute',
            top: '14px',
            left: '20px',
            height: '2px',
            backgroundColor: '#059669',
            zIndex: 1,
            transition: 'width 0.3s ease',
        },
        progressStep: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
        },
        progressCircle: {
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
        },
        progressLabel: {
            fontSize: '11px',
            marginTop: '8px',
            color: '#6B7280',
            textAlign: 'center',
            maxWidth: '60px',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: 'clamp(24px, 5vw, 40px)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
            border: '1px solid #F3F4F6',
        },
        stepTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
        },
        stepDescription: {
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '24px',
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        },
        label: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
        },
        input: {
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
        },
        select: {
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white',
            cursor: 'pointer',
        },
        textarea: {
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            outline: 'none',
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit',
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            gap: '16px',
        },
        btnPrimary: {
            flex: 1,
            padding: '14px 24px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        btnSecondary: {
            flex: 1,
            padding: '14px 24px',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
        },
        error: {
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '20px',
        },
        fullWidth: {
            gridColumn: '1 / -1',
        },
        required: {
            color: '#DC2626',
        },
        loginLink: {
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '14px',
            color: '#6B7280',
        },
    };

    const stepLabels = ['Account', 'Business', 'Store', 'Contact', 'Bank', 'Review'];
    const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <h2 style={styles.stepTitle}>Create Your Account</h2>
                        <p style={styles.stepDescription}>Enter your email and create a secure password</p>
                        <div style={styles.formGrid}>
                            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                                <label style={styles.label}>Email Address <span style={styles.required}>*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Password <span style={styles.required}>*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Confirm Password <span style={styles.required}>*</span></label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h2 style={styles.stepTitle}>Business Information</h2>
                        <p style={styles.stepDescription}>Tell us about your business</p>
                        <div style={styles.formGrid}>
                            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                                <label style={styles.label}>Business Name <span style={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Your company or business name"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Business Type <span style={styles.required}>*</span></label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    style={styles.select}
                                >
                                    <option value="individual">Individual / Sole Proprietor</option>
                                    <option value="company">Registered Company</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Registration Number</label>
                                <input
                                    type="text"
                                    name="businessRegistrationNumber"
                                    value={formData.businessRegistrationNumber}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Optional"
                                />
                            </div>
                            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                                <label style={styles.label}>Tax ID / VAT Number</label>
                                <input
                                    type="text"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <h2 style={styles.stepTitle}>Store Details</h2>
                        <p style={styles.stepDescription}>Configure how your store appears to customers</p>
                        <div style={styles.formGrid}>
                            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                                <label style={styles.label}>Store Name <span style={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Name displayed to customers"
                                />
                            </div>
                            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                                <label style={styles.label}>Store Description</label>
                                <textarea
                                    name="storeDescription"
                                    value={formData.storeDescription}
                                    onChange={handleChange}
                                    style={styles.textarea}
                                    placeholder="Tell customers about your store and products..."
                                />
                            </div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <h2 style={styles.stepTitle}>Contact Information</h2>
                        <p style={styles.stepDescription}>How can we reach you?</p>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone Number <span style={styles.required}>*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="+977 98XXXXXXXX"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Country <span style={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Nepal"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>City <span style={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Kathmandu"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="44600"
                                />
                            </div>
                            <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
                                <label style={styles.label}>Full Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Street address"
                                />
                            </div>
                        </div>
                    </>
                );
            case 5:
                return (
                    <>
                        <h2 style={styles.stepTitle}>Bank Details</h2>
                        <p style={styles.stepDescription}>For receiving payouts (can be updated later)</p>
                        <div style={styles.formGrid}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="e.g., Nepal Bank Limited"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Account Holder Name</label>
                                <input
                                    type="text"
                                    name="bankAccountName"
                                    value={formData.bankAccountName}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Name on account"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Account Number</label>
                                <input
                                    type="text"
                                    name="bankAccountNumber"
                                    value={formData.bankAccountNumber}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Account number"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>SWIFT/BIC Code</label>
                                <input
                                    type="text"
                                    name="bankSwiftCode"
                                    value={formData.bankSwiftCode}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="For international transfers"
                                />
                            </div>
                        </div>
                    </>
                );
            case 6:
                return (
                    <>
                        <h2 style={styles.stepTitle}>Review & Submit</h2>
                        <p style={styles.stepDescription}>Please review your information before submitting</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <ReviewSection title="Account" data={{ Email: formData.email }} />
                            <ReviewSection title="Business" data={{
                                'Business Name': formData.businessName,
                                'Business Type': formData.businessType,
                                'Registration #': formData.businessRegistrationNumber || 'Not provided',
                                'Tax ID': formData.taxId || 'Not provided',
                            }} />
                            <ReviewSection title="Store" data={{
                                'Store Name': formData.storeName,
                                'Description': formData.storeDescription || 'Not provided',
                            }} />
                            <ReviewSection title="Contact" data={{
                                'Phone': formData.phone,
                                'Location': `${formData.city}, ${formData.country}`,
                                'Address': formData.address || 'Not provided',
                            }} />
                            <ReviewSection title="Bank Details" data={{
                                'Bank': formData.bankName || 'Not provided',
                                'Account Name': formData.bankAccountName || 'Not provided',
                            }} />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const ReviewSection = ({ title, data }) => (
        <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#059669', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                {Object.entries(data).map(([key, value]) => (
                    <div key={key}>
                        <div style={{ fontSize: '11px', color: '#6B7280' }}>{key}</div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Success Screen
    if (signupComplete) {
        return (
            <div style={styles.page}>
                <header style={styles.header}>
                    <h1 style={styles.headerTitle}>Application Submitted</h1>
                    <p style={styles.headerSubtitle}>Thank you for registering as a seller</p>
                </header>
                <div style={styles.container}>
                    <div style={{ ...styles.card, textAlign: 'center', padding: '48px 32px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22,4 12,14.01 9,11.01" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                            Check Your Email
                        </h2>
                        <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 32px' }}>
                            We've sent a verification link to <strong>{formData.email}</strong>.
                            Please verify your email address to continue.
                        </p>

                        <div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '24px', textAlign: 'left', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>What happens next?</h3>
                            <ol style={{ margin: 0, paddingLeft: '20px', color: '#4B5563', fontSize: '14px', lineHeight: '2' }}>
                                <li>Verify your email by clicking the link we sent</li>
                                <li>Our team will review your application (1-2 business days)</li>
                                <li>You'll receive an email once approved</li>
                                <li>Log in to your seller dashboard and start selling</li>
                            </ol>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/" style={{ ...styles.btnSecondary, textDecoration: 'none', display: 'inline-block' }}>
                                Return to Home
                            </Link>
                            <Link to="/seller/login" style={{ ...styles.btnPrimary, textDecoration: 'none', display: 'inline-block' }}>
                                Go to Seller Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <h1 style={styles.headerTitle}>Become a Seller</h1>
                </Link>
                <p style={styles.headerSubtitle}>Join Sanibare Hatiya's marketplace and reach customers worldwide</p>
            </header>

            <div style={styles.container}>
                {/* Progress Bar */}
                <div style={styles.progressBar}>
                    <div style={styles.progressLine}></div>
                    <div style={{ ...styles.progressLineFill, width: progressWidth }}></div>
                    {stepLabels.map((label, index) => (
                        <div key={index} style={styles.progressStep}>
                            <div style={{
                                ...styles.progressCircle,
                                backgroundColor: currentStep > index + 1 ? '#059669' : currentStep === index + 1 ? '#059669' : '#E5E7EB',
                                color: currentStep >= index + 1 ? 'white' : '#9CA3AF',
                            }}>
                                {currentStep > index + 1 ? '✓' : index + 1}
                            </div>
                            <span style={{ ...styles.progressLabel, color: currentStep >= index + 1 ? '#059669' : '#9CA3AF' }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div style={styles.card}>
                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                        {renderStepContent()}

                        <div style={styles.buttonGroup}>
                            {currentStep > 1 && (
                                <button type="button" onClick={prevStep} style={styles.btnSecondary}>
                                    Back
                                </button>
                            )}
                            {currentStep < totalSteps ? (
                                <button type="submit" style={{ ...styles.btnPrimary, marginLeft: currentStep === 1 ? 'auto' : 0 }}>
                                    Continue
                                </button>
                            ) : (
                                <button type="submit" disabled={loading} style={styles.btnPrimary}>
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <p style={styles.loginLink}>
                    Already a seller? <Link to="/seller/login" style={{ color: '#059669', fontWeight: '500' }}>Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default SellerSignup;

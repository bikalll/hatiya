import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const SellerDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('overview');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [productForm, setProductForm] = useState({
        name: '',
        category: '',
        price: '',
        stock_quantity: '',
        description: '',
        image_url: ''
    });

    const [stats, setStats] = useState({
        totalProducts: 0,
        verifiedProducts: 0,
        pendingProducts: 0,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/seller/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            // Fetch seller data from profiles table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error("Error fetching profile:", profileError);
                setProfile(null);
                setLoading(false);
                return;
            }

            setProfile(profileData);

            // Fetch categories
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            setCategories(categoriesData || []);

            // Only fetch products if approved
            if (profileData.seller_status === 'approved') {
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('seller_id', user.id)
                    .order('created_at', { ascending: false });

                if (productsError) throw productsError;
                setProducts(productsData || []);

                const verified = productsData?.filter(p => p.is_verified).length || 0;
                const pending = productsData?.filter(p => !p.is_verified).length || 0;
                setStats({
                    totalProducts: productsData?.length || 0,
                    verifiedProducts: verified,
                    pendingProducts: pending,
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/seller/login');
    };

    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a preview URL
            setProductForm({ ...productForm, image_url: URL.createObjectURL(file) });
        }
    };

    const uploadImage = async (file) => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            let finalImageUrl = productForm.image_url;

            if (imageFile) {
                setIsUploading(true);
                finalImageUrl = await uploadImage(imageFile);
                setIsUploading(false);
            } else if (!productForm.image_url) {
                alert("Product image is compulsory.");
                return;
            }

            const productData = {
                ...productForm,
                price: parseFloat(productForm.price),
                stock_quantity: parseInt(productForm.stock_quantity),
                image_url: finalImageUrl,
                seller_id: user.id,
                is_verified: false
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }
            setShowAddModal(false);
            setEditingProduct(null);
            setProductForm({ name: '', category: '', price: '', stock_quantity: '', description: '', image_url: '' });
            setImageFile(null);
            fetchData();
        } catch (error) {
            console.error("Error saving product:", error);
            setIsUploading(false);
            alert("Error saving product: " + error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await supabase.from('products').delete().eq('id', id);
            fetchData();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const openEditModal = (product) => {
        setProductForm({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stock_quantity: product.stock_quantity?.toString() || '0',
            description: product.description || '',
            image_url: product.image_url || ''
        });
        setEditingProduct(product);
        setShowAddModal(true);
    };

    const styles = {
        layout: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#F8FAFC',
            fontFamily: "'Inter', sans-serif",
        },
        sidebar: {
            width: '260px',
            backgroundColor: '#065F46',
            color: 'white',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto',
            zIndex: 100,
            transition: 'transform 0.3s ease',
        },
        sidebarHeader: {
            padding: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
        sidebarLogo: {
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
        },
        sidebarSubtitle: {
            fontSize: '12px',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '4px',
        },
        sidebarNav: {
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
        },
        navItem: {
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.9)',
            border: 'none',
            backgroundColor: 'transparent',
            width: '100%',
            textAlign: 'left',
            transition: 'all 0.2s',
        },
        navItemActive: {
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
        },
        main: {
            flex: 1,
            marginLeft: '260px',
            padding: 'clamp(20px, 4vw, 40px)',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
        },
        headerTitle: {
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: '700',
            color: '#0F172A',
        },
        hamburger: {
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '24px',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
        },
        statCard: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0',
        },
        statValue: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#0F172A',
            marginBottom: '4px',
        },
        statLabel: {
            fontSize: '14px',
            color: '#64748B',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: 'clamp(16px, 3vw, 24px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0',
        },
        cardHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#0F172A',
        },
        btnPrimary: {
            backgroundColor: '#059669',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        btnSecondary: {
            backgroundColor: '#F1F5F9',
            color: '#334155',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
        },
        btnDanger: {
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '13px',
            cursor: 'pointer',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
        },
        th: {
            textAlign: 'left',
            padding: '12px 16px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            borderBottom: '1px solid #E2E8F0',
        },
        td: {
            padding: '16px',
            borderBottom: '1px solid #F1F5F9',
            fontSize: '14px',
            color: '#334155',
        },
        productImage: {
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '8px',
            backgroundColor: '#F1F5F9',
        },
        badge: {
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
        },
        badgeSuccess: {
            backgroundColor: '#D1FAE5',
            color: '#065F46',
        },
        badgeWarning: {
            backgroundColor: '#FEF3C7',
            color: '#92400E',
        },
        modal: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
        },
        modalContent: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
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
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            outline: 'none',
            minHeight: '80px',
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
        },
        infoCard: {
            backgroundColor: '#F8FAFC',
            padding: '16px',
            borderRadius: '8px',
        },
        infoLabel: {
            fontSize: '11px',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
        },
        infoValue: {
            fontSize: '14px',
            color: '#0F172A',
            fontWeight: '500',
        },
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#6B7280' }}>Loading dashboard...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!profile) return <div style={{ padding: '40px', textAlign: 'center' }}>Error loading profile.</div>;

    // Check email verification - if user hasn't confirmed email
    if (!user.email_confirmed_at) {
        return (
            <div style={{ ...styles.layout, justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ maxWidth: '480px', textAlign: 'center', backgroundColor: 'white', padding: '48px 32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <polyline points="3,7 12,13 21,7" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Verify Your Email</h1>
                    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', marginBottom: '32px' }}>
                        Please check your inbox and click the verification link we sent to <strong>{user.email}</strong> before accessing the seller dashboard.
                    </p>
                    <button onClick={handleSignOut} style={styles.btnSecondary}>Sign Out</button>
                </div>
            </div>
        );
    }

    // Pending Status View
    if (profile.seller_status === 'pending') {
        return (
            <div style={{ ...styles.layout, justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ maxWidth: '480px', textAlign: 'center', backgroundColor: 'white', padding: '48px 32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12,6 12,12 16,14" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>Application Under Review</h1>
                    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
                        Your seller application for <strong>{profile.store_name}</strong> is being reviewed by our team. This typically takes 1-2 business days.
                    </p>
                    <div style={styles.infoGrid}>
                        <div style={styles.infoCard}>
                            <div style={styles.infoLabel}>Business Name</div>
                            <div style={styles.infoValue}>{profile.business_name || 'N/A'}</div>
                        </div>
                        <div style={styles.infoCard}>
                            <div style={styles.infoLabel}>Applied On</div>
                            <div style={styles.infoValue}>{profile.seller_applied_at ? new Date(profile.seller_applied_at).toLocaleDateString() : 'N/A'}</div>
                        </div>
                    </div>
                    <button onClick={handleSignOut} style={{ ...styles.btnSecondary, marginTop: '32px' }}>Sign Out</button>
                </div>
            </div>
        );
    }

    // Rejected Status View
    if (profile.seller_status === 'rejected') {
        return (
            <div style={{ ...styles.layout, justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ maxWidth: '480px', textAlign: 'center', backgroundColor: 'white', padding: '48px 32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#DC2626', marginBottom: '12px' }}>Application Declined</h1>
                    <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '24px' }}>
                        Unfortunately, your seller application for <strong>{profile.store_name}</strong> was not approved.
                    </p>
                    {profile.admin_notes && (
                        <div style={{ backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '8px', textAlign: 'left', marginBottom: '24px' }}>
                            <strong style={{ fontSize: '13px', color: '#991B1B' }}>Reason:</strong>
                            <p style={{ fontSize: '14px', color: '#7F1D1D', margin: '8px 0 0' }}>{profile.admin_notes}</p>
                        </div>
                    )}
                    <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '24px' }}>
                        If you believe this was in error, please contact our support team.
                    </p>
                    <button onClick={handleSignOut} style={styles.btnSecondary}>Sign Out</button>
                </div>
            </div>
        );
    }

    // Check if not a seller at all
    if (profile.seller_status !== 'approved') {
        return (
            <div style={{ ...styles.layout, justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{ maxWidth: '400px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Access Denied</h1>
                    <p style={{ color: '#6B7280', marginBottom: '24px' }}>You don't have seller access. Please apply to become a seller.</p>
                    <Link to="/seller/signup" style={{ ...styles.btnPrimary, textDecoration: 'none', display: 'inline-block' }}>Become a Seller</Link>
                </div>
            </div>
        );
    }

    const navItems = [
        { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { id: 'store', label: 'Store Settings', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    const NavIcon = ({ path }) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
        </svg>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <>
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <div style={styles.statValue}>{stats.totalProducts}</div>
                                <div style={styles.statLabel}>Total Products</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={{ ...styles.statValue, color: '#059669' }}>{stats.verifiedProducts}</div>
                                <div style={styles.statLabel}>Verified & Live</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={{ ...styles.statValue, color: '#D97706' }}>{stats.pendingProducts}</div>
                                <div style={styles.statLabel}>Pending Verification</div>
                            </div>
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Quick Actions</h3>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                                <button style={styles.btnPrimary} onClick={() => { setActiveSection('products'); setShowAddModal(true); }}>
                                    Add Product
                                </button>
                                <button style={styles.btnSecondary} onClick={() => setActiveSection('store')}>
                                    Edit Store
                                </button>
                            </div>
                        </div>
                    </>
                );

            case 'products':
                return (
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Your Products ({products.length})</h3>
                            <button style={styles.btnPrimary} onClick={() => { setEditingProduct(null); setProductForm({ name: '', category: '', price: '', stock_quantity: '', description: '', image_url: '' }); setShowAddModal(true); }}>
                                Add Product
                            </button>
                        </div>

                        {products.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}>
                                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p>No products yet. Add your first product to get started!</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Product</th>
                                            <th style={styles.th}>Category</th>
                                            <th style={styles.th}>Price</th>
                                            <th style={styles.th}>Stock</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <img src={product.image_url || '/placeholder.jpg'} alt="" style={styles.productImage} />
                                                        <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>{product.category}</td>
                                                <td style={styles.td}>Rs. {product.price}</td>
                                                <td style={styles.td}>{product.stock_quantity || 0}</td>
                                                <td style={styles.td}>
                                                    <span style={{ ...styles.badge, ...(product.is_verified ? styles.badgeSuccess : styles.badgeWarning) }}>
                                                        {product.is_verified ? 'Live' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button style={styles.btnSecondary} onClick={() => openEditModal(product)}>Edit</button>
                                                        <button style={styles.btnDanger} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                );

            case 'store':
                return (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Store Information</h3>
                        <div style={{ ...styles.infoGrid, marginTop: '20px' }}>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Store Name</div>
                                <div style={styles.infoValue}>{profile.store_name || 'Not set'}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Business Name</div>
                                <div style={styles.infoValue}>{profile.business_name || 'Not set'}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Business Type</div>
                                <div style={styles.infoValue}>{profile.business_type || 'Not set'}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Country</div>
                                <div style={styles.infoValue}>{profile.country || 'Not set'}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px' }}>
                            <div style={styles.infoLabel}>Store Description</div>
                            <p style={{ color: '#334155', marginTop: '8px', fontSize: '14px' }}>{profile.store_description || 'No description provided.'}</p>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Account Information</h3>
                        <div style={{ ...styles.infoGrid, marginTop: '20px' }}>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Email</div>
                                <div style={styles.infoValue}>{profile.email}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Phone</div>
                                <div style={styles.infoValue}>{profile.phone || 'Not set'}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Location</div>
                                <div style={styles.infoValue}>{profile.city && profile.country ? `${profile.city}, ${profile.country}` : 'Not set'}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Seller Status</div>
                                <div style={styles.infoValue}>
                                    <span style={{ ...styles.badge, ...styles.badgeSuccess }}>Approved</span>
                                </div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Tax ID</div>
                                <div style={styles.infoValue}>{profile.tax_id || 'Not provided'}</div>
                            </div>
                            <div style={styles.infoCard}>
                                <div style={styles.infoLabel}>Bank Account</div>
                                <div style={styles.infoValue}>{profile.bank_name ? `${profile.bank_name} - ****${profile.bank_account_number?.slice(-4) || ''}` : 'Not set'}</div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={styles.layout}>
            {/* Mobile Overlay */}
            {sidebarOpen && <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar */}
            <aside style={{
                ...styles.sidebar,
                transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
            }}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.sidebarLogo}>Seller Portal</div>
                    <div style={styles.sidebarSubtitle}>{profile.store_name}</div>
                </div>

                <nav style={styles.sidebarNav}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            style={{
                                ...styles.navItem,
                                ...(activeSection === item.id ? styles.navItemActive : {}),
                            }}
                            onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                        >
                            <NavIcon path={item.icon} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={handleSignOut} style={{ ...styles.navItem, width: '100%' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ ...styles.main, marginLeft: isMobile ? 0 : '260px' }}>
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            style={{ ...styles.hamburger, display: isMobile ? 'block' : 'none' }}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 style={styles.headerTitle}>
                            {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <Link to="/" style={{ fontSize: '14px', color: '#059669', textDecoration: 'none', fontWeight: '500' }}>
                        Back to Store
                    </Link>
                </div>

                {renderContent()}
            </main>

            {/* Add/Edit Product Modal */}
            {showAddModal && (
                <div style={styles.modal} onClick={() => setShowAddModal(false)}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleProductSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Product Name *</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Category *</label>
                                <select
                                    value={productForm.category}
                                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                    style={styles.input}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Price (Rs.) *</label>
                                    <input
                                        type="number"
                                        value={productForm.price}
                                        onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={productForm.stock_quantity}
                                        onChange={e => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                                        style={styles.input}
                                    />
                                </div>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Product Image *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={styles.input}
                                    required={!productForm.image_url}
                                />
                                {productForm.image_url && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={productForm.image_url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                    style={styles.textarea}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="button" onClick={() => setShowAddModal(false)} style={{ ...styles.btnSecondary, flex: 1 }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>
                                    {editingProduct ? 'Update' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;

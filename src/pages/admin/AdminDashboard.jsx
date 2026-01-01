import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [view, setView] = useState('list'); // 'list', 'add', 'categories', 'add-category', 'faqs', 'add-faq'
    const [imageFile, setImageFile] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [unverifiedProducts, setUnverifiedProducts] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);



    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        stock_quantity: 10,
        is_featured: false,
        sku: '',
        material: '',
        dimensions: ''
    });


    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: ''
    });

    const [faqForm, setFaqForm] = useState({
        question: '',
        answer: ''
    });

    const [notificationForm, setNotificationForm] = useState({
        title: '',
        message: '',
        type: 'general', // general, payment, opening
        user_id: '' // empty = all users
    });


    useEffect(() => {
        if (!user) {
            navigate('/admin');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([fetchProducts(), fetchCategories(), fetchFaqs(), fetchOrders(), fetchNotifications(), fetchSellers(), fetchUnverifiedProducts()]);
        setIsLoading(false);
    };

    const fetchSellers = async () => {
        try {
            // Fetch sellers from profiles table
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .not('seller_status', 'is', null)
                .order('seller_applied_at', { ascending: false });
            if (error) throw error;
            setSellers(data || []);
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const fetchUnverifiedProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, profiles(store_name)')
                .eq('is_verified', false)
                .order('created_at', { ascending: false });
            if (error) throw error;
            // Flatten for easier access
            const flattenedData = (data || []).map(product => ({
                ...product,
                store_name: product.profiles?.store_name,
            }));
            setUnverifiedProducts(flattenedData);
        } catch (error) {
            console.error('Error fetching unverified products:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };



    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
            // Set default category for product form if available
            if (data && data.length > 0 && !formData.category) {
                setFormData(prev => ({ ...prev, category: data[0].name }));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchFaqs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('created_at');

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };


    const handleSignOut = async () => {
        await signOut();
        navigate('/admin');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
    };

    const handleFaqChange = (e) => {
        setFaqForm({ ...faqForm, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e) => {
        setNotificationForm({ ...notificationForm, [e.target.name]: e.target.value });
    };


    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleEditProduct = (product) => {
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description || '',
            stock_quantity: product.stock_quantity,
            is_featured: product.is_featured,
            sku: product.sku || '',
            material: product.material || '',
            dimensions: product.dimensions || ''
        });
        setEditingId(product.id);
        setView('add');
    };

    const handleEditCategory = (category) => {
        setCategoryForm({
            name: category.name,
            description: category.description || ''
        });
        setEditingId(category.id);
        setView('add-category');
    };

    const handleEditFaq = (faq) => {
        setFaqForm({
            question: faq.question,
            answer: faq.answer
        });
        setEditingId(faq.id);
        setView('add-faq');
    };

    // --- Submit Handlers with Edit Logic ---

    const handleSubmit = async (e) => {

        e.preventDefault();
        setIsUploading(true);
        try {
            let image_url = '';

            if (imageFile) {
                image_url = await uploadImage(imageFile);
            }

            const productData = { ...formData };
            if (image_url) productData.image_url = image_url;

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingId);
                if (error) throw error;
                alert('Product updated successfully!');
            } else {
                if (!imageFile) throw new Error('Please select an image');
                // Create
                const { error } = await supabase
                    .from('products')
                    .insert([{ ...productData, image_url }]); // ensure image_url is set for new
                if (error) throw error;
                alert('Product added successfully!');
            }

            setView('list');
            setEditingId(null);
            setFormData({

                name: '',
                category: categories[0]?.name || '',
                price: '',
                description: '',
                stock_quantity: 10,
                is_featured: false,
                sku: '',
                material: '',
                dimensions: ''
            });

            setImageFile(null);
            fetchProducts();
        } catch (error) {
            alert('Error adding product: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        try {
            const slug = categoryForm.name.toLowerCase().replace(/\s+/g, '-');

            if (editingId) {
                const { error } = await supabase
                    .from('categories')
                    .update({ ...categoryForm, slug })
                    .eq('id', editingId);
                if (error) throw error;
                alert('Category updated successfully!');
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([{ ...categoryForm, slug }]);
                if (error) throw error;
                alert('Category added successfully!');
            }

            setView('categories');
            setEditingId(null);
            setCategoryForm({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            alert('Error adding/updating category: ' + error.message);
        }
    };


    const handleSubmitFaq = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const { error } = await supabase
                    .from('faqs')
                    .update(faqForm)
                    .eq('id', editingId);
                if (error) throw error;
                alert('FAQ updated successfully!');
            } else {
                const { error } = await supabase
                    .from('faqs')
                    .insert([faqForm]);
                if (error) throw error;
                alert('FAQ added successfully!');
            }

            setView('faqs');
            setEditingId(null);
            setFaqForm({ question: '', answer: '' });
            fetchFaqs();
        } catch (error) {
            alert('Error adding/updating FAQ: ' + error.message);
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: notificationForm.title,
                message: notificationForm.message,
                type: notificationForm.type,
                user_id: notificationForm.user_id.trim() === '' ? null : notificationForm.user_id
            };

            const { error } = await supabase.from('notifications').insert([payload]);
            if (error) throw error;

            alert('Notification sent!');
            setNotificationForm({ title: '', message: '', type: 'general', user_id: '' });
            fetchNotifications();
        } catch (error) {
            alert('Error sending notification: ' + error.message);
        }
    };

    const handleVerifySeller = async (sellerId, newStatus, adminNotes = '') => {
        try {
            const updateData = {
                seller_status: newStatus,
                admin_notes: adminNotes || null,
            };

            if (newStatus === 'approved') {
                updateData.seller_approved_at = new Date().toISOString();
            } else if (newStatus === 'rejected') {
                updateData.seller_rejected_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', sellerId);

            if (error) throw error;
            alert(`Seller ${newStatus} successfully!`);
            fetchSellers();
        } catch (error) {
            alert('Error updating seller status: ' + error.message);
        }
    };

    const handleVerifyProduct = async (productId, isVerified) => {
        try {
            if (isVerified) {
                const { error } = await supabase
                    .from('products')
                    .update({ is_verified: true })
                    .eq('id', productId);
                if (error) throw error;
                alert('Product verified!');
            } else {
                // Creating a 'reject' flow might basically be leaving it unverified or deleting it?
                // For now, let's assume 'Reject' means deleting or marking as rejected (if we had a status column).
                // The prompt asked for verification. We'll just verify for now.
                // If we want to Reject, we might just leave it there or delete it.
                // Let's add delete option in the UI instead of explicit 'reject' status for products to keep schema simple as requested.
            }
            fetchUnverifiedProducts();
            fetchProducts(); // Update main list too
        } catch (error) {
            alert('Error verifying product: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            alert('Error deleting product');
        }
    };


    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure? This might affect products using this category.')) return;


        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCategories();
        } catch (error) {
            alert('Error deleting category');
        }
    };

    const handleDeleteFaq = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

        try {
            const { error } = await supabase
                .from('faqs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchFaqs();
        } catch (error) {
            alert('Error deleting FAQ');
        }
    };


    const styles = {
        layout: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#F3F4F6',
            fontFamily: "'Inter', sans-serif",
        },
        sidebar: {
            width: '260px',
            backgroundColor: '#1F2937',
            color: 'white',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
        },
        logo: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '40px',
            color: '#10B981',
        },
        navItem: {
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: '#D1D5DB',
            cursor: 'pointer',
            border: 'none',
            textAlign: 'left',
            fontSize: '14px',
            marginBottom: '4px',
            width: '100%',
        },
        navItemActive: {
            backgroundColor: '#374151',
            color: 'white',
            fontWeight: '500',
        },
        main: {
            flex: 1,
            padding: '40px',
            overflowY: 'auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
        },
        btnPrimary: {
            backgroundColor: '#059669',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '500',
            cursor: 'pointer',
        },
        btnDanger: {
            backgroundColor: '#EF4444',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            fontSize: '12px',
            cursor: 'pointer',
        },

        // Table
        tableContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
        },
        th: {
            padding: '16px',
            backgroundColor: '#F9FAFB',
            color: '#6B7280',
            fontSize: '12px',
            textTransform: 'uppercase',
            fontWeight: '600',
            borderBottom: '1px solid #E5E7EB',
        },
        td: {
            padding: '16px',
            borderBottom: '1px solid #E5E7EB',
            fontSize: '14px',
            color: '#374151',
        },

        // Form
        formGroup: {
            marginBottom: '20px',
            maxWidth: '500px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
        },
        input: {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            outline: 'none',
        },
        textarea: {
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            outline: 'none',
            minHeight: '100px',
        },
    };

    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <div style={styles.logo}>Hatiya Admin</div>
                <button
                    style={{ ...styles.navItem, ...(view === 'list' || view === 'add' ? styles.navItemActive : {}) }}
                    onClick={() => setView('list')}
                >
                    Products
                </button>
                <button
                    style={{ ...styles.navItem, ...(view === 'categories' || view === 'add-category' ? styles.navItemActive : {}) }}
                    onClick={() => setView('categories')}
                >
                    Categories
                </button>
                <button
                    style={{ ...styles.navItem, ...(view === 'faqs' || view === 'add-faq' ? styles.navItemActive : {}) }}
                    onClick={() => setView('faqs')}
                >
                    FAQs
                </button>
                <button
                    style={{ ...styles.navItem, ...(view === 'sales' ? styles.navItemActive : {}) }}
                    onClick={() => setView('sales')}
                >
                    Sales
                </button>
                <button
                    style={{ ...styles.navItem, ...(view === 'notifications' ? styles.navItemActive : {}) }}
                    onClick={() => setView('notifications')}
                >
                    Notifications
                </button>
                <button
                    style={{ ...styles.navItem, ...(view === 'sellers' ? styles.navItemActive : {}) }}
                    onClick={() => setView('sellers')}
                >
                    Sellers
                </button>
                <button
                    style={{ ...styles.navItem, ...(view === 'verify-products' ? styles.navItemActive : {}) }}
                    onClick={() => setView('verify-products')}
                >
                    Verify Products {unverifiedProducts.length > 0 && `(${unverifiedProducts.length})`}
                </button>
                <div style={{ flex: 1 }}></div>

                <button style={styles.navItem} onClick={handleSignOut}>

                    Sign Out
                </button>
            </aside>

            <main style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        {view === 'list' && 'Products'}
                        {view === 'add' && (editingId ? 'Edit Product' : 'Add Product')}
                        {view === 'categories' && 'Categories'}
                        {view === 'add-category' && (editingId ? 'Edit Category' : 'Add Category')}
                        {view === 'faqs' && 'FAQs'}
                        {view === 'add-faq' && (editingId ? 'Edit FAQ' : 'Add FAQ')}
                        {view === 'sales' && 'Sales Orders'}
                        {view === 'sales' && 'Sales Orders'}
                        {view === 'notifications' && 'Send Notifications'}
                        {view === 'sellers' && 'Manage Sellers'}
                        {view === 'verify-products' && 'Verify Products'}
                    </h1>
                    {view === 'list' && (
                        <button style={styles.btnPrimary} onClick={() => {
                            setEditingId(null);
                            setFormData({
                                name: '', category: '', price: '', description: '', stock_quantity: 10, is_featured: false, sku: '', material: '', dimensions: ''
                            });
                            setView('add');
                        }}>
                            + Add Product
                        </button>
                    )}
                    {view === 'categories' && (
                        <button style={styles.btnPrimary} onClick={() => {
                            setEditingId(null);
                            setCategoryForm({ name: '', description: '' });
                            setView('add-category');
                        }}>
                            + Add Category
                        </button>
                    )}
                    {view === 'faqs' && (
                        <button style={styles.btnPrimary} onClick={() => {
                            setEditingId(null);
                            setFaqForm({ question: '', answer: '' });
                            setView('add-faq');
                        }}>
                            + Add FAQ
                        </button>
                    )}

                </div>




                {/* SELLERS VIEW */}
                {
                    view === 'sellers' && (
                        <div>
                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ backgroundColor: '#FEF3C7', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#B45309' }}>{sellers.filter(s => s.seller_status === 'pending').length}</div>
                                    <div style={{ fontSize: '13px', color: '#92400E' }}>Pending</div>
                                </div>
                                <div style={{ backgroundColor: '#D1FAE5', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#065F46' }}>{sellers.filter(s => s.seller_status === 'approved').length}</div>
                                    <div style={{ fontSize: '13px', color: '#047857' }}>Approved</div>
                                </div>
                                <div style={{ backgroundColor: '#FEE2E2', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#DC2626' }}>{sellers.filter(s => s.seller_status === 'rejected').length}</div>
                                    <div style={{ fontSize: '13px', color: '#B91C1C' }}>Rejected</div>
                                </div>
                            </div>

                            <div style={styles.tableContainer}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>Store Name</th>
                                            <th style={styles.th}>Email</th>
                                            <th style={styles.th}>Status</th>
                                            <th style={styles.th}>Date</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sellers.length === 0 ? (
                                            <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>No seller applications found.</td></tr>
                                        ) : (
                                            sellers.map(seller => (
                                                <tr key={seller.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedSeller(seller)}>
                                                    <td style={styles.td}>{seller.store_name || 'N/A'}</td>
                                                    <td style={styles.td}>{seller.email}</td>
                                                    <td style={styles.td}>
                                                        <span style={{
                                                            padding: '2px 8px', borderRadius: '12px', fontSize: '12px',
                                                            backgroundColor: seller.seller_status === 'approved' ? '#D1FAE5' : seller.seller_status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                                                            color: seller.seller_status === 'approved' ? '#065F46' : seller.seller_status === 'rejected' ? '#991B1B' : '#92400E'
                                                        }}>
                                                            {seller.seller_status?.toUpperCase() || 'PENDING'}
                                                        </span>
                                                    </td>
                                                    <td style={styles.td}>{seller.seller_applied_at ? new Date(seller.seller_applied_at).toLocaleDateString() : 'N/A'}</td>
                                                    <td style={styles.td} onClick={e => e.stopPropagation()}>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => setSelectedSeller(seller)} style={{ ...styles.btnSecondary, padding: '6px 12px', fontSize: '12px' }}>View</button>
                                                            {seller.seller_status === 'pending' && (
                                                                <>
                                                                    <button onClick={() => handleVerifySeller(seller.id, 'approved')} style={{ ...styles.btnPrimary, padding: '6px 12px', fontSize: '12px' }}>Approve</button>
                                                                    <button onClick={() => handleVerifySeller(seller.id, 'rejected')} style={{ ...styles.btnDanger, padding: '6px 12px', fontSize: '12px' }}>Reject</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }

                {/* VERIFY PRODUCTS VIEW */}
                {
                    view === 'verify-products' && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Image</th>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Store</th>
                                        <th style={styles.th}>Price</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unverifiedProducts.length === 0 ? (
                                        <tr><td colSpan="5" style={{ ...styles.td, textAlign: 'center' }}>No products pending verification.</td></tr>
                                    ) : (
                                        unverifiedProducts.map(product => (
                                            <tr key={product.id}>
                                                <td style={styles.td}>
                                                    <img src={product.image_url} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                                </td>
                                                <td style={styles.td}>{product.name}</td>
                                                <td style={styles.td}>{product.profiles?.store_name || 'N/A'}</td>
                                                <td style={styles.td}>${product.price}</td>
                                                <td style={styles.td}>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => handleVerifyProduct(product.id, true)} style={{ ...styles.btnPrimary, padding: '6px 12px', fontSize: '12px' }}>Verify</button>
                                                        <button onClick={() => handleDelete(product.id)} style={{ ...styles.btnDanger, padding: '6px 12px', fontSize: '12px' }}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }

                {/* PRODUCT LIST VIEW */}
                {
                    view === 'list' && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Image</th>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Category</th>
                                        <th style={styles.th}>Price</th>
                                        <th style={styles.th}>Stock</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                                No products found. Add one!
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map(product => (
                                            <tr key={product.id}>
                                                <td style={styles.td}>
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td style={styles.td}>{product.name}</td>
                                                <td style={styles.td}>
                                                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '50px', fontSize: '12px' }}>
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>${product.price}</td>
                                                <td style={styles.td}>{product.stock_quantity}</td>
                                                <td style={styles.td}>
                                                    <button style={{ ...styles.btnPrimary, padding: '6px 12px', fontSize: '12px', marginRight: '8px' }} onClick={() => handleEditProduct(product)}>Edit</button>
                                                    <button style={styles.btnDanger} onClick={() => handleDelete(product.id)}>Delete</button>
                                                </td>
                                            </tr>

                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }

                {/* ADD PRODUCT FORM */}
                {
                    view === 'add' && (
                        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', maxWidth: '600px' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Product Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ ...styles.formGroup, flex: 1 }}>
                                        <label style={styles.label}>Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            required
                                        />
                                    </div>
                                    <div style={{ ...styles.formGroup, flex: 1 }}>
                                        <label style={styles.label}>Stock</label>
                                        <input
                                            type="number"
                                            name="stock_quantity"
                                            value={formData.stock_quantity}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>SKU (Stock Keeping Unit)</label>
                                    <input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        placeholder="e.g., SANI-001"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ ...styles.formGroup, flex: 1 }}>
                                        <label style={styles.label}>Material</label>
                                        <input
                                            name="material"
                                            value={formData.material}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            placeholder="e.g., 100% Wool"
                                        />
                                    </div>
                                    <div style={{ ...styles.formGroup, flex: 1 }}>
                                        <label style={styles.label}>Dimensions</label>
                                        <input
                                            name="dimensions"
                                            value={formData.dimensions}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            placeholder="e.g., 10x15 cm"
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            name="is_featured"
                                            checked={formData.is_featured}
                                            onChange={handleInputChange}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        Feature this product (Show on Home Page)
                                    </label>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => setView('list')} style={{ ...styles.btnPrimary, backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={styles.btnPrimary} disabled={isUploading}>
                                        {isUploading ? 'Uploading...' : 'Save Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }

                {/* NOTIFICATIONS VIEW */}
                {
                    view === 'notifications' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Send New Notification</h3>
                                <form onSubmit={handleSendNotification}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Title</label>
                                        <input
                                            name="title"
                                            value={notificationForm.title}
                                            onChange={handleNotificationChange}
                                            style={styles.input}
                                            required
                                            placeholder="e.g. Shop Opening Soon!"
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Message</label>
                                        <textarea
                                            name="message"
                                            value={notificationForm.message}
                                            onChange={handleNotificationChange}
                                            style={styles.textarea}
                                            required
                                            placeholder="Write your message here..."
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Type</label>
                                        <select
                                            name="type"
                                            value={notificationForm.type}
                                            onChange={handleNotificationChange}
                                            style={styles.input}
                                        >
                                            <option value="general">General</option>
                                            <option value="payment">Payment Reminder</option>
                                            <option value="opening">Shop Opening</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>User ID (Optional - leave empty for all)</label>
                                        <input
                                            name="user_id"
                                            value={notificationForm.user_id}
                                            onChange={handleNotificationChange}
                                            style={styles.input}
                                            placeholder="Specific User UUID"
                                        />
                                    </div>
                                    <button type="submit" style={styles.btnPrimary}>
                                        Send Notification
                                    </button>
                                </form>
                            </div>

                            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px' }}>
                                <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Recent Notifications</h3>
                                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <p style={{ color: '#6B7280' }}>No notifications sent yet.</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} style={{ borderBottom: '1px solid #E5E7EB', padding: '12px 0' }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{n.title}</div>
                                                <div style={{ fontSize: '13px', color: '#374151', margin: '4px 0' }}>{n.message}</div>
                                                <div style={{ fontSize: '11px', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{n.type.toUpperCase()}</span>
                                                    <span>{n.user_id ? 'Individual' : 'Broadcast'} • {new Date(n.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* CATEGORIES LIST VIEW */}
                {
                    view === 'categories' && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Description</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                                No categories found.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map(cat => (
                                            <tr key={cat.id}>
                                                <td style={styles.td}><strong>{cat.name}</strong></td>
                                                <td style={styles.td}>{cat.description || '-'}</td>
                                                <td style={styles.td}>
                                                    <button style={{ ...styles.btnPrimary, padding: '6px 12px', fontSize: '12px', marginRight: '8px' }} onClick={() => handleEditCategory(cat)}>Edit</button>
                                                    <button style={styles.btnDanger} onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                                                </td>
                                            </tr>

                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }

                {/* ADD CATEGORY FORM */}
                {
                    view === 'add-category' && (
                        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', maxWidth: '600px' }}>
                            <form onSubmit={handleSubmitCategory}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Category Name</label>
                                    <input
                                        name="name"
                                        value={categoryForm.name}
                                        onChange={handleCategoryChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        value={categoryForm.description}
                                        onChange={handleCategoryChange}
                                        style={styles.textarea}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => setView('categories')} style={{ ...styles.btnPrimary, backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={styles.btnPrimary}>
                                        Save Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }

                {/* FAQ LIST VIEW */}
                {
                    view === 'faqs' && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Question</th>
                                        <th style={styles.th}>Answer</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqs.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                                No FAQs found.
                                            </td>
                                        </tr>
                                    ) : (
                                        faqs.map(faq => (
                                            <tr key={faq.id}>
                                                <td style={{ ...styles.td, width: '30%' }}><strong>{faq.question}</strong></td>
                                                <td style={styles.td}>{faq.answer}</td>
                                                <td style={styles.td}>
                                                    <button style={{ ...styles.btnPrimary, padding: '6px 12px', fontSize: '12px', marginRight: '8px' }} onClick={() => handleEditFaq(faq)}>Edit</button>
                                                    <button style={styles.btnDanger} onClick={() => handleDeleteFaq(faq.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }

                {/* ADD FAQ FORM */}
                {
                    view === 'add-faq' && (
                        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', maxWidth: '600px' }}>
                            <form onSubmit={handleSubmitFaq}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Question</label>
                                    <input
                                        name="question"
                                        value={faqForm.question}
                                        onChange={handleFaqChange}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Answer</label>
                                    <textarea
                                        name="answer"
                                        value={faqForm.answer}
                                        onChange={handleFaqChange}
                                        style={styles.textarea}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" onClick={() => setView('faqs')} style={{ ...styles.btnPrimary, backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB' }}>
                                        Cancel
                                    </button>
                                    <button type="submit" style={styles.btnPrimary}>
                                        Save FAQ
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }


                {/* SALES LIST VIEW */}
                {
                    view === 'sales' && (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Order ID</th>
                                        <th style={styles.th}>Customer</th>
                                        <th style={styles.th}>Total</th>
                                        <th style={styles.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                                No sales yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map(order => (
                                            <tr key={order.id}>
                                                <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td style={styles.td}>{order.id.slice(0, 8)}</td>
                                                <td style={styles.td}>{order.customer_name}</td>
                                                <td style={styles.td}>NPR {order.total_amount}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        backgroundColor: order.status === 'completed' ? '#ECFDF5' : '#FEF3C7',
                                                        color: order.status === 'completed' ? '#059669' : '#D97706',
                                                        padding: '2px 8px', borderRadius: '50px', fontSize: '12px'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )
                }



            </main >

            {/* Seller Detail Modal */}
            {selectedSeller && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setSelectedSeller(null)}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', maxWidth: '700px',
                        width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '32px'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>Seller Details</h2>
                            <button onClick={() => setSelectedSeller(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7280' }}>×</button>
                        </div>

                        {/* Status & Email Verification */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ padding: '16px', backgroundColor: selectedSeller.seller_status === 'approved' ? '#D1FAE5' : selectedSeller.seller_status === 'rejected' ? '#FEE2E2' : '#FEF3C7', borderRadius: '12px' }}>
                                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Application Status</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: selectedSeller.seller_status === 'approved' ? '#065F46' : selectedSeller.seller_status === 'rejected' ? '#991B1B' : '#92400E' }}>
                                    {selectedSeller.seller_status?.toUpperCase() || 'PENDING'}
                                </p>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: selectedSeller.email_confirmed_at ? '#D1FAE5' : '#FEE2E2', borderRadius: '12px' }}>
                                <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Email Verification</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: selectedSeller.email_confirmed_at ? '#065F46' : '#991B1B' }}>
                                    {selectedSeller.email_confirmed_at ? '✓ Verified' : '✗ Not Verified'}
                                </p>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#374151' }}>Account Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Email:</span><br /><strong>{selectedSeller.email || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Applied:</span><br /><strong>{selectedSeller.seller_applied_at ? new Date(selectedSeller.seller_applied_at).toLocaleString() : 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>User ID:</span><br /><strong style={{ fontSize: '12px', wordBreak: 'break-all' }}>{selectedSeller.id}</strong></div>
                                {selectedSeller.seller_approved_at && <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Approved:</span><br /><strong>{new Date(selectedSeller.seller_approved_at).toLocaleString()}</strong></div>}
                            </div>
                        </div>

                        {/* Business Info */}
                        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#374151' }}>Business Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Store Name:</span><br /><strong>{selectedSeller.store_name || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Business Name:</span><br /><strong>{selectedSeller.business_name || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Business Type:</span><br /><strong>{selectedSeller.business_type || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Registration #:</span><br /><strong>{selectedSeller.business_registration_number || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Tax ID:</span><br /><strong>{selectedSeller.tax_id || 'N/A'}</strong></div>
                            </div>
                            {selectedSeller.store_description && (
                                <div style={{ marginTop: '12px' }}><span style={{ color: '#6B7280', fontSize: '13px' }}>Store Description:</span><br /><strong>{selectedSeller.store_description}</strong></div>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#374151' }}>Contact Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Phone:</span><br /><strong>{selectedSeller.phone || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Country:</span><br /><strong>{selectedSeller.country || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>City:</span><br /><strong>{selectedSeller.city || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Postal Code:</span><br /><strong>{selectedSeller.postal_code || 'N/A'}</strong></div>
                            </div>
                            {selectedSeller.address && (
                                <div style={{ marginTop: '12px' }}><span style={{ color: '#6B7280', fontSize: '13px' }}>Address:</span><br /><strong>{selectedSeller.address}</strong></div>
                            )}
                        </div>

                        {/* Bank Info */}
                        <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#374151' }}>Bank / Payout Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Bank Name:</span><br /><strong>{selectedSeller.bank_name || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Account Name:</span><br /><strong>{selectedSeller.bank_account_name || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>Account Number:</span><br /><strong>{selectedSeller.bank_account_number || 'N/A'}</strong></div>
                                <div><span style={{ color: '#6B7280', fontSize: '13px' }}>SWIFT Code:</span><br /><strong>{selectedSeller.bank_swift_code || 'N/A'}</strong></div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        {selectedSeller.admin_notes && (
                            <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#92400E' }}>Admin Notes</h3>
                                <p style={{ margin: 0, color: '#92400E' }}>{selectedSeller.admin_notes}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {selectedSeller.seller_status === 'pending' && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => { handleVerifySeller(selectedSeller.id, 'approved'); setSelectedSeller(null); }}
                                    style={{ ...styles.btnPrimary, flex: 1, padding: '14px', fontSize: '16px', justifyContent: 'center' }}
                                >
                                    ✓ Approve Seller
                                </button>
                                <button
                                    onClick={() => { handleVerifySeller(selectedSeller.id, 'rejected'); setSelectedSeller(null); }}
                                    style={{ ...styles.btnDanger, flex: 1, padding: '14px', fontSize: '16px', justifyContent: 'center' }}
                                >
                                    ✗ Reject Seller
                                </button>
                            </div>
                        )}

                        {selectedSeller.seller_status !== 'pending' && (
                            <button
                                onClick={() => setSelectedSeller(null)}
                                style={{ ...styles.btnSecondary, width: '100%', padding: '14px', fontSize: '16px', justifyContent: 'center' }}
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminDashboard;

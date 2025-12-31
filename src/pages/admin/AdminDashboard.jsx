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
    const [view, setView] = useState('list'); // 'list', 'add', 'categories', 'add-category'
    const [imageFile, setImageFile] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        stock_quantity: 10,
        is_featured: false
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: ''
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
        await Promise.all([fetchProducts(), fetchCategories()]);
        setIsLoading(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let image_url = '';

            if (imageFile) {
                image_url = await uploadImage(imageFile);
            } else {
                throw new Error('Please select an image');
            }

            const { error } = await supabase
                .from('products')
                .insert([{ ...formData, image_url }]);

            if (error) throw error;

            alert('Product added successfully!');
            setView('list');
            setFormData({
                name: '',
                category: categories[0]?.name || '',
                price: '',
                description: '',
                stock_quantity: 10,
                is_featured: false
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
            const { error } = await supabase
                .from('categories')
                .insert([{ ...categoryForm, slug }]);

            if (error) throw error;

            alert('Category added successfully!');
            setView('categories');
            setCategoryForm({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            alert('Error adding category: ' + error.message);
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
                <div style={{ flex: 1 }}></div>
                <button style={styles.navItem} onClick={handleSignOut}>
                    Sign Out
                </button>
            </aside>

            <main style={styles.main}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        {view === 'list' && 'Products'}
                        {view === 'add' && 'Add Product'}
                        {view === 'categories' && 'Categories'}
                        {view === 'add-category' && 'Add Category'}
                    </h1>
                    {view === 'list' && (
                        <button style={styles.btnPrimary} onClick={() => setView('add')}>
                            + Add Product
                        </button>
                    )}
                    {view === 'categories' && (
                        <button style={styles.btnPrimary} onClick={() => setView('add-category')}>
                            + Add Category
                        </button>
                    )}
                </div>

                {/* PRODUCT LIST VIEW */}
                {view === 'list' && (
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
                                                <img src={product.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
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
                                                <button style={styles.btnDanger} onClick={() => handleDelete(product.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ADD PRODUCT FORM */}
                {view === 'add' && (
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
                )}

                {/* CATEGORIES LIST VIEW */}
                {view === 'categories' && (
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
                                                <button style={styles.btnDanger} onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ADD CATEGORY FORM */}
                {view === 'add-category' && (
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
                )}

            </main>
        </div>
    );
};

export default AdminDashboard;

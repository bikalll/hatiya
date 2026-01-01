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
    const [showAddModal, setShowAddModal] = useState(false);

    // Fetch Seller Profile and Products
    useEffect(() => {
        if (!user) {
            navigate('/seller/login');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                // 2. Fetch Products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('seller_id', user.id)
                    .order('created_at', { ascending: false });

                if (productsError) throw productsError;
                setProducts(productsData || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);


    const handleSignOut = async () => {
        await signOut();
        navigate('/seller/login');
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading seller dashboard...</div>;

    if (!profile) return <div>Error loading profile.</div>;

    if (profile.seller_status === 'pending') {
        return (
            <div style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
                <h1 style={{ fontSize: '28px', color: '#B45309', marginBottom: '16px' }}>Application Pending</h1>
                <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '32px' }}>
                    Hello <strong>{profile.store_name}</strong>,<br />
                    Your seller account is currently under review by our administrators.
                    You will be able to add products once your account is approved.
                </p>
                <button onClick={handleSignOut} style={{ padding: '10px 20px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Sign Out
                </button>
            </div>
        );
    }

    if (profile.seller_status === 'rejected') {
        return (
            <div style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
                <h1 style={{ fontSize: '28px', color: '#DC2626', marginBottom: '16px' }}>Application Rejected</h1>
                <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '32px' }}>
                    We're sorry, but your application for <strong>{profile.store_name}</strong> has been declined.
                </p>
                <button onClick={handleSignOut} style={{ padding: '10px 20px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>Seller Dashboard</h1>
                    <p style={{ color: '#6B7280' }}>Store: <strong>{profile.store_name}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{ padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                    >
                        + Add New Product
                    </button>
                    <button
                        onClick={handleSignOut}
                        style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Stats Overview (Simplified) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <StatCard label="Total Products" value={products.length} />
                <StatCard label="Live Products" value={products.filter(p => p.is_verified).length} />
                <StatCard label="Pending Approval" value={products.filter(p => !p.is_verified).length} />
            </div>

            {/* Products List */}
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>Your Products</h2>

            {products.length === 0 ? (
                <div style={{ padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '8px', textAlign: 'center', color: '#6B7280' }}>
                    You haven't added any products yet.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                <th style={{ padding: '12px', color: '#6B7280', fontSize: '14px' }}>Image</th>
                                <th style={{ padding: '12px', color: '#6B7280', fontSize: '14px' }}>Name</th>
                                <th style={{ padding: '12px', color: '#6B7280', fontSize: '14px' }}>Price</th>
                                <th style={{ padding: '12px', color: '#6B7280', fontSize: '14px' }}>Stock</th>
                                <th style={{ padding: '12px', color: '#6B7280', fontSize: '14px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '12px' }}>
                                        <img src={product.image_url} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{product.name}</td>
                                    <td style={{ padding: '12px' }}>Rs. {product.price}</td>
                                    <td style={{ padding: '12px' }}>{product.stock_quantity}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            borderRadius: '999px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: product.is_verified ? '#DEF7EC' : '#FFFBEB',
                                            color: product.is_verified ? '#03543F' : '#92400E'
                                        }}>
                                            {product.is_verified ? 'Live' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} sellerId={user.id} onProductAdded={(newProduct) => {
                setProducts([newProduct, ...products]);
                setShowAddModal(false);
            }} />}
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{value}</div>
    </div>
);

const AddProductModal = ({ onClose, sellerId, onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        image_url: '',
        description: '',
        stock_quantity: 10
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newProduct = {
                ...formData,
                seller_id: sellerId,
                is_verified: false, // Explicitly set false
                original_price: formData.price // simplistic default
            };

            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select()
                .single();

            if (error) throw error;
            onProductAdded(data);
        } catch (error) {
            alert('Error adding product: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
                <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }}
                        placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />

                    <select style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }}
                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="">Select Category</option>
                        <option value="Handicrafts">Handicrafts</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Food">Food</option>
                    </select>

                    <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }}
                        type="number" placeholder="Price (NPR)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />

                    <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }}
                        placeholder="Image URL" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} required />

                    <textarea style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box', height: '80px' }}
                        placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <input style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '20px', boxSizing: 'border-box' }}
                        type="number" placeholder="Stock Quantity" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} />

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'cursor' }}>Cancel</button>
                        <button type="submit" disabled={submitting} style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {submitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerDashboard;

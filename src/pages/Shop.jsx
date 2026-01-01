import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductModal from '../components/ProductModal';


import { supabase } from '../lib/supabaseClient';

// Removed hardcoded products
// Removed hardcoded categories

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const { addToCart } = useCart();

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: productData } = await supabase
                .from('products')
                .select('*, profiles(store_name)');
            const { data: categoryData } = await supabase.from('categories').select('*').order('name');

            if (productData) setProducts(productData);
            if (categoryData) {
                setCategories(['All', ...categoryData.map(c => c.name)]);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.includes(categoryParam)) {
            setActiveCategory(categoryParam);
        } else {
            setActiveCategory('All');
        }
    }, [searchParams]);

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        if (cat === 'All') {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('category');
            setSearchParams(newParams);
        } else {
            setSearchParams({ category: cat });
        }
    };

    const searchTerm = searchParams.get('search') || '';

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = searchTerm === '' ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());

        const price = parseFloat(product.price);
        const matchesMinPrice = minPrice === '' || price >= parseFloat(minPrice);
        const matchesMaxPrice = maxPrice === '' || price <= parseFloat(maxPrice);

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
    }).sort((a, b) => {
        if (sortBy === 'price-low') {
            return parseFloat(a.price) - parseFloat(b.price);
        } else if (sortBy === 'price-high') {
            return parseFloat(b.price) - parseFloat(a.price);
        } else if (sortBy === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0; // Default (Popular) - usually implies no specific sort or server default
    });


    const styles = {
        page: {
            backgroundColor: '#FAFAFA',
            minHeight: '100vh',
        },
        header: {
            backgroundColor: '#065F46',
            padding: '50px 60px',
            textAlign: 'center',
        },
        headerTitle: {
            fontSize: '32px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '8px',
        },
        headerSubtitle: {
            fontSize: '15px',
            color: '#A7F3D0',
        },

        mainSection: {
            padding: '40px 60px',
            display: 'flex',
            gap: '40px',
        },

        sidebar: {
            width: '220px',
            flexShrink: 0,
        },
        sidebarSection: {
            marginBottom: '32px',
        },
        sidebarTitle: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
        },
        categoryList: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
        },
        categoryItem: {
            padding: '10px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#374151',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.2s',
        },
        categoryItemActive: {
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            fontWeight: '500',
        },

        mainContent: {
            flex: 1,
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
        },
        resultsCount: {
            fontSize: '14px',
            color: '#6B7280',
        },
        sortSelect: {
            padding: '8px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#374151',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
        },

        productsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #E5E7EB',
        },
        productImageContainer: {
            position: 'relative',
        },
        productImage: {
            width: '100%',
            height: '220px',
            objectFit: 'cover',
        },
        badge: {
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: '#059669',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
        },
        productInfo: {
            padding: '16px',
        },
        productCategory: {
            fontSize: '11px',
            color: '#059669',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
        },
        productVendor: {
            fontSize: '11px',
            color: '#6B7280',
            fontWeight: '400',
            marginBottom: '4px',
        },
        productName: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '10px',
        },
        productPriceRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        productPrice: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
        },
        originalPrice: {
            fontSize: '13px',
            color: '#9CA3AF',
            textDecoration: 'line-through',
            marginLeft: '8px',
        },
        addBtn: {
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>Shop All Products</h1>
                <p style={styles.headerSubtitle}>Explore our complete collection of authentic Nepali treasures</p>
            </header>

            <section style={styles.mainSection}>
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarSection}>
                        <h3 style={styles.sidebarTitle}>Categories</h3>
                        <div style={styles.categoryList}>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    style={{
                                        ...styles.categoryItem,
                                        ...(activeCategory === cat ? styles.categoryItemActive : {})
                                    }}
                                    onClick={() => handleCategoryClick(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.sidebarSection}>
                        <h3 style={styles.sidebarTitle}>Price Range</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                style={{ ...styles.sortSelect, width: '70px' }}
                            />
                            <span style={{ color: '#6B7280' }}>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                style={{ ...styles.sortSelect, width: '70px' }}
                            />
                        </div>
                    </div>

                </aside>

                <main style={styles.mainContent}>
                    <div style={styles.toolbar}>
                        <span style={styles.resultsCount}>
                            Showing {filteredProducts.length} products
                        </span>
                        <select
                            style={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Sort by: Popular</option>
                            <option value="newest">Sort by: Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    <div style={styles.productsGrid}>
                        {isLoading ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Loading products...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>No products found.</div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} style={styles.productCard}>
                                    <div
                                        style={{ ...styles.productImageContainer, cursor: 'pointer' }}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <img src={product.image_url} alt={product.name} style={styles.productImage} />
                                        {product.badge && <span style={styles.badge}>{product.badge}</span>}
                                    </div>
                                    <div style={styles.productInfo}>
                                        <div style={styles.productCategory}>{product.category}</div>
                                        <div style={styles.productVendor}>By {product.profiles?.store_name || 'Sanibare Hatiya'}</div>
                                        <div style={styles.productName}>{product.name}</div>
                                        <div style={styles.productPriceRow}>
                                            <div>
                                                <span style={styles.productPrice}>NPR {product.price}</span>
                                                {product.original_price && (
                                                    <span style={styles.originalPrice}>NPR {product.original_price}</span>
                                                )}
                                            </div>
                                            <button
                                                style={styles.addBtn}
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </section>

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={addToCart}
            />
        </div>
    );
};


export default Shop;

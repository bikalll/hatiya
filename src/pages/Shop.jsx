import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const allProducts = [
    { id: 1, category: 'Handicrafts', name: 'Tibetan Singing Bowl', price: '$89', originalPrice: '$129', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1545147986-a9d6f2ab03b5?w=400&h=400&fit=crop' },
    { id: 2, category: 'Art', name: 'Thangka Painting', price: '$245', originalPrice: null, badge: 'Handmade', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
    { id: 3, category: 'Textiles', name: 'Pashmina Shawl', price: '$156', originalPrice: '$199', badge: 'Sale', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop' },
    { id: 4, category: 'Spices', name: 'Himalayan Tea Collection', price: '$34', originalPrice: null, badge: null, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop' },
    { id: 5, category: 'Jewelry', name: 'Silver Filigree Earrings', price: '$45', originalPrice: null, badge: 'Artisan', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop' },
    { id: 6, category: 'Decor', name: 'Handwoven Rug', price: '$189', originalPrice: '$220', badge: 'Sale', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=400&fit=crop' },
    { id: 7, category: 'Handicrafts', name: 'Wooden Buddha Statue', price: '$125', originalPrice: null, badge: null, image: 'https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?w=400&h=400&fit=crop' },
    { id: 8, category: 'Spices', name: 'Organic Spice Set', price: '$28', originalPrice: null, badge: 'Organic', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop' },
    { id: 9, category: 'Textiles', name: 'Dhaka Fabric Scarf', price: '$48', originalPrice: null, badge: null, image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=400&fit=crop' },
    { id: 10, category: 'Art', name: 'Mandala Wall Art', price: '$180', originalPrice: '$220', badge: 'Sale', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop' },
    { id: 11, category: 'Jewelry', name: 'Turquoise Necklace', price: '$95', originalPrice: null, badge: null, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
    { id: 12, category: 'Decor', name: 'Lokta Paper Lamp', price: '$42', originalPrice: null, badge: 'Eco', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=400&fit=crop' },
];

const categories = ['All', 'Handicrafts', 'Art', 'Textiles', 'Spices', 'Jewelry', 'Decor'];

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popular');

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

    const filteredProducts = activeCategory === 'All'
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

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
                        {filteredProducts.map((product) => (
                            <div key={product.id} style={styles.productCard}>
                                <div style={styles.productImageContainer}>
                                    <img src={product.image} alt={product.name} style={styles.productImage} />
                                    {product.badge && <span style={styles.badge}>{product.badge}</span>}
                                </div>
                                <div style={styles.productInfo}>
                                    <div style={styles.productCategory}>{product.category}</div>
                                    <div style={styles.productName}>{product.name}</div>
                                    <div style={styles.productPriceRow}>
                                        <div>
                                            <span style={styles.productPrice}>{product.price}</span>
                                            {product.originalPrice && (
                                                <span style={styles.originalPrice}>{product.originalPrice}</span>
                                            )}
                                        </div>
                                        <button style={styles.addBtn}>Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </section>
        </div>
    );
};

export default Shop;

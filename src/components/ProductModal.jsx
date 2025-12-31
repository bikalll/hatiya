import React, { useEffect } from 'react';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1003,
            padding: '20px',
        },
        modal: {
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 768px)': {
                flexDirection: 'row',
            }
        },
        closeBtn: {
            position: 'absolute',
            top: '16px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#4B5563',
            zIndex: 10,
        },
        contentGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0',
        },
        imageContainer: {
            width: '100%',
            height: '300px',
            backgroundColor: '#F3F4F6',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        },
        details: {
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
        },
        category: {
            fontSize: '13px',
            color: '#059669',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
        },
        name: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px',
            lineHeight: '1.2',
        },
        price: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '24px',
        },
        description: {
            fontSize: '16px',
            color: '#4B5563',
            lineHeight: '1.6',
            marginBottom: '32px',
        },
        meta: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '32px',
            fontSize: '14px',
            color: '#6B7280',
            borderTop: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
            padding: '20px 0',
        },
        metaItem: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        addBtn: {
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            alignSelf: 'start',
        },
    };

    // Responsive layout handling via inline styles is tricky without window listener
    // simplifying to a flex layout that stacks on mobile by default

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>&times;</button>

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                    </div>

                    <div style={{ flex: '1 1 400px', padding: '40px' }}>
                        <div style={styles.category}>{product.category}</div>
                        <h2 style={styles.name}>{product.name}</h2>
                        <div style={styles.price}>NPR {product.price}</div>

                        <p style={styles.description}>{product.description || 'No description available for this product.'}</p>

                        <div style={styles.meta}>
                            {product.sku && (
                                <div style={styles.metaItem}>
                                    <span>SKU</span>
                                    <span style={{ color: '#111827' }}>{product.sku}</span>
                                </div>
                            )}
                            {product.material && (
                                <div style={styles.metaItem}>
                                    <span>Material</span>
                                    <span style={{ color: '#111827' }}>{product.material}</span>
                                </div>
                            )}
                            {product.dimensions && (
                                <div style={styles.metaItem}>
                                    <span>Dimensions</span>
                                    <span style={{ color: '#111827' }}>{product.dimensions}</span>
                                </div>
                            )}
                            <div style={styles.metaItem}>
                                <span>Stock</span>
                                <span style={{ color: product.stock_quantity > 0 ? '#059669' : '#EF4444' }}>
                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <button
                            style={styles.addBtn}
                            onClick={() => {
                                onAddToCart(product);
                                onClose();
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

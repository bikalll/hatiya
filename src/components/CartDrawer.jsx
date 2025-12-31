import React from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

const CartDrawer = () => {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        clearCart
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            // 1. Create Order in Supabase
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    total_amount: cartTotal,
                    status: 'pending',
                    customer_name: 'Guest Customer' // You might want to grab this from inputs later
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = cartItems.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Construct WhatsApp Message
            let message = `*New Order #${order.id.slice(0, 8)}*\n\n`;
            cartItems.forEach(item => {
                message += `- ${item.name} (x${item.quantity}) - NPR ${item.price}\n`;
            });
            message += `\n*Total: NPR ${cartTotal.toFixed(2)}*`;
            message += `\n\nTo confirm, please reply with your delivery address.`;

            // 4. Redirect to WhatsApp
            const phoneNumber = '9702046179';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            clearCart();
            window.open(whatsappUrl, '_blank');
            closeCart();

        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Failed to process checkout. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            display: isCartOpen ? 'block' : 'none',
        },
        drawer: {
            position: 'fixed',
            top: 0,
            right: 0,
            width: '400px',
            maxWidth: '90%',
            height: '100vh',
            backgroundColor: 'white',
            zIndex: 1002,
            transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            padding: '24px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
        },
        closeBtn: {
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6B7280',
        },
        cartItems: {
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        emptyCart: {
            textAlign: 'center',
            marginTop: '60px',
            color: '#6B7280',
        },
        itemCard: {
            display: 'flex',
            gap: '16px',
            borderBottom: '1px solid #F3F4F6',
            paddingBottom: '20px',
        },
        itemImage: {
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '8px',
            backgroundColor: '#F9FAFB',
        },
        itemInfo: {
            flex: 1,
        },
        itemName: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '4px',
        },
        itemPrice: {
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '8px',
        },
        itemControls: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        qtyControls: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '4px 8px',
        },
        qtyBtn: {
            background: 'none',
            border: 'none',
            color: '#374151',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
        },
        qtyText: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#111827',
            minWidth: '20px',
            textAlign: 'center',
        },
        removeBtn: {
            background: 'none',
            border: 'none',
            color: '#EF4444',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline',
        },
        footer: {
            padding: '24px',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
        },
        totalRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
        },
        checkoutBtn: {
            width: '100%',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
    };

    return (
        <>
            <div style={styles.overlay} onClick={closeCart}></div>
            <div style={styles.drawer}>
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>Shopping Cart</h2>
                    <button style={styles.closeBtn} onClick={closeCart}>&times;</button>
                </div>

                <div style={styles.cartItems}>
                    {cartItems.length === 0 ? (
                        <div style={styles.emptyCart}>
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} style={styles.itemCard}>
                                <img src={item.image_url} alt={item.name} style={styles.itemImage} />
                                <div style={styles.itemInfo}>
                                    <h4 style={styles.itemName}>{item.name}</h4>
                                    <p style={styles.itemPrice}>NPR {item.price}</p>
                                    <div style={styles.itemControls}>
                                        <div style={styles.qtyControls}>
                                            <button
                                                style={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                &minus;
                                            </button>
                                            <span style={styles.qtyText}>{item.quantity}</span>
                                            <button
                                                style={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            style={styles.removeBtn}
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div style={styles.footer}>
                        <div style={styles.totalRow}>
                            <span>Total</span>
                            <span>NPR {cartTotal.toFixed(2)}</span>
                        </div>
                        <button style={styles.checkoutBtn} onClick={handleCheckout} disabled={isCheckingOut}>
                            {isCheckingOut ? 'Processing...' : 'Pre-order Now (No Payment Required)'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (!user) return null;

    const styles = {
        page: {
            padding: '60px',
            maxWidth: '800px',
            margin: '0 auto',
            minHeight: '60vh',
        },
        header: {
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '20px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        title: {
            fontSize: '32px',
            fontWeight: '600',
            color: '#111827',
        },
        section: {
            marginBottom: '40px',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
        },
        sectionTitle: {
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px',
        },
        infoRow: {
            display: 'flex',
            marginBottom: '16px',
        },
        label: {
            width: '120px',
            color: '#6B7280',
            fontWeight: '500',
        },
        value: {
            color: '#111827',
            fontWeight: '500',
        },
        signOutBtn: {
            backgroundColor: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
                <button style={styles.signOutBtn} onClick={handleSignOut}>Sign Out</button>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Account Information</h2>
                <div style={styles.infoRow}>
                    <span style={styles.label}>Email:</span>
                    <span style={styles.value}>{user.email}</span>
                </div>
                <div style={styles.infoRow}>
                    <span style={styles.label}>Member since:</span>
                    <span style={styles.value}>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Orders</h2>
                <p style={{ color: '#6B7280' }}>No recent orders found.</p>
            </div>
        </div>
    );
};

export default Profile;

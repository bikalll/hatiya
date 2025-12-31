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
            padding: '40px 20px',
            maxWidth: '1000px',
            margin: '0 auto',
            minHeight: '80vh',
            fontFamily: "'Inter', sans-serif",
            color: '#111827',
        },
        headerContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
        },
        pageTitle: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#065F46',
        },

        // Profile Card
        profileCard: {
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
        },
        coverImage: {
            height: '160px',
            background: 'linear-gradient(to right, #065F46, #34D399)',
            position: 'relative',
        },
        profileContent: {
            padding: '0 40px 40px',
            marginTop: '-60px', // Pull up content to overlap cover
        },

        // Avatar Area
        avatarWrapper: {
            position: 'relative',
            display: 'inline-block',
            marginBottom: '20px',
        },
        avatar: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '4px solid white',
            backgroundColor: '#F3F4F6',
            objectFit: 'cover',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        avatarPlaceholder: {
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '4px solid white',
            backgroundColor: '#059669',
            color: 'white',
            fontSize: '48px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },

        userInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
        },
        userDetails: {
            flex: 1,
        },
        userName: {
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '4px',
        },
        userEmail: {
            fontSize: '16px',
            color: '#6B7280',
            marginBottom: '16px',
        },
        badges: {
            display: 'flex',
            gap: '12px',
        },
        badge: {
            padding: '4px 12px',
            borderRadius: '50px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: '#ECFDF5',
            color: '#059669',
        },

        actions: {
            display: 'flex',
            gap: '12px',
        },
        btnPrimary: {
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        btnSecondary: {
            backgroundColor: 'white',
            color: '#374151',
            border: '1px solid #D1D5DB',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        signOutBtn: {
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },

        // Sections
        gridSection: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginTop: '32px',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #F3F4F6',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        emptyState: {
            color: '#6B7280',
            fontSize: '14px',
            textAlign: 'center',
            padding: '20px 0',
            fontStyle: 'italic',
        },
    };

    const hasAvatar = user.user_metadata?.avatar_url;
    const fullName = user.user_metadata?.full_name || user.user_metadata?.first_name
        ? `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim()
        : 'Valued Customer';

    const initials = fullName.charAt(0).toUpperCase();

    return (
        <div style={styles.page}>
            <div style={styles.headerContainer}>
                <h1 style={styles.pageTitle}>My Dashboard</h1>
            </div>

            <div style={styles.profileCard}>
                <div style={styles.coverImage}></div>
                <div style={styles.profileContent}>
                    <div style={styles.avatarWrapper}>
                        {hasAvatar ? (
                            <img src={user.user_metadata.avatar_url} alt="Profile" style={styles.avatar} />
                        ) : (
                            <div style={styles.avatarPlaceholder}>{initials}</div>
                        )}
                    </div>

                    <div style={styles.userInfo}>
                        <div style={styles.userDetails}>
                            <h2 style={styles.userName}>{fullName}</h2>
                            <p style={styles.userEmail}>{user.email}</p>
                            <div style={styles.badges}>
                                <span style={styles.badge}>Member</span>
                                <span style={styles.badge}>Verified</span>
                            </div>
                        </div>
                        <div style={styles.actions}>
                            <button style={styles.btnSecondary}>Edit Profile</button>
                            <button style={styles.signOutBtn} onClick={handleSignOut}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.gridSection}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Recent Orders
                    </h3>
                    <div style={styles.emptyState}>No recent orders found. Time to shop!</div>
                    <button style={{ ...styles.btnSecondary, width: '100%', marginTop: '16px' }} onClick={() => navigate('/shop')}>
                        Start Shopping
                    </button>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Account Details
                    </h3>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                        <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        <p><strong>Last Login:</strong> {new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

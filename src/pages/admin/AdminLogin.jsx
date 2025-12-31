import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error, data } = await signIn({ email, password });
            if (error) throw error;

            // Check role in profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                await signOut();
                setError('Error verifying permissions.');
                if (profileError) console.error(profileError); // Log for debugging
                return;
            }

            if (profile && profile.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                await signOut();
                setError('Access Denied: You are not an administrator.');
            }
        } catch (err) {
            setError(err.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1F2937', // Darker theme for admin
        },
        card: {
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            textAlign: 'center',
        },
        subtitle: {
            fontSize: '14px',
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: '32px',
        },
        formGroup: {
            marginBottom: '20px',
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px',
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #D1D5DB',
            outline: 'none',
            fontSize: '14px',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            backgroundColor: '#065F46',
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s',
        },
        error: {
            color: '#DC2626',
            fontSize: '14px',
            marginBottom: '16px',
            textAlign: 'center',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Admin Portal</h1>
                <p style={styles.subtitle}>Restricted Access Only</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="admin@hatiya.com"
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Verifying Access...' : 'Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;

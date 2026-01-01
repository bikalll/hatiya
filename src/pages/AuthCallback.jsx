import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

/**
 * AuthCallback handles email verification redirects from Supabase.
 * It checks if the user is a seller and redirects accordingly.
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('Verifying your email...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the current session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setStatus('Verification failed. Please try again.');
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                if (session?.user) {
                    // Check if user is a seller
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('seller_status')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) {
                        console.error('Profile error:', profileError);
                    }

                    // Redirect based on user type
                    if (profile?.seller_status) {
                        // User is a seller (has applied or is approved)
                        setStatus('Email verified! Redirecting to seller login...');
                        setTimeout(() => navigate('/seller/login'), 2000);
                    } else {
                        // Regular user
                        setStatus('Email verified! Redirecting to login...');
                        setTimeout(() => navigate('/login'), 2000);
                    }
                } else {
                    // No session - email verification link may have expired
                    setStatus('Session expired. Please log in again.');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                console.error('Callback error:', error);
                setStatus('An error occurred. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [navigate, searchParams]);

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            fontFamily: "'Inter', sans-serif",
        },
        card: {
            backgroundColor: 'white',
            padding: '48px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            maxWidth: '400px',
        },
        spinner: {
            width: '40px',
            height: '40px',
            border: '3px solid #E5E7EB',
            borderTopColor: '#059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px',
        },
        statusText: {
            fontSize: '16px',
            color: '#374151',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.spinner}></div>
                <p style={styles.statusText}>{status}</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default AuthCallback;

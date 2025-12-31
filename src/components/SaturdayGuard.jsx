import React, { useState, useEffect } from 'react';

const SaturdayGuard = ({ children }) => {
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const [isSaturday, setIsSaturday] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const day = now.getDay();

            // Check if it's Saturday (Day 6)
            if (day === 6) {
                setIsSaturday(true);
            } else {
                setIsSaturday(false);
                calculateTimeLeft(now, day);
            }
        };

        const calculateTimeLeft = (now, currentDay) => {
            // Calculate limit to next Saturday 00:00:00
            // Days until Saturday: if today is 0 (Sun), wait 6 days. If 1 (Mon), wait 5.
            // If today is 6 (Sat) logic is handled above, but technically should be open.

            const daysUntilSat = 6 - currentDay;
            // If currentDay is 0 (Sun), daysUntilSat = 6. Correct.
            // If currentDay is 5 (Fri), daysUntilSat = 1. Correct.

            const nextSaturday = new Date(now);
            nextSaturday.setDate(now.getDate() + daysUntilSat);
            nextSaturday.setHours(0, 0, 0, 0);

            const diff = nextSaturday - now;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        checkTime();
        const timer = setInterval(checkTime, 1000);

        return () => clearInterval(timer);
    }, []);

    if (isSaturday) {
        return children;
    }

    const styles = {
        container: {
            height: '100vh',
            width: '100vw',
            backgroundColor: '#064E3B', // Dark Green
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            fontFamily: "'Inter', sans-serif",
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
        },
        logo: {
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#34D399',
        },
        message: {
            fontSize: '24px',
            marginBottom: '40px',
            maxWidth: '600px',
            lineHeight: '1.5',
        },
        timerTitle: {
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            opacity: 0.8,
            marginBottom: '10px',
        },
        timer: {
            fontSize: '64px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: '#FCD34D', // Gold
            marginBottom: '40px',
        },
        footer: {
            fontSize: '14px',
            opacity: 0.6,
        },
        adminLink: {
            color: 'rgba(255,255,255,0.1)',
            textDecoration: 'none',
            marginTop: '100px',
            fontSize: '12px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.logo}>Sanibare Hatiya</div>
            <p style={styles.message}>
                Hamro pasal kewal Sanibare matra khulcha. <br />
                Our shop opens only on Saturdays. Please come back then!
            </p>

            <div>
                <div style={styles.timerTitle}>Opening In</div>
                <div style={styles.timer}>{timeLeft}</div>
            </div>

            <div style={styles.footer}>
                See you on Saturday!
            </div>

            <a href="/admin/dashboard" style={styles.adminLink}>Admin Access</a>
        </div>
    );
};

export default SaturdayGuard;

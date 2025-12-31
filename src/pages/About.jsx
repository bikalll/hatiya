import React from 'react';

const About = () => {
    const styles = {
        page: {
            backgroundColor: '#FAFAFA',
        },
        header: {
            backgroundColor: '#065F46',
            padding: '60px',
            textAlign: 'center',
        },
        headerTitle: {
            fontSize: '32px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '12px',
        },
        headerSubtitle: {
            fontSize: '15px',
            color: '#A7F3D0',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6',
        },

        section: {
            padding: '80px 60px',
        },
        sectionWhite: {
            backgroundColor: 'white',
        },

        storyGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            maxWidth: '1100px',
            margin: '0 auto',
            alignItems: 'center',
        },
        storyImage: {
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
        },
        storyContent: {},
        sectionTag: {
            color: '#059669',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
        },
        sectionTitle: {
            fontSize: '28px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px',
            lineHeight: '1.3',
        },
        sectionText: {
            fontSize: '15px',
            color: '#6B7280',
            lineHeight: '1.8',
            marginBottom: '16px',
        },

        valuesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            maxWidth: '1000px',
            margin: '0 auto',
        },
        valueCard: {
            textAlign: 'center',
            padding: '32px 24px',
        },
        valueIcon: {
            width: '56px',
            height: '56px',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        valueTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
        },
        valueDesc: {
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.6',
        },

        statsSection: {
            backgroundColor: '#065F46',
            padding: '60px',
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
        },
        statNumber: {
            fontSize: '40px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '8px',
        },
        statLabel: {
            fontSize: '14px',
            color: '#A7F3D0',
        },

        teamGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            maxWidth: '1100px',
            margin: '0 auto',
        },
        teamCard: {
            textAlign: 'center',
        },
        teamImage: {
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '0 auto 16px',
        },
        teamName: {
            fontSize: '15px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px',
        },
        teamRole: {
            fontSize: '13px',
            color: '#059669',
        },
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>Our Story</h1>
                <p style={styles.headerSubtitle}>
                    Connecting the world to Nepal's rich cultural heritage through
                    authentic handcrafted products.
                </p>
            </header>

            {/* Story Section */}
            <section style={{ ...styles.section, ...styles.sectionWhite }}>
                <div style={styles.storyGrid}>
                    <img
                        src="https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?w=600&h=500&fit=crop"
                        alt="Nepali Artisan"
                        style={styles.storyImage}
                    />
                    <div style={styles.storyContent}>
                        <div style={styles.sectionTag}>Our Beginning</div>
                        <h2 style={styles.sectionTitle}>From the Heart of the Himalayas</h2>
                        <p style={styles.sectionText}>
                            Himalayan was founded with a simple mission: to share Nepal's
                            incredible artisan traditions with the world while ensuring
                            fair compensation for the craftspeople behind each creation.
                        </p>
                        <p style={styles.sectionText}>
                            We work directly with over 100 artisan families across Nepal,
                            from the ancient cities of Kathmandu Valley to remote villages
                            in the Himalayan foothills.
                        </p>
                        <p style={styles.sectionText}>
                            Each product in our collection represents generations of knowledge,
                            skill, and cultural heritage passed down through families.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section style={styles.section}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={styles.sectionTag}>What We Stand For</div>
                    <h2 style={styles.sectionTitle}>Our Values</h2>
                </div>
                <div style={styles.valuesGrid}>
                    <div style={styles.valueCard}>
                        <div style={styles.valueIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 style={styles.valueTitle}>Authenticity</h3>
                        <p style={styles.valueDesc}>
                            Every product is 100% authentic, handcrafted using traditional
                            methods by skilled artisans.
                        </p>
                    </div>
                    <div style={styles.valueCard}>
                        <div style={styles.valueIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h3 style={styles.valueTitle}>Fair Trade</h3>
                        <p style={styles.valueDesc}>
                            Our artisans receive 60% of the product value, ensuring
                            sustainable livelihoods for their families.
                        </p>
                    </div>
                    <div style={styles.valueCard}>
                        <div style={styles.valueIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h3 style={styles.valueTitle}>Sustainability</h3>
                        <p style={styles.valueDesc}>
                            From eco-friendly materials to minimal packaging, we protect
                            Nepal's environment.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={styles.statsSection}>
                <div style={styles.statsGrid}>
                    <div>
                        <div style={styles.statNumber}>100+</div>
                        <div style={styles.statLabel}>Artisan Families</div>
                    </div>
                    <div>
                        <div style={styles.statNumber}>500+</div>
                        <div style={styles.statLabel}>Products</div>
                    </div>
                    <div>
                        <div style={styles.statNumber}>15K+</div>
                        <div style={styles.statLabel}>Happy Customers</div>
                    </div>
                    <div>
                        <div style={styles.statNumber}>50+</div>
                        <div style={styles.statLabel}>Countries</div>
                    </div>
                </div>
            </section>

            {/* Team Section Removed */}
        </div>
    );
};

export default About;

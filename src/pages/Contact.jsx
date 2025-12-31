import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Contact = () => {
    const [faqs, setFaqs] = useState([]);
    const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('created_at');

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setIsLoadingFaqs(false);
        }
    };

    const [formData, setFormData] = useState({
        name: '',

        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message!');
    };

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
        },

        section: {
            padding: '80px 60px',
            backgroundColor: 'white',
        },
        contactGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '60px',
            maxWidth: '1000px',
            margin: '0 auto',
        },

        infoSection: {},
        sectionTag: {
            color: '#059669',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '16px',
        },
        sectionText: {
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.7',
            marginBottom: '32px',
        },
        contactCards: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        },
        contactCard: {
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
        },
        cardIcon: {
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: '#D1FAE5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        cardContent: {},
        cardTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px',
        },
        cardValue: {
            fontSize: '13px',
            color: '#6B7280',
        },

        formSection: {
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            padding: '32px',
        },
        formTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '24px',
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        },
        formGroupFull: {
            gridColumn: '1 / -1',
        },
        label: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
        },
        input: {
            padding: '12px 14px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
            backgroundColor: 'white',
        },
        textarea: {
            padding: '12px 14px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
            backgroundColor: 'white',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'inherit',
        },
        submitBtn: {
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            marginTop: '8px',
        },

        faqSection: {
            padding: '80px 60px',
            backgroundColor: '#FAFAFA',
        },
        faqGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto',
        },
        faqCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid #E5E7EB',
        },
        faqQuestion: {
            fontSize: '15px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
        },
        faqAnswer: {
            fontSize: '14px',
            color: '#6B7280',
            lineHeight: '1.6',
        },
    };

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>Contact Us</h1>
                <p style={styles.headerSubtitle}>
                    Have questions? We'd love to hear from you.
                </p>
            </header>

            <section style={styles.section}>
                <div style={styles.contactGrid}>
                    <div style={styles.infoSection}>
                        <div style={styles.sectionTag}>Get in Touch</div>
                        <h2 style={styles.sectionTitle}>We're Here to Help</h2>
                        <p style={styles.sectionText}>
                            Whether you have questions about products, orders, or our artisans,
                            our team is ready to assist you.
                        </p>

                        {/* Contact info cards removed as requested */}

                    </div>

                    <div style={styles.formSection}>
                        <h3 style={styles.formTitle}>Send a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                                    <label style={styles.label}>Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        style={styles.input}
                                        required
                                    />
                                </div>
                                <div style={{ ...styles.formGroup, ...styles.formGroupFull }}>
                                    <label style={styles.label}>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message..."
                                        style={styles.textarea}
                                        required
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <button type="submit" style={styles.submitBtn}>Send Message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section style={styles.faqSection}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={styles.sectionTag}>FAQ</div>
                    <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
                </div>
                <div style={styles.faqGrid}>
                    {isLoadingFaqs ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>Loading FAQs...</div>
                    ) : faqs.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center' }}>No FAQs available.</div>
                    ) : (
                        faqs.map(faq => (
                            <div key={faq.id} style={styles.faqCard}>
                                <div style={styles.faqQuestion}>{faq.question}</div>
                                <div style={styles.faqAnswer}>{faq.answer}</div>
                            </div>
                        ))
                    )}
                </div>

            </section>
        </div>
    );
};

export default Contact;

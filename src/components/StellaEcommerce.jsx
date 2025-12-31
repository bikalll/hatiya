import React, { useState } from 'react';

/**
 * FreshMart Grocery Store Component
 * Refactored from Stella e-commerce for grocery shopping
 */

// SVG Icons as components
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);

const CartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const HeartIcon = ({ filled = false }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "#9CA3AF"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
        <polyline points="6,9 12,15 18,9" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
        <polyline points="6,15 12,9 18,15" />
    </svg>
);

const GridViewIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#6B7280">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
    </svg>
);

const ListViewIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#9CA3AF">
        <rect x="3" y="4" width="18" height="4" />
        <rect x="3" y="10" width="18" height="4" />
        <rect x="3" y="16" width="18" height="4" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
);

const TruckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const LeafIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);

const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

// Category Icons
const FruitsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444">
        <circle cx="12" cy="14" r="8" />
        <path d="M12 2C10 2 9 4 9 6" fill="none" stroke="#22C55E" strokeWidth="2" />
        <ellipse cx="14" cy="5" rx="3" ry="2" fill="#22C55E" />
    </svg>
);

const VegetablesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#22C55E">
        <path d="M12 2C8 2 4 8 4 14c0 4 3 8 8 8s8-4 8-8c0-6-4-12-8-12z" />
        <path d="M12 2v6" fill="none" stroke="#15803D" strokeWidth="2" />
    </svg>
);

const DairyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24">
        <rect x="6" y="4" width="12" height="16" rx="2" fill="#F5F5DC" stroke="#E5E7EB" strokeWidth="1" />
        <rect x="8" y="8" width="8" height="6" fill="#3B82F6" />
    </svg>
);

const BakeryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#D97706">
        <ellipse cx="12" cy="14" rx="10" ry="6" />
        <path d="M4 10c0-4 3.5-8 8-8s8 4 8 8" fill="#F59E0B" />
    </svg>
);

const MeatIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626">
        <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8-8-4-8-8z" />
        <circle cx="12" cy="12" r="4" fill="#FCA5A5" />
    </svg>
);

const BeveragesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0EA5E9">
        <path d="M6 4h12l-1 16H7L6 4z" />
        <rect x="5" y="2" width="14" height="3" rx="1" fill="#374151" />
    </svg>
);

// Styles object
const styles = {
    container: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#F0FDF4',
        minHeight: '100vh',
        width: '100%',
    },

    // Top Header Bar
    topHeader: {
        backgroundColor: '#166534',
        padding: '8px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'white',
    },
    topHeaderLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    topHeaderRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    },
    topHeaderItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
    },

    // Navigation
    navigation: {
        backgroundColor: 'white',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    logo: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#16A34A',
        letterSpacing: '-1px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    logoIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#16A34A',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: '25px',
        padding: '12px 20px',
        width: '400px',
        gap: '10px',
        border: '2px solid transparent',
        transition: 'border-color 0.2s',
    },
    searchInput: {
        border: 'none',
        backgroundColor: 'transparent',
        outline: 'none',
        fontSize: '14px',
        color: '#6B7280',
        width: '100%',
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    },
    cartBadge: {
        position: 'relative',
        cursor: 'pointer',
    },
    badge: {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        backgroundColor: '#16A34A',
        color: 'white',
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 7px',
        borderRadius: '12px',
        minWidth: '20px',
        textAlign: 'center',
    },
    languageSelector: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#374151',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingLeft: '20px',
        borderLeft: '1px solid #E5E7EB',
    },
    userAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#DCFCE7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#16A34A',
    },
    userName: {
        fontSize: '13px',
    },
    userNameLabel: {
        color: '#9CA3AF',
        fontSize: '11px',
    },
    userNameValue: {
        color: '#1F2937',
        fontWeight: '600',
    },

    // Hero Section
    heroSection: {
        background: 'linear-gradient(135deg, #166534 0%, #22C55E 50%, #4ADE80 100%)',
        height: '400px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '0 60px',
    },
    heroContent: {
        zIndex: 2,
        maxWidth: '500px',
    },
    heroTitle: {
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: '56px',
        fontWeight: '700',
        color: 'white',
        lineHeight: '1.1',
        marginBottom: '16px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    heroSubtitle: {
        fontSize: '18px',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '24px',
        lineHeight: '1.5',
    },
    heroButton: {
        backgroundColor: 'white',
        color: '#16A34A',
        padding: '14px 32px',
        borderRadius: '30px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    heroImageContainer: {
        position: 'absolute',
        right: '40px',
        bottom: '0',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
    },
    scrollButton: {
        position: 'absolute',
        right: '40px',
        bottom: '24px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(4px)',
    },

    // Product Section
    productSection: {
        padding: '32px 40px',
        backgroundColor: 'white',
    },
    breadcrumb: {
        fontSize: '13px',
        marginBottom: '4px',
    },
    breadcrumbLink: {
        color: '#16A34A',
        textDecoration: 'none',
    },
    breadcrumbSeparator: {
        color: '#9CA3AF',
        margin: '0 6px',
    },
    breadcrumbCurrent: {
        color: '#6B7280',
    },
    resultsTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: '24px',
    },
    productLayout: {
        display: 'flex',
        gap: '32px',
    },

    // Filter Sidebar
    filterSidebar: {
        width: '260px',
        flexShrink: 0,
    },
    filterHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    filterTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1F2937',
    },
    advancedLink: {
        color: '#16A34A',
        fontSize: '13px',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    filterSection: {
        marginBottom: '28px',
    },
    filterSectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        cursor: 'pointer',
    },
    filterSectionTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1F2937',
    },
    categorySearch: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '10px 12px',
        marginBottom: '14px',
        gap: '8px',
    },
    categorySearchInput: {
        border: 'none',
        backgroundColor: 'transparent',
        outline: 'none',
        fontSize: '13px',
        color: '#6B7280',
        width: '100%',
    },
    categoryItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 0',
        cursor: 'pointer',
    },
    checkbox: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
        border: '2px solid #D1D5DB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    checkboxChecked: {
        backgroundColor: '#16A34A',
        borderColor: '#16A34A',
    },
    checkmark: {
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    categoryName: {
        fontSize: '14px',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    categoryCount: {
        fontSize: '12px',
        color: '#9CA3AF',
        marginLeft: 'auto',
    },

    // Price Range
    priceRange: {
        marginTop: '10px',
    },
    rangeSlider: {
        position: 'relative',
        height: '44px',
        marginBottom: '10px',
    },
    rangeTrack: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%',
        height: '6px',
        backgroundColor: '#E5E7EB',
        borderRadius: '3px',
    },
    rangeTrackActive: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: '5%',
        width: '60%',
        height: '6px',
        backgroundColor: '#16A34A',
        borderRadius: '3px',
    },
    rangeThumb: {
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '18px',
        height: '18px',
        backgroundColor: 'white',
        border: '3px solid #16A34A',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    rangeLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#9CA3AF',
        marginBottom: '10px',
    },
    priceInputs: {
        display: 'flex',
        gap: '14px',
    },
    priceInput: {
        flex: 1,
        padding: '10px 12px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#374151',
        textAlign: 'center',
    },

    // Dietary preferences
    dietaryGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
    },
    dietaryButton: {
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        border: '1px solid #E5E7EB',
        borderRadius: '20px',
        cursor: 'pointer',
        backgroundColor: 'white',
        color: '#374151',
    },
    dietaryButtonActive: {
        backgroundColor: '#DCFCE7',
        color: '#16A34A',
        borderColor: '#16A34A',
    },

    // Product Grid
    productGrid: {
        flex: 1,
    },
    gridControls: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    viewButtons: {
        display: 'flex',
        gap: '6px',
    },
    viewButton: {
        padding: '10px',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: 'white',
    },
    viewButtonActive: {
        backgroundColor: '#F0FDF4',
        borderColor: '#16A34A',
    },
    sortBy: {
        fontSize: '14px',
        color: '#6B7280',
    },
    sortByLabel: {
        marginRight: '6px',
    },
    sortByValue: {
        fontWeight: '600',
        color: '#1F2937',
    },

    // Product Cards Grid
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #E5E7EB',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productImageContainer: {
        position: 'relative',
        backgroundColor: '#F9FAFB',
        height: '180px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
    freshBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: '#16A34A',
        color: 'white',
        fontSize: '10px',
        fontWeight: '600',
        padding: '5px 10px',
        borderRadius: '15px',
    },
    organicBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: '#22C55E',
        color: 'white',
        fontSize: '10px',
        fontWeight: '600',
        padding: '5px 10px',
        borderRadius: '15px',
    },
    saleBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: '#EF4444',
        color: 'white',
        fontSize: '10px',
        fontWeight: '600',
        padding: '5px 10px',
        borderRadius: '15px',
    },
    favoriteButton: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: 'white',
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: 'none',
    },
    productInfo: {
        padding: '16px',
    },
    productCategory: {
        fontSize: '11px',
        color: '#16A34A',
        marginBottom: '4px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    productName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: '6px',
    },
    productWeight: {
        fontSize: '12px',
        color: '#9CA3AF',
        marginBottom: '10px',
    },
    productPriceRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#16A34A',
    },
    originalPrice: {
        fontSize: '13px',
        color: '#9CA3AF',
        textDecoration: 'line-through',
        marginLeft: '8px',
    },
    addToCartButton: {
        backgroundColor: '#16A34A',
        color: 'white',
        border: 'none',
        padding: '8px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    stockInfo: {
        fontSize: '11px',
        color: '#F59E0B',
        marginTop: '8px',
    },
};

// Mock product data for grocery store
const products = [
    { id: 1, category: 'Fruits', name: 'Fresh Organic Apples', weight: '1 kg', price: '$4.99', originalPrice: '$6.99', stock: 'Only 5 left!', badge: 'organic', image: 'apple' },
    { id: 2, category: 'Vegetables', name: 'Baby Spinach', weight: '250g', price: '$3.49', originalPrice: null, stock: null, badge: 'fresh', image: 'spinach' },
    { id: 3, category: 'Dairy', name: 'Organic Whole Milk', weight: '1 Liter', price: '$5.29', originalPrice: null, stock: null, badge: 'organic', image: 'milk' },
    { id: 4, category: 'Bakery', name: 'Whole Wheat Bread', weight: '500g', price: '$3.99', originalPrice: '$4.99', stock: null, badge: 'sale', image: 'bread' },
    { id: 5, category: 'Fruits', name: 'Fresh Strawberries', weight: '400g', price: '$6.99', originalPrice: null, stock: 'Selling fast!', badge: 'fresh', image: 'strawberry' },
    { id: 6, category: 'Vegetables', name: 'Organic Carrots', weight: '1 kg', price: '$2.99', originalPrice: null, stock: null, badge: 'organic', image: 'carrot' },
    { id: 7, category: 'Meat', name: 'Chicken Breast', weight: '500g', price: '$8.99', originalPrice: '$10.99', stock: null, badge: 'sale', image: 'chicken' },
    { id: 8, category: 'Beverages', name: 'Fresh Orange Juice', weight: '1 Liter', price: '$4.49', originalPrice: null, stock: null, badge: 'fresh', image: 'juice' },
    { id: 9, category: 'Fruits', name: 'Ripe Bananas', weight: '1 kg', price: '$2.49', originalPrice: null, stock: null, badge: 'fresh', image: 'banana' },
    { id: 10, category: 'Dairy', name: 'Greek Yogurt', weight: '500g', price: '$4.99', originalPrice: null, stock: 'Low stock', badge: 'fresh', image: 'yogurt' },
    { id: 11, category: 'Vegetables', name: 'Fresh Broccoli', weight: '500g', price: '$3.29', originalPrice: null, stock: null, badge: 'organic', image: 'broccoli' },
    { id: 12, category: 'Bakery', name: 'Croissants (4 pack)', weight: '280g', price: '$5.99', originalPrice: null, stock: null, badge: 'fresh', image: 'croissant' },
];

// Category data
const categories = [
    { name: 'Fruits & Vegetables', count: 245, icon: FruitsIcon, checked: true },
    { name: 'Dairy & Eggs', count: 128, icon: DairyIcon, checked: false },
    { name: 'Bakery', count: 89, icon: BakeryIcon, checked: false },
    { name: 'Meat & Seafood', count: 156, icon: MeatIcon, checked: false },
    { name: 'Beverages', count: 203, icon: BeveragesIcon, checked: false },
];

const dietaryOptions = ['Organic', 'Gluten-Free', 'Vegan', 'Sugar-Free', 'Keto', 'Low Fat'];

// Product Image Placeholders
const ProductImagePlaceholder = ({ type }) => {
    const productColors = {
        'apple': { bg: '#FEE2E2', main: '#EF4444', accent: '#22C55E' },
        'spinach': { bg: '#DCFCE7', main: '#22C55E', accent: '#15803D' },
        'milk': { bg: '#F0F9FF', main: '#FFFFFF', accent: '#3B82F6' },
        'bread': { bg: '#FEF3C7', main: '#D97706', accent: '#92400E' },
        'strawberry': { bg: '#FEE2E2', main: '#EF4444', accent: '#22C55E' },
        'carrot': { bg: '#FFEDD5', main: '#EA580C', accent: '#22C55E' },
        'chicken': { bg: '#FEF3C7', main: '#FBBF24', accent: '#DC2626' },
        'juice': { bg: '#FFEDD5', main: '#F97316', accent: '#FACC15' },
        'banana': { bg: '#FEF9C3', main: '#FACC15', accent: '#65A30D' },
        'yogurt': { bg: '#F0F9FF', main: '#FFFFFF', accent: '#60A5FA' },
        'broccoli': { bg: '#DCFCE7', main: '#22C55E', accent: '#15803D' },
        'croissant': { bg: '#FEF3C7', main: '#D97706', accent: '#92400E' },
    };

    const colors = productColors[type] || { bg: '#F3F4F6', main: '#9CA3AF', accent: '#6B7280' };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
        }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
                {type === 'apple' && (
                    <>
                        <circle cx="40" cy="45" r="28" fill={colors.main} />
                        <path d="M40 17 Q35 10 40 5" stroke={colors.accent} strokeWidth="4" fill="none" />
                        <ellipse cx="50" cy="12" rx="8" ry="5" fill={colors.accent} />
                    </>
                )}
                {type === 'spinach' && (
                    <>
                        <ellipse cx="40" cy="45" rx="30" ry="22" fill={colors.main} />
                        <path d="M25 35 Q40 20 55 35" stroke={colors.accent} strokeWidth="3" fill="none" />
                        <path d="M30 50 Q40 38 50 50" stroke={colors.accent} strokeWidth="3" fill="none" />
                    </>
                )}
                {type === 'milk' && (
                    <>
                        <rect x="20" y="20" width="40" height="50" rx="5" fill={colors.main} stroke="#E5E7EB" strokeWidth="2" />
                        <rect x="25" y="30" width="30" height="20" fill={colors.accent} rx="3" />
                        <rect x="30" y="10" width="20" height="12" rx="3" fill="#E5E7EB" />
                    </>
                )}
                {type === 'bread' && (
                    <>
                        <ellipse cx="40" cy="50" rx="32" ry="18" fill={colors.main} />
                        <path d="M12 40 Q40 15 68 40" fill={colors.accent} />
                    </>
                )}
                {type === 'strawberry' && (
                    <>
                        <path d="M40 20 L55 55 Q40 75 25 55 Z" fill={colors.main} />
                        <ellipse cx="40" cy="18" rx="12" ry="6" fill={colors.accent} />
                        <circle cx="35" cy="40" r="2" fill="#FEE2E2" />
                        <circle cx="45" cy="45" r="2" fill="#FEE2E2" />
                        <circle cx="38" cy="55" r="2" fill="#FEE2E2" />
                    </>
                )}
                {type === 'carrot' && (
                    <>
                        <path d="M25 25 L55 70 L40 70 Z" fill={colors.main} />
                        <ellipse cx="30" cy="22" rx="15" ry="8" fill={colors.accent} />
                    </>
                )}
                {type === 'chicken' && (
                    <>
                        <ellipse cx="40" cy="45" rx="28" ry="22" fill={colors.main} />
                        <ellipse cx="40" cy="45" rx="18" ry="14" fill="#FFFBEB" />
                    </>
                )}
                {type === 'juice' && (
                    <>
                        <path d="M25 25 L30 70 L50 70 L55 25 Z" fill={colors.main} />
                        <rect x="22" y="15" width="36" height="12" rx="3" fill="#374151" />
                        <circle cx="40" cy="50" r="10" fill={colors.accent} />
                    </>
                )}
                {type === 'banana' && (
                    <>
                        <path d="M20 55 Q25 30 50 25 Q70 30 65 45 Q55 60 30 60 Z" fill={colors.main} />
                        <path d="M48 22 Q55 18 52 25" stroke={colors.accent} strokeWidth="3" fill="none" />
                    </>
                )}
                {type === 'yogurt' && (
                    <>
                        <rect x="18" y="30" width="44" height="40" rx="8" fill={colors.main} stroke="#E5E7EB" strokeWidth="2" />
                        <ellipse cx="40" cy="30" rx="22" ry="8" fill="#E5E7EB" />
                        <circle cx="40" cy="50" r="12" fill={colors.accent} />
                    </>
                )}
                {type === 'broccoli' && (
                    <>
                        <circle cx="30" cy="30" r="12" fill={colors.main} />
                        <circle cx="45" cy="25" r="14" fill={colors.main} />
                        <circle cx="55" cy="35" r="10" fill={colors.main} />
                        <rect x="38" y="45" width="8" height="25" fill={colors.accent} />
                    </>
                )}
                {type === 'croissant' && (
                    <>
                        <path d="M15 50 Q25 25 45 30 Q65 35 70 50 Q60 55 40 52 Q20 55 15 50 Z" fill={colors.main} />
                        <path d="M20 48 Q35 35 55 48" stroke={colors.accent} strokeWidth="2" fill="none" />
                    </>
                )}
            </svg>
        </div>
    );
};

const GroceryStore = () => {
    const [selectedDietary, setSelectedDietary] = useState(['Organic']);
    const [categoryFilters, setCategoryFilters] = useState(categories);

    const toggleDietary = (option) => {
        setSelectedDietary(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    const toggleCategory = (index) => {
        setCategoryFilters(prev => prev.map((cat, i) =>
            i === index ? { ...cat, checked: !cat.checked } : cat
        ));
    };

    const getBadgeStyle = (badge) => {
        switch (badge) {
            case 'organic': return styles.organicBadge;
            case 'sale': return styles.saleBadge;
            default: return styles.freshBadge;
        }
    };

    const getBadgeText = (badge) => {
        switch (badge) {
            case 'organic': return '🌿 Organic';
            case 'sale': return '🔥 Sale';
            default: return '✨ Fresh';
        }
    };

    return (
        <div style={styles.container}>
            {/* Top Header Bar */}
            <div style={styles.topHeader}>
                <div style={styles.topHeaderLeft}>
                    <span>📍</span>
                    <span>Deliver to</span>
                    <span style={{ fontWeight: '600' }}>New York, NY 10001</span>
                </div>
                <div style={styles.topHeaderRight}>
                    <div style={styles.topHeaderItem}>
                        <TruckIcon />
                        <span>Free Delivery over $50</span>
                    </div>
                    <div style={styles.topHeaderItem}>
                        <ClockIcon />
                        <span>Same Day Delivery</span>
                    </div>
                    <div style={styles.topHeaderItem}>
                        <LeafIcon />
                        <span>100% Fresh Guarantee</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div style={styles.navigation}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>
                        <span style={{ fontSize: '24px' }}>🥬</span>
                    </div>
                    FreshMart
                </div>

                <div style={styles.searchBar}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search for groceries, fruits, vegetables..."
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.navRight}>
                    <div style={styles.cartBadge}>
                        <CartIcon />
                        <span style={styles.badge}>12</span>
                    </div>

                    <HeartIcon />

                    <div style={styles.languageSelector}>
                        <span>🇺🇸</span>
                        <span>English</span>
                        <ChevronDownIcon />
                    </div>

                    <div style={styles.userSection}>
                        <div style={styles.userAvatar}>👤</div>
                        <div style={styles.userName}>
                            <div style={styles.userNameLabel}>Welcome back!</div>
                            <div style={styles.userNameValue}>Sarah Johnson</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>
                        Fresh & Healthy<br />Every Day
                    </h1>
                    <p style={styles.heroSubtitle}>
                        Get farm-fresh groceries delivered to your doorstep.
                        100% organic produce, dairy, and more!
                    </p>
                    <button style={styles.heroButton}>
                        Shop Fresh Deals 🛒
                    </button>
                </div>

                <div style={styles.heroImageContainer}>
                    <svg width="450" height="380" viewBox="0 0 450 380">
                        {/* Basket */}
                        <ellipse cx="225" cy="320" rx="180" ry="40" fill="#92400E" />
                        <path d="M60 280 L80 320 L370 320 L390 280 Z" fill="#D97706" />
                        <path d="M80 280 L60 160 Q225 120 390 160 L370 280 Z" fill="#F59E0B" />
                        {/* Handle */}
                        <path d="M120 160 Q225 60 330 160" stroke="#92400E" strokeWidth="12" fill="none" />
                        {/* Fruits and veggies in basket */}
                        <circle cx="150" cy="220" r="40" fill="#EF4444" /> {/* Apple */}
                        <circle cx="230" cy="200" r="35" fill="#22C55E" /> {/* Lettuce */}
                        <ellipse cx="300" cy="230" rx="45" ry="30" fill="#FACC15" /> {/* Banana */}
                        <circle cx="180" cy="260" r="30" fill="#F97316" /> {/* Orange */}
                        <ellipse cx="270" cy="270" rx="25" ry="35" fill="#8B5CF6" /> {/* Eggplant */}
                        <circle cx="340" cy="250" r="25" fill="#EF4444" /> {/* Tomato */}
                        {/* Leaves on apple */}
                        <ellipse cx="155" cy="178" rx="8" ry="4" fill="#22C55E" />
                    </svg>
                </div>

                <div style={styles.scrollButton}>
                    <ArrowDownIcon />
                </div>
            </div>

            {/* Product Section */}
            <div style={styles.productSection}>
                {/* Breadcrumb */}
                <div style={styles.breadcrumb}>
                    <a href="#" style={styles.breadcrumbLink}>Home</a>
                    <span style={styles.breadcrumbSeparator}>&gt;</span>
                    <span style={styles.breadcrumbCurrent}>All Groceries</span>
                </div>

                <h2 style={styles.resultsTitle}>🛒 156 Fresh Products Available</h2>

                <div style={styles.productLayout}>
                    {/* Filter Sidebar */}
                    <div style={styles.filterSidebar}>
                        <div style={styles.filterHeader}>
                            <div style={styles.filterTitle}>
                                <FilterIcon />
                                Filters
                            </div>
                            <a href="#" style={styles.advancedLink}>Clear All</a>
                        </div>

                        {/* Category Filter */}
                        <div style={styles.filterSection}>
                            <div style={styles.filterSectionHeader}>
                                <span style={styles.filterSectionTitle}>Categories</span>
                                <ChevronUpIcon />
                            </div>

                            <div style={styles.categorySearch}>
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    style={styles.categorySearchInput}
                                />
                            </div>

                            {categoryFilters.map((category, index) => (
                                <div
                                    key={category.name}
                                    style={styles.categoryItem}
                                    onClick={() => toggleCategory(index)}
                                >
                                    <div style={{
                                        ...styles.checkbox,
                                        ...(category.checked ? styles.checkboxChecked : {})
                                    }}>
                                        {category.checked && <span style={styles.checkmark}>✓</span>}
                                    </div>
                                    <category.icon />
                                    <span style={styles.categoryName}>
                                        {category.name}
                                    </span>
                                    <span style={styles.categoryCount}>{category.count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price Filter */}
                        <div style={styles.filterSection}>
                            <div style={styles.filterSectionHeader}>
                                <span style={styles.filterSectionTitle}>Price Range</span>
                                <ChevronUpIcon />
                            </div>

                            <div style={styles.priceRange}>
                                <div style={styles.rangeSlider}>
                                    <div style={styles.rangeTrack}></div>
                                    <div style={styles.rangeTrackActive}></div>
                                    <div style={{ ...styles.rangeThumb, left: '5%' }}></div>
                                    <div style={{ ...styles.rangeThumb, left: '65%' }}></div>
                                </div>

                                <div style={styles.rangeLabels}>
                                    <span>$0</span>
                                    <span>$100+</span>
                                </div>

                                <div style={styles.priceInputs}>
                                    <input type="text" value="$0.00" style={styles.priceInput} readOnly />
                                    <input type="text" value="$50.00" style={styles.priceInput} readOnly />
                                </div>
                            </div>
                        </div>

                        {/* Dietary Preferences */}
                        <div style={styles.filterSection}>
                            <div style={styles.filterSectionHeader}>
                                <span style={styles.filterSectionTitle}>Dietary Preferences</span>
                                <ChevronUpIcon />
                            </div>

                            <div style={styles.dietaryGrid}>
                                {dietaryOptions.map(option => (
                                    <button
                                        key={option}
                                        style={{
                                            ...styles.dietaryButton,
                                            ...(selectedDietary.includes(option) ? styles.dietaryButtonActive : {})
                                        }}
                                        onClick={() => toggleDietary(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div style={styles.productGrid}>
                        <div style={styles.gridControls}>
                            <div style={styles.viewButtons}>
                                <button style={{ ...styles.viewButton, ...styles.viewButtonActive }}>
                                    <GridViewIcon />
                                </button>
                                <button style={styles.viewButton}>
                                    <ListViewIcon />
                                </button>
                            </div>

                            <div style={styles.sortBy}>
                                <span style={styles.sortByLabel}>Sort by:</span>
                                <span style={styles.sortByValue}>Freshness</span>
                            </div>
                        </div>

                        <div style={styles.productsGrid}>
                            {products.map(product => (
                                <div key={product.id} style={styles.productCard}>
                                    <div style={styles.productImageContainer}>
                                        <ProductImagePlaceholder type={product.image} />
                                        <span style={getBadgeStyle(product.badge)}>
                                            {getBadgeText(product.badge)}
                                        </span>
                                        <button style={styles.favoriteButton}>
                                            <HeartIcon />
                                        </button>
                                    </div>
                                    <div style={styles.productInfo}>
                                        <div style={styles.productCategory}>{product.category}</div>
                                        <div style={styles.productName}>{product.name}</div>
                                        <div style={styles.productWeight}>{product.weight}</div>
                                        <div style={styles.productPriceRow}>
                                            <div>
                                                <span style={styles.productPrice}>{product.price}</span>
                                                {product.originalPrice && (
                                                    <span style={styles.originalPrice}>{product.originalPrice}</span>
                                                )}
                                            </div>
                                            <button style={styles.addToCartButton}>
                                                + Add
                                            </button>
                                        </div>
                                        {product.stock && (
                                            <div style={styles.stockInfo}>⚡ {product.stock}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroceryStore;

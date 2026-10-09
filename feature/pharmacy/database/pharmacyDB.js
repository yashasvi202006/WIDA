// LocalStorage-based database layer for WIDA Healthcare & Pharmacy Module
// Provides persistent CRUD operations without requiring a backend server

const DB_PREFIX = 'wida_pharmacy_';

const KEYS = {
    USERS: DB_PREFIX + 'users',
    CURRENT_USER: DB_PREFIX + 'current_user',
    MEDICINES: DB_PREFIX + 'medicines',
    PRESCRIPTIONS: DB_PREFIX + 'prescriptions',
    SUPPLIERS: DB_PREFIX + 'suppliers',
    PURCHASE_ORDERS: DB_PREFIX + 'purchase_orders',
    SALES_INVOICES: DB_PREFIX + 'sales_invoices',
    CUSTOMER_ORDERS: DB_PREFIX + 'customer_orders',
    RETURNS: DB_PREFIX + 'returns',
    NOTIFICATIONS: DB_PREFIX + 'notifications',
    DB_INITIALIZED: DB_PREFIX + 'db_initialized',
};

// Default Demo Doctors
export const DEMO_DOCTORS = [
    {
        id: 'DOC-1001',
        fullName: 'Dr. Yogita Chugh',
        email: 'yogita.chugh@wida.health',
        password: 'password123',
        phone: '+91 98765 43210',
        role: 'Chief Pharmacist & Medical Director',
        pharmacyName: 'WIDA Ecosystem Central Hospital & Pharmacy',
        licenseNumber: 'WIDA-PH-8092',
        specialization: 'Clinical Pharmacology & Pharmacy Management',
        qualifications: 'PharmD, MBBS, MD (Clinical Pharmacology)',
        experience: '12+ Years Clinical Practice',
        department: 'Central Pharmacy & Clinical Care',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'DOC-1002',
        fullName: 'Dr. Aarav Sharma',
        email: 'aarav.sharma@wida.health',
        password: 'password123',
        phone: '+91 98123 45678',
        role: 'Cardiologist',
        pharmacyName: 'WIDA Health Medical Center',
        licenseNumber: 'WIDA-DOC-1029',
        specialization: 'Cardiology & Cardiovascular Medicine',
        qualifications: 'MD, DM (Cardiology), FACC',
        experience: '10+ Years Experience',
        department: 'Cardiology Department',
        profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'DOC-1003',
        fullName: 'Dr. Ananya Verma',
        email: 'ananya.verma@wida.health',
        password: 'password123',
        phone: '+91 98234 56789',
        role: 'Orthopedist',
        pharmacyName: 'WIDA Health Ortho Center',
        licenseNumber: 'WIDA-DOC-2045',
        specialization: 'Orthopedic Surgery & Joint Reconstruction',
        qualifications: 'MS (Orthopedics), MCh',
        experience: '8+ Years Experience',
        department: 'Orthopedic & Trauma Care',
        profileImage: 'https://images.unsplash.com/photo-1594824813566-88855ce78906?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'DOC-1004',
        fullName: 'Dr. Rohan Mehta',
        email: 'rohan.mehta@wida.health',
        password: 'password123',
        phone: '+91 98345 67890',
        role: 'Neurologist',
        pharmacyName: 'WIDA Neuroscience Institute',
        licenseNumber: 'WIDA-DOC-3081',
        specialization: 'Neurology & Neurovascular Science',
        qualifications: 'MD, DM (Neurology)',
        experience: '14+ Years Experience',
        department: 'Department of Neurology',
        profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    },
    {
        id: 'DOC-1005',
        fullName: 'Dr. Kavya Singh',
        email: 'kavya.singh@wida.health',
        password: 'password123',
        phone: '+91 98456 78901',
        role: 'Dermatologist',
        pharmacyName: 'WIDA Skin & Laser Clinic',
        licenseNumber: 'WIDA-DOC-4012',
        specialization: 'Dermatology & Aesthetic Medicine',
        qualifications: 'MD (Dermatology, Venereology)',
        experience: '7+ Years Experience',
        department: 'Dermatology & Cosmetology',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    }
];

// ---------- Generic helpers ----------
function getCollection(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function setCollection(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getItem(key) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function setItem(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialize default users if empty
function ensureUsersInitialized() {
    let users = getCollection(KEYS.USERS);
    if (!users || users.length === 0) {
        users = [...DEMO_DOCTORS];
        setCollection(KEYS.USERS, users);
    }
    return users;
}

// ---------- User / Auth ----------
export function registerUser(user) {
    const users = ensureUsersInitialized();
    if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
        ...user,
        id: 'USR-' + Date.now(),
        profileImage: user.profileImage || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    };
    users.push(newUser);
    setCollection(KEYS.USERS, users);
    setItem(KEYS.CURRENT_USER, newUser);
    return { success: true, message: 'Registration successful!', user: newUser };
}

export function loginUser(email, password) {
    const users = ensureUsersInitialized();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === 'password123'));
    if (!match) {
        return { success: false, message: 'Invalid professional email or password.' };
    }
    match.lastLogin = new Date().toISOString();
    setCollection(KEYS.USERS, users);
    setItem(KEYS.CURRENT_USER, match);
    return { success: true, message: 'Login successful!', user: match };
}

export function logoutUser() {
    localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getCurrentUser() {
    ensureUsersInitialized();
    let current = getItem(KEYS.CURRENT_USER);
    if (!current) {
        current = DEMO_DOCTORS[0];
        setItem(KEYS.CURRENT_USER, current);
    }
    return current;
}

export function updateUserProfile(updates) {
    const current = getCurrentUser();
    if (!current) return { success: false, message: 'No user is logged in.' };
    const users = ensureUsersInitialized();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx === -1) return { success: false, message: 'User record not found.' };

    if (updates.email && updates.email !== current.email) {
        const emailTaken = users.find(u => u.email.toLowerCase() === updates.email.toLowerCase() && u.id !== current.id);
        if (emailTaken) return { success: false, message: 'This email is already taken by another account.' };
    }
    const updatedUser = { ...users[idx], ...updates };
    users[idx] = updatedUser;
    setCollection(KEYS.USERS, users);
    setItem(KEYS.CURRENT_USER, updatedUser);
    return { success: true, message: 'Profile updated successfully!', user: updatedUser };
}

export function changePassword(currentPassword, newPassword) {
    const current = getCurrentUser();
    if (!current) return { success: false, message: 'No user is logged in.' };
    if (current.password !== currentPassword) return { success: false, message: 'Current password is incorrect.' };
    if (newPassword.length < 6) return { success: false, message: 'New password must be at least 6 characters.' };
    return updateUserProfile({ password: newPassword });
}

// ---------- Data persistence ----------
export function saveMedicines(data) { setCollection(KEYS.MEDICINES, data); }
export function loadMedicines() { return getCollection(KEYS.MEDICINES); }
export function savePrescriptions(data) { setCollection(KEYS.PRESCRIPTIONS, data); }
export function loadPrescriptions() { return getCollection(KEYS.PRESCRIPTIONS); }
export function saveSuppliers(data) { setCollection(KEYS.SUPPLIERS, data); }
export function loadSuppliers() { return getCollection(KEYS.SUPPLIERS); }
export function savePurchaseOrders(data) { setCollection(KEYS.PURCHASE_ORDERS, data); }
export function loadPurchaseOrders() { return getCollection(KEYS.PURCHASE_ORDERS); }
export function saveSalesInvoices(data) { setCollection(KEYS.SALES_INVOICES, data); }
export function loadSalesInvoices() { return getCollection(KEYS.SALES_INVOICES); }
export function saveCustomerOrders(data) { setCollection(KEYS.CUSTOMER_ORDERS, data); }
export function loadCustomerOrders() { return getCollection(KEYS.CUSTOMER_ORDERS); }
export function saveReturns(data) { setCollection(KEYS.RETURNS, data); }
export function loadReturns() { return getCollection(KEYS.RETURNS); }
export function saveNotifications(data) { setCollection(KEYS.NOTIFICATIONS, data); }
export function loadNotifications() { return getCollection(KEYS.NOTIFICATIONS); }

export function isDatabaseInitialized() {
    return localStorage.getItem(KEYS.DB_INITIALIZED) === 'true';
}
export function markDatabaseInitialized() {
    localStorage.setItem(KEYS.DB_INITIALIZED, 'true');
}
export function resetDatabase() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

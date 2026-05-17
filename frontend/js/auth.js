// Authentication Logic

// Demo credentials
const DEMO_USERS = {
    user: {
        email: 'user@valerianvault.com',
        password: 'user123'
    },
    admin: {
        email: 'admin@valerianvault.com',
        password: 'admin123'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAuthForm();
    checkExistingSession();
    // Initialize Google Sign-In
    if (window.GoogleAuth) {
        GoogleAuth.init();
    }
});

// Form Handler
function initAuthForm() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Validation Helpers
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Unified Login Handler
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    // Validation
    if (!email || !validateEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }

    if (!password || password.length < 3) {
        showToast('Password must be at least 3 characters');
        return;
    }

    // Check admin credentials first
    if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
        const session = {
            type: 'admin',
            email: email,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('valerianSession', JSON.stringify(session));
        showToast('Admin access granted! Redirecting...');
        setTimeout(() => window.location.href = 'admin.html', 1500);
        return;
    }

    // Check demo user credentials
    if (email === DEMO_USERS.user.email && password === DEMO_USERS.user.password) {
        const session = {
            type: 'user',
            email: email,
            loginTime: new Date().toISOString()
        };
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('valerianSession', JSON.stringify(session));
        showToast('Login successful! Redirecting...');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const session = {
            type: 'user',
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        };
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('valerianSession', JSON.stringify(session));
        showToast('Login successful! Redirecting...');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    showToast('Invalid email or password');
}

// Check Existing Session
function checkExistingSession() {
    const session = localStorage.getItem('valerianSession') || sessionStorage.getItem('valerianSession');
    
    if (session) {
        const sessionData = JSON.parse(session);
        window.location.href = sessionData.type === 'admin' ? 'admin.html' : 'index.html';
    }
}

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}

window.togglePassword = togglePassword;

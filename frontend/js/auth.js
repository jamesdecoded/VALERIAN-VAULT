// Authentication Logic

// Demo credentials (in production, use secure backend authentication)
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
    initAuthTabs();
    initAuthForms();
    checkExistingSession();
});

// Tab Switching
function initAuthTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update forms
            forms.forEach(form => {
                if (form.dataset.form === targetTab) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });
}

// Form Handlers
function initAuthForms() {
    // User Login
    document.getElementById('userLoginForm').addEventListener('submit', handleUserLogin);

    // Admin Login
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
}

// Validation Helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// User Login Handler
async function handleUserLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Form Validation
    if (!validateRequired(email)) {
        showToast('Please enter your email address');
        return;
    }

    if (!validateEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }

    if (!validateRequired(password)) {
        showToast('Please enter your password');
        return;
    }

    if (password.length < 3) {
        showToast('Password must be at least 3 characters');
        return;
    }

    // Validate credentials
    if (email === DEMO_USERS.user.email && password === DEMO_USERS.user.password) {
        // Create session
        const session = {
            type: 'user',
            email: email,
            loginTime: new Date().toISOString()
        };

        // Store session
        if (remember) {
            localStorage.setItem('valerianSession', JSON.stringify(session));
        } else {
            sessionStorage.setItem('valerianSession', JSON.stringify(session));
        }

        showToast('Login successful! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showToast('Invalid email or password');
    }
}

// Admin Login Handler
async function handleAdminLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('adminEmail');
    const password = formData.get('adminPassword');

    // Form Validation
    if (!validateRequired(email)) {
        showToast('Please enter admin email address');
        return;
    }

    if (!validateEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }

    if (!validateRequired(password)) {
        showToast('Please enter admin password');
        return;
    }

    if (password.length < 3) {
        showToast('Password must be at least 3 characters');
        return;
    }

    // Validate admin credentials
    if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
        // Create admin session
        const session = {
            type: 'admin',
            email: email,
            loginTime: new Date().toISOString()
        };

        // Store session
        localStorage.setItem('valerianSession', JSON.stringify(session));

        showToast('Admin access granted! Redirecting...');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    } else {
        showToast('Invalid admin credentials');
    }
}

// Check Existing Session
function checkExistingSession() {
    const session = localStorage.getItem('valerianSession') || sessionStorage.getItem('valerianSession');
    
    if (session) {
        const sessionData = JSON.parse(session);
        
        // Redirect based on session type
        if (sessionData.type === 'admin') {
            window.location.href = 'admin.html';
        } else if (sessionData.type === 'user') {
            window.location.href = 'index.html';
        }
    }
}

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Make functions global
window.togglePassword = togglePassword;

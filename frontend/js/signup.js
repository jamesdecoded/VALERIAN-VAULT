// Sign Up Logic

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSignupForm();
    checkExistingSession();
    // Initialize Google Sign-In
    if (window.GoogleAuth) {
        GoogleAuth.init();
    }
});

// Form Handler
function initSignupForm() {
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

// Validation Helpers
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^(\+254|0)[0-9]{9}$/.test(phone);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Sign Up Handler
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('termsCheckbox').checked;

    // Validation
    if (!name || name.length < 2) {
        showToast('Please enter your full name');
        return;
    }

    if (!phone) {
        showToast('Please enter your phone number');
        return;
    }

    if (!validatePhone(phone)) {
        showToast('Please enter a valid phone number (e.g., +254712345678 or 0712345678)');
        return;
    }

    if (!email) {
        showToast('Please enter your email address');
        return;
    }

    if (!validateEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }

    if (!password) {
        showToast('Please enter a password');
        return;
    }

    if (!validatePassword(password)) {
        showToast('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
    }

    if (!termsAccepted) {
        showToast('Please accept the Terms & Conditions');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        showToast('An account with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name: name,
        phone: phone,
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Create session
    const session = {
        type: 'user',
        email: email,
        name: name,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('valerianSession', JSON.stringify(session));

    showToast('Account created successfully! Redirecting...');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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

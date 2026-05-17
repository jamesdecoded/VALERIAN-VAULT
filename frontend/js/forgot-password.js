// Forgot Password Logic

let verifiedEmail = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initForms();
});

// Form Handlers
function initForms() {
    document.getElementById('emailForm').addEventListener('submit', handleEmailVerification);
    document.getElementById('resetForm').addEventListener('submit', handlePasswordReset);
}

// Validation Helpers
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Email Verification Handler
async function handleEmailVerification(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();

    // Validation
    if (!email) {
        showToast('Please enter your email address');
        return;
    }

    if (!validateEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }

    // Check if email exists in registered users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        showToast('No account found with this email address');
        return;
    }

    // Email verified, show reset form
    verifiedEmail = email;
    document.getElementById('emailForm').style.display = 'none';
    document.getElementById('resetForm').style.display = 'block';
    showToast('Email verified! Enter your new password');
}

// Password Reset Handler
async function handlePasswordReset(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Validation
    if (!newPassword) {
        showToast('Please enter a new password');
        return;
    }

    if (!validatePassword(newPassword)) {
        showToast('Password must be at least 6 characters long');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showToast('Passwords do not match');
        return;
    }

    // Update password
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === verifiedEmail);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        showToast('Password reset successfully! Redirecting to login...');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showToast('Error resetting password. Please try again.');
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

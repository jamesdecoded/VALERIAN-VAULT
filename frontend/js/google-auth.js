// Google OAuth Integration

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '77842010902-nu99ou8do5v312dthceb8no3ij80drg9.apps.googleusercontent.com';

let googleInitialized = false;

// Initialize Google Sign-In
function initGoogleSignIn() {
    // Wait for Google library to load
    if (typeof google === 'undefined' || !google.accounts) {
        console.log('Google library not loaded yet, retrying...');
        setTimeout(initGoogleSignIn, 500);
        return;
    }

    try {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        googleInitialized = true;
        console.log('Google Sign-In initialized successfully');
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
    }
}

// Handle Google Sign-In Response
async function handleGoogleCallback(response) {
    try {
        // Decode Google JWT token
        const googleUser = parseJwt(response.credential);
        
        console.log('Google User:', googleUser);

        // Extract user information
        const userData = {
            id: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            emailVerified: googleUser.email_verified,
            provider: 'google'
        };

        // Check if user exists in local storage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let existingUser = users.find(u => u.email === userData.email);

        if (!existingUser) {
            // Create new user
            const newUser = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                phone: '', // Can be collected later
                picture: userData.picture,
                provider: 'google',
                emailVerified: userData.emailVerified,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            existingUser = newUser;
        }

        // Generate JWT token for session
        const sessionToken = await window.JWT.generateToken({
            userId: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            type: 'user',
            provider: 'google'
        });

        // Create session with JWT
        const session = {
            type: 'user',
            email: existingUser.email,
            name: existingUser.name,
            picture: existingUser.picture,
            provider: 'google',
            token: sessionToken,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('valerianSession', JSON.stringify(session));

        // Show success message
        showToast('Google Sign-In successful! Redirecting...', 'success');

        // Redirect based on current page
        setTimeout(() => {
            if (window.location.pathname.includes('signup')) {
                window.location.href = 'index.html';
            } else if (window.location.pathname.includes('login')) {
                window.location.href = 'index.html';
            } else {
                window.location.reload();
            }
        }, 1500);

    } catch (error) {
        console.error('Google Sign-In Error:', error);
        showToast('Google Sign-In failed. Please try again.', 'error');
    }
}

// Parse JWT token (Google's credential)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

// Trigger Google Sign-In popup
function signInWithGoogle() {
    if (!googleInitialized) {
        showToast('Google Sign-In is still loading. Please wait...', 'warning');
        setTimeout(signInWithGoogle, 1000);
        return;
    }

    // Log current origin for debugging
    console.log('Current origin:', window.location.origin);
    console.log('Current URL:', window.location.href);
    console.log('Client ID:', GOOGLE_CLIENT_ID);

    if (typeof google !== 'undefined' && google.accounts) {
        try {
            // Use renderButton instead of prompt for better compatibility
            const container = document.createElement('div');
            container.id = 'g_id_signin';
            container.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background: rgba(0,0,0,0.9); padding: 2rem; border-radius: 16px;';
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: white; font-size: 2rem; cursor: pointer;';
            closeBtn.onclick = () => container.remove();
            
            container.appendChild(closeBtn);
            document.body.appendChild(container);

            google.accounts.id.renderButton(
                container,
                {
                    theme: 'filled_black',
                    size: 'large',
                    width: 300,
                    text: 'continue_with',
                    shape: 'rectangular'
                }
            );
        } catch (error) {
            console.error('Error rendering Google button:', error);
            showToast('Error loading Google Sign-In. Check console for details.', 'error');
        }
    } else {
        showToast('Google Sign-In is not available. Please try again later.', 'error');
    }
}

// Show Google Sign-In button
function showGoogleSignInButton() {
    if (typeof google !== 'undefined' && google.accounts && googleInitialized) {
        const existingButton = document.getElementById('googleSignInButton');
        if (existingButton) {
            existingButton.remove();
        }

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'googleSignInButton';
        buttonDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000;';
        document.body.appendChild(buttonDiv);

        google.accounts.id.renderButton(
            buttonDiv,
            {
                theme: 'filled_black',
                size: 'large',
                width: 300,
                text: 'continue_with'
            }
        );
    }
}

// Toast notification helper
function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.className = 'toast';
    if (type === 'success') {
        toast.classList.add('toast-success');
    } else if (type === 'error') {
        toast.classList.add('toast-error');
    } else if (type === 'warning') {
        toast.classList.add('toast-warning');
    }

    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3000);
}

// Export functions
window.GoogleAuth = {
    init: initGoogleSignIn,
    signIn: signInWithGoogle,
    handleCallback: handleGoogleCallback
};

# Google Sign-In with JWT Setup Guide

## Overview
VALERIAN VAULT now supports Google Sign-In authentication with JWT token management. This provides a secure, seamless login experience for users.

---

## Features Implemented

### 1. JWT Token System
- **Token Generation**: Creates secure JWT tokens for authenticated sessions
- **Token Verification**: Validates tokens on each request
- **Token Expiration**: 7-day expiration with automatic refresh
- **Secure Storage**: Tokens stored in localStorage with session data

### 2. Google OAuth Integration
- **One-Click Sign-In**: Users can sign in with their Google account
- **Auto Registration**: New users automatically registered on first sign-in
- **Profile Sync**: Name, email, and profile picture synced from Google
- **Seamless Experience**: No password required for Google users

### 3. Session Management
- **JWT-based Sessions**: All sessions use JWT tokens
- **Provider Tracking**: Tracks authentication provider (email/password or Google)
- **Persistent Login**: Sessions persist across browser sessions
- **Secure Logout**: Properly clears tokens and session data

---

## Setup Instructions

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable **Google Identity Services API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen:
   - Application name: VALERIAN VAULT
   - User support email: your-email@example.com
   - Authorized domains: your-domain.com (or localhost for testing)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: VALERIAN VAULT Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
     - `https://your-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:3000/login.html`
     - `http://127.0.0.1:3000/login.html`
     - `https://your-domain.com/login.html` (production)
7. Copy the **Client ID**

### Step 2: Configure Application

1. Open `frontend/js/google-auth.js`
2. Replace the placeholder with your Client ID:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com';
   ```

### Step 3: Test the Integration

1. Start the server:
   ```bash
   cd backend
   npm start
   ```

2. Open browser and navigate to:
   - http://127.0.0.1:3000/login.html
   - or http://127.0.0.1:3000/signup.html

3. Click "Sign in with Google" button

4. Select your Google account

5. You should be automatically logged in and redirected to the storefront

---

## How It Works

### Authentication Flow

1. **User clicks "Sign in with Google"**
   - Google Sign-In popup appears
   - User selects Google account
   - Google returns JWT credential

2. **Application processes Google response**
   - Decodes Google JWT token
   - Extracts user information (name, email, picture)
   - Checks if user exists in local database

3. **User registration/login**
   - If new user: Creates account automatically
   - If existing user: Retrieves user data
   - Generates application JWT token

4. **Session creation**
   - Stores JWT token in session
   - Saves user data to localStorage
   - Redirects to storefront

5. **Authenticated requests**
   - JWT token included in session
   - Token verified on protected routes
   - User remains logged in until token expires or logout

---

## JWT Token Structure

### Token Payload
```json
{
  "userId": "google-user-id",
  "email": "user@example.com",
  "name": "User Name",
  "type": "user",
  "provider": "google",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Storage
```json
{
  "type": "user",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "provider": "google",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "loginTime": "2024-01-01T00:00:00.000Z"
}
```

---

## Security Considerations

### Current Implementation (Development)
- Client-side JWT generation (for demo purposes)
- Tokens stored in localStorage
- Simple HMAC SHA256 signature

### Production Requirements

**IMPORTANT**: Before deploying to production, implement:

1. **Server-Side JWT Generation**
   - Move JWT generation to backend
   - Use proper crypto libraries (jsonwebtoken)
   - Store secret key in environment variables

2. **Secure Token Storage**
   - Use httpOnly cookies instead of localStorage
   - Implement CSRF protection
   - Add XSS protection headers

3. **Token Refresh**
   - Implement refresh token mechanism
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)

4. **Backend Verification**
   - Verify Google tokens on server
   - Validate JWT on every protected route
   - Implement rate limiting

5. **HTTPS Only**
   - Force HTTPS in production
   - Secure cookie flags
   - HSTS headers

---

## Testing

### Test Accounts

**Demo Email/Password Login:**
- Email: user@valerianvault.com
- Password: user123

**Admin Login:**
- Email: admin@valerianvault.com
- Password: admin123

**Google Sign-In:**
- Use any Google account
- First sign-in creates new user
- Subsequent sign-ins use existing account

---

## Troubleshooting

### Google Sign-In button not appearing
- Check if Client ID is correctly configured
- Verify authorized origins in Google Console
- Check browser console for errors
- Ensure Google Identity Services script is loaded

### "Invalid Client ID" error
- Verify Client ID matches Google Console
- Check authorized JavaScript origins
- Clear browser cache and try again

### Token verification fails
- Check JWT_SECRET in jwt-utils.js
- Verify token hasn't expired
- Check browser console for errors

### User not redirected after sign-in
- Check browser console for JavaScript errors
- Verify session storage is working
- Clear localStorage and try again

---

## API Endpoints (Future Enhancement)

For production, implement these backend endpoints:

```
POST /api/auth/google
- Verify Google token
- Create/update user
- Generate JWT token
- Return session data

POST /api/auth/refresh
- Verify refresh token
- Generate new access token
- Return new token

POST /api/auth/logout
- Invalidate tokens
- Clear session

GET /api/auth/verify
- Verify JWT token
- Return user data
```

---

## Files Modified/Created

### New Files:
- `frontend/js/jwt-utils.js` - JWT token utilities
- `frontend/js/google-auth.js` - Google OAuth integration
- `GOOGLE_SIGNIN_SETUP.md` - This setup guide

### Modified Files:
- `frontend/login.html` - Added Google Sign-In scripts and button
- `frontend/signup.html` - Added Google Sign-In scripts and button
- `frontend/js/auth.js` - Initialize Google Sign-In
- `frontend/js/signup.js` - Initialize Google Sign-In

---

## Next Steps

1. **Get Google OAuth credentials** from Google Cloud Console
2. **Update Client ID** in google-auth.js
3. **Test the integration** locally
4. **Plan backend implementation** for production
5. **Implement security measures** before going live

---

## Support

For issues or questions:
- Check browser console for errors
- Review Google Cloud Console settings
- Verify all setup steps completed
- Test with different Google accounts

---

## Version

Google Sign-In Integration: v1.0.0
JWT Implementation: v1.0.0
Last Updated: 2024

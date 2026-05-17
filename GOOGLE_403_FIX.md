# Google OAuth Configuration - Step by Step Fix

## Your Current Setup
- **Origin**: `http://127.0.0.1:3000`
- **Client ID**: `77842010902-sjj2vm8un1nr6088p77fflg4l95ekmsj.apps.googleusercontent.com`
- **Error**: "The given origin is not allowed for the given client ID"

---

## EXACT Steps to Fix

### Step 1: Open Google Cloud Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project

### Step 2: Find Your OAuth Client
1. Look for: `77842010902-sjj2vm8un1nr6088p77fflg4l95ekmsj.apps.googleusercontent.com`
2. Click the **pencil icon** (Edit) next to it

### Step 3: Check Authorized JavaScript Origins
In the "Authorized JavaScript origins" section, you should see:

**MUST HAVE EXACTLY:**
```
http://127.0.0.1:3000
```

**Common Mistakes to Avoid:**
- ❌ `http://127.0.0.1:3000/` (with trailing slash)
- ❌ `https://127.0.0.1:3000` (https instead of http)
- ❌ `http://localhost:3000` (localhost instead of 127.0.0.1)
- ✅ `http://127.0.0.1:3000` (CORRECT)

### Step 4: Add Additional Origins (Optional but Recommended)
Add these as well:
```
http://localhost:3000
http://127.0.0.1
http://localhost
```

### Step 5: Check Authorized Redirect URIs
Add these:
```
http://127.0.0.1:3000/login.html
http://127.0.0.1:3000/signup.html
http://127.0.0.1:3000
```

### Step 6: Save and Wait
1. Click **SAVE** at the bottom
2. **IMPORTANT**: Wait 5-10 minutes for changes to propagate
3. Do NOT test immediately

### Step 7: Clear Everything
While waiting, clear:
1. Browser cache (Ctrl+Shift+Delete)
2. Cookies for `accounts.google.com`
3. Or just use **Incognito/Private mode**

### Step 8: Restart Server
```bash
# Stop the server (Ctrl+C)
cd backend
npm start
```

### Step 9: Test Again
1. Open: http://127.0.0.1:3000/login.html (use EXACT URL)
2. Click "Sign in with Google"
3. Should work now!

---

## Verification Checklist

Before testing, verify:
- [ ] Exact origin `http://127.0.0.1:3000` is in authorized origins
- [ ] No trailing slash in the origin
- [ ] Using http NOT https
- [ ] Saved changes in Google Console
- [ ] Waited at least 5 minutes
- [ ] Cleared browser cache
- [ ] Using exact URL: http://127.0.0.1:3000/login.html

---

## Still Not Working?

### Option 1: Create New OAuth Client
If the above doesn't work, create a fresh OAuth client:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `VALERIAN VAULT - Local Dev`
5. Authorized JavaScript origins:
   - `http://127.0.0.1:3000`
   - `http://localhost:3000`
6. Authorized redirect URIs:
   - `http://127.0.0.1:3000/login.html`
   - `http://127.0.0.1:3000/signup.html`
7. Click **CREATE**
8. Copy the new Client ID
9. Update `google-auth.js` with new Client ID
10. Test immediately (new clients work instantly)

### Option 2: Check Project Settings
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Make sure OAuth consent screen is configured
3. Publishing status should be "Testing" or "In production"
4. Add your Google account to test users if in "Testing" mode

### Option 3: Verify API is Enabled
1. Go to: https://console.cloud.google.com/apis/library
2. Search for "Google Identity Services API"
3. Make sure it's **ENABLED**

---

## Quick Debug Commands

Open browser console and run:
```javascript
// Check current origin
console.log('Origin:', window.location.origin);

// Check if Google loaded
console.log('Google loaded:', typeof google !== 'undefined');

// Check Client ID
console.log('Client ID:', '77842010902-sjj2vm8un1nr6088p77fflg4l95ekmsj.apps.googleusercontent.com');
```

---

## Expected Console Output (When Working)

When it's working correctly, you should see:
```
Google Sign-In initialized successfully
Current origin: http://127.0.0.1:3000
Current URL: http://127.0.0.1:3000/login.html
Client ID: 77842010902-sjj2vm8un1nr6088p77fflg4l95ekmsj.apps.googleusercontent.com
[No 403 errors]
[Google Sign-In popup appears]
```

---

## Common Issues

### Issue: "Changes not taking effect"
**Solution**: Google can take up to 10 minutes to propagate changes. Be patient.

### Issue: "Still getting 403"
**Solution**: 
1. Double-check the EXACT origin in Google Console
2. Make sure there's no typo
3. Try creating a new OAuth client

### Issue: "Button doesn't appear"
**Solution**: Check browser console for JavaScript errors

### Issue: "Popup blocked"
**Solution**: Allow popups for 127.0.0.1 in browser settings

---

## Screenshot Guide

Your Google Cloud Console should look like this:

**Authorized JavaScript origins:**
```
URIs                          Actions
http://127.0.0.1:3000        [Delete]
http://localhost:3000        [Delete]
[+ ADD URI]
```

**Authorized redirect URIs:**
```
URIs                                    Actions
http://127.0.0.1:3000/login.html       [Delete]
http://127.0.0.1:3000/signup.html      [Delete]
[+ ADD URI]
```

---

## Need More Help?

If you're still stuck:
1. Take a screenshot of your Google Cloud Console OAuth settings
2. Check if you're using the correct Google account
3. Try a different browser
4. Make sure you don't have ad blockers blocking Google APIs

The 403 error will disappear once the origin is properly configured!

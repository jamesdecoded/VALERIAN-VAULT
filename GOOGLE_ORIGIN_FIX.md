# Fix: "The given origin is not allowed for the given client ID"

## Problem
Google Sign-In is rejecting your origin because it's not authorized in Google Cloud Console.

## Solution

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Go to **APIs & Services** → **Credentials**

### Step 2: Edit OAuth 2.0 Client ID
1. Find your OAuth 2.0 Client ID: `77842010902-sjj2vm8un1nr6088p77fflg4l95ekmsj.apps.googleusercontent.com`
2. Click the **Edit** (pencil) icon

### Step 3: Add Authorized JavaScript Origins
Add ALL of these origins:

```
http://localhost:3000
http://127.0.0.1:3000
http://localhost
http://127.0.0.1
```

### Step 4: Add Authorized Redirect URIs (if needed)
Add these redirect URIs:

```
http://localhost:3000/login.html
http://127.0.0.1:3000/login.html
http://localhost:3000/signup.html
http://127.0.0.1:3000/signup.html
http://localhost:3000
http://127.0.0.1:3000
```

### Step 5: Save Changes
1. Click **SAVE** at the bottom
2. Wait 5-10 minutes for changes to propagate (Google's servers need time to update)

### Step 6: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Incognito/Private mode

### Step 7: Test Again
1. Restart your server if needed
2. Go to http://127.0.0.1:3000/login.html
3. Click "Sign in with Google"
4. Should work now!

## Common Issues

### Issue: Still getting 403 error
- Wait longer (up to 10 minutes) for Google to propagate changes
- Make sure you saved the changes in Google Console
- Try using the exact URL format (http://127.0.0.1:3000 vs http://localhost:3000)

### Issue: "redirect_uri_mismatch"
- Add the redirect URIs listed above
- Make sure there are no trailing slashes

### Issue: Changes not taking effect
- Clear all browser cookies for accounts.google.com
- Use Incognito/Private browsing mode
- Try a different browser

## Quick Test
After making changes, you should see:
1. Google Sign-In popup appears
2. You can select your Google account
3. You're redirected back to the site
4. You're logged in successfully

## Screenshot of Correct Configuration

Your OAuth 2.0 Client should look like this:

**Authorized JavaScript origins:**
- http://localhost:3000
- http://127.0.0.1:3000

**Authorized redirect URIs:**
- http://localhost:3000/login.html
- http://127.0.0.1:3000/login.html
- http://localhost:3000/signup.html
- http://127.0.0.1:3000/signup.html

## Still Not Working?

If you're still having issues:

1. **Check the exact URL** you're using in the browser
2. **Add that exact URL** to authorized origins
3. **Wait 10 minutes** after saving
4. **Clear cache** completely
5. **Try Incognito mode**

The error message will disappear once the origins are properly configured!

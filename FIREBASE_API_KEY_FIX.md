# Fixing Firebase API Key Error

## The Error
`Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)`

## Common Causes & Solutions

### 1. Dev Server Not Restarted ⚠️ MOST COMMON
**Solution**: Restart the dev server after creating/updating `.env` file
```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm start
```

### 2. API Key Restrictions in Google Cloud Console
The API key might have restrictions that block it from working.

**Check & Fix**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your **JazzUp** project
3. Go to **APIs & Services** → **Credentials**
4. Find your API key (starts with `AIzaSy...`)
5. Click on it to edit
6. Under **API restrictions**:
   - If restricted, make sure these APIs are enabled:
     - **Identity Toolkit API**
     - **Firebase Authentication API**
   - OR set to **Don't restrict key** (for development)
7. Under **Application restrictions**:
   - Set to **None** (for development)
   - OR add your localhost domain: `http://localhost:3000`
8. Click **Save**

### 3. Verify API Key is Correct
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **JazzUp** project
3. Go to **Project Settings** → **General**
4. Scroll to **Your apps** → Web app
5. Verify the API key matches your `.env` file

### 4. Check Required APIs are Enabled
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select **JazzUp** project
3. Go to **APIs & Services** → **Library**
4. Search and enable:
   - **Identity Toolkit API**
   - **Firebase Authentication API**

### 5. Verify .env File Format
Make sure your `.env` file has:
- No spaces around the `=` sign
- No quotes around values (unless they contain spaces)
- All variables start with `REACT_APP_`

**Correct format**:
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyBm8phCQrHzQHcbKEd5F1Ge9Vs4guuaY-0
REACT_APP_FIREBASE_AUTH_DOMAIN=jazzup-d17cc.firebaseapp.com
```

**Wrong format**:
```env
REACT_APP_FIREBASE_API_KEY = "AIzaSy..."  # ❌ Spaces and quotes
REACT_APP_FIREBASE_API_KEY='AIzaSy...'    # ❌ Quotes
```

## Quick Fix Steps

1. **Restart dev server** (most likely fix):
   ```bash
   # Stop current server (Ctrl+C)
   npm start
   ```

2. **Check browser console** for the actual error message

3. **Verify API key in Firebase Console** matches `.env` file

4. **Check API restrictions** in Google Cloud Console

5. **Enable required APIs** if not already enabled

## Still Not Working?

If the error persists:
1. Double-check the API key in Firebase Console matches `.env`
2. Try creating a new API key in Firebase Console
3. Make sure Authentication is enabled in Firebase Console
4. Check browser console for more detailed error messages


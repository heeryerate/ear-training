# Firebase Testing Checklist

## ✅ Configuration Complete
- [x] .env file created with Firebase config
- [x] All environment variables set correctly
- [x] Firebase project: jazzup-d17cc

## Testing Steps

### 1. Test Sign Up
1. Open the app (should be running on http://localhost:3000)
2. Click **"Sign In / Sign Up"** button
3. Click **"Sign Up"** link
4. Enter:
   - Email: `test@example.com` (use a real email you can access)
   - Password: `test123456` (at least 6 characters)
   - Confirm Password: `test123456`
5. Click **"Sign Up"**
6. **Expected**: 
   - Account created successfully
   - Auth window closes
   - Your email appears in the top right
   - "Logout" button appears

### 2. Verify in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **JazzUp** project
3. Go to **Authentication** → **Users**
4. **Expected**: You should see your test user email

### 3. Test Sign In
1. Click **"Logout"** button
2. Click **"Sign In / Sign Up"** again
3. Enter your email and password
4. Click **"Sign In"**
5. **Expected**: Successfully signed in

### 4. Test Data Persistence
1. While logged in, go to **Tunes Library**
2. Rate a few tunes (click the stars)
3. Go to **Firebase Console** → **Firestore Database**
4. **Expected**: 
   - You should see a `users` collection
   - Your user ID as a document
   - `tunesMetadata` field with your ratings

### 5. Test Password Reset
1. Click **"Logout"**
2. Click **"Sign In / Sign Up"**
3. Click **"Forgot password?"**
4. Enter your email
5. Click **"Reset Password"**
6. **Expected**: Success message displayed
7. Check your email for reset link

### 6. Test Without Login (localStorage)
1. Make sure you're logged out
2. Go to **Tunes Library**
3. Rate some tunes
4. Refresh the page
5. **Expected**: Your ratings should still be there (saved in localStorage)

### 7. Test Data Migration
1. While logged out, rate a few tunes
2. Sign in with your account
3. **Expected**: Your local ratings should migrate to Firebase
4. Check Firestore - should see your ratings

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure dev server was restarted after creating .env
- Check that all env vars start with `REACT_APP_`

### "Missing or insufficient permissions"
- Check Firestore security rules are set correctly
- Make sure you're logged in

### "Firebase app already initialized"
- This is usually fine, Firebase handles it gracefully

### Data not saving
- Check browser console for errors
- Verify Firestore is enabled
- Check network tab for Firebase requests

## Success Indicators

✅ Can create account  
✅ Can sign in  
✅ Can sign out  
✅ Data saves to Firestore when logged in  
✅ Data saves to localStorage when not logged in  
✅ Data migrates when logging in  


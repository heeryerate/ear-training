# Firebase Setup Guide for JazzUp

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **JazzUp** project
3. Click the **gear icon** (⚙️) next to "Project Overview"
4. Select **Project Settings**
5. Scroll down to **"Your apps"** section
6. Click the **Web icon** (`</>`) to add a web app
7. Register app:
   - App nickname: `JazzUp Web` (or any name)
   - **Do NOT** check "Also set up Firebase Hosting"
   - Click **Register app**
8. Copy the `firebaseConfig` object that appears

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Click **Sign-in method** tab
4. Click on **Email/Password**
5. Enable **Email/Password** (toggle ON)
6. Click **Save**

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - ⚠️ **Important**: We'll set security rules next
4. Select a **location** (choose closest to your users)
5. Click **Enable**

## Step 4: Set Firestore Security Rules

1. In **Firestore Database**, click **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 5: Add Configuration to Project

1. Create a `.env` file in the project root (same level as `package.json`)
2. Add your Firebase config (replace with your actual values):

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=jazzup-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=jazzup-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=jazzup-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. **Important**: 
   - Replace all values with your actual Firebase config
   - The `.env` file should NOT be committed to git (it's in `.gitignore`)
   - Restart your development server after creating/updating `.env`

## Step 6: Test the Connection

1. Restart your development server:
   ```bash
   npm start
   ```

2. Open the app and click "Sign In / Sign Up"
3. Try creating a new account
4. Check Firebase Console:
   - **Authentication** → Should show your new user
   - **Firestore Database** → Should show a `users` collection with your user ID

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure `.env` file exists in project root
- Check that all environment variables start with `REACT_APP_`
- Restart the development server

### "Missing or insufficient permissions"
- Check Firestore security rules are set correctly
- Make sure you're logged in when testing

### "Firebase app already initialized"
- This is usually fine, Firebase handles multiple initializations gracefully

## Next Steps

Once everything is working:
1. Test sign up, sign in, and password reset
2. Test that data saves to Firestore when logged in
3. Test that data saves to localStorage when not logged in
4. Test data migration when logging in with existing localStorage data

## Production Considerations

Before deploying:
1. Update Firestore security rules for production
2. Set up proper Firebase Hosting (if needed)
3. Configure custom domain (optional)
4. Set up monitoring and alerts


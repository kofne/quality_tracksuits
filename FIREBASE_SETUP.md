# Firebase Setup Guide for Premium Tracksuits Store

This guide will help you set up Firebase for the tracksuit eCommerce store.

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "premium-tracksuits-store")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 🔥 Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location closest to your users
5. Click "Done"

## 🔐 Step 3: Set Up Authentication (Optional for Admin)

1. Go to "Authentication" in your Firebase project
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" if you want admin authentication
5. Add your admin email as an authorized user

## 📱 Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "tracksuit-store-web")
5. Copy the Firebase configuration object

## 🔧 Step 5: Environment Variables

Create a `.env.local` file in your project root and add your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🛡️ Step 6: Firestore Security Rules

Go to Firestore Database > Rules and update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users (for development)
    // In production, you should implement proper authentication
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Alternative: Allow only authenticated users
    // match /{document=**} {
    //   allow read, write: if request.auth != null;
    // }
  }
}
```

## 📊 Step 7: Create Collections

Your Firestore will automatically create these collections when data is first added:

- `tracksuit_orders` - Store all order information
- `referrals` - Store referral codes and earnings
- `contacts` - Store contact form submissions

## 🔍 Step 8: Test Your Setup

1. Start your development server: `npm run dev`
2. Go to your store and try to place an order
3. Check Firestore Database to see if data is being saved
4. Verify admin dashboard can fetch data

## 🚨 Production Security Rules

For production, use these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders - allow read/write for authenticated users
    match /tracksuit_orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Referrals - allow read/write for authenticated users
    match /referrals/{referralId} {
      allow read, write: if request.auth != null;
    }
    
    // Contacts - allow read for authenticated users, write for everyone
    match /contacts/{contactId} {
      allow read: if request.auth != null;
      allow write: if true;
    }
  }
}
```

## 📧 Step 9: Email Configuration

### Option A: Gmail (Development)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. Add to your `.env.local`:
   ```env
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_APP_PASSWORD=your_app_password
   ```

### Option B: Resend (Production)

1. Sign up at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Add to your `.env.local`:
   ```env
   RESEND_API_KEY=your_resend_api_key
   ```

## 🔍 Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - For localhost, add `localhost` to authorized domains

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your API key in `.env.local`
   - Make sure you copied the correct configuration

3. **"Firestore: Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Make sure rules allow read/write operations

4. **"Email not sending"**
   - Check your email configuration
   - Verify Gmail app password or Resend API key
   - Check spam folder for test emails

### Debug Mode

Add this to your `.env.local` for debugging:
```env
NEXT_PUBLIC_DEBUG=true
```

## 📈 Monitoring

1. **Firebase Console**: Monitor usage, errors, and performance
2. **Firestore**: View data in real-time
3. **Authentication**: Monitor user sign-ins
4. **Analytics**: Track user behavior (if enabled)

## 🔄 Backup Strategy

1. **Export Data**: Use Firebase CLI to export data
2. **Regular Backups**: Set up automated backups
3. **Version Control**: Keep your security rules in version control

## 🚀 Deployment

When deploying to production:

1. Update security rules
2. Set up proper authentication
3. Configure authorized domains
4. Set up monitoring and alerts
5. Test all functionality in production environment

---

**Need Help?** Check the Firebase documentation or create an issue in the project repository. 
# 🔥 Firebase Firestore Integration Guide

This guide will help you set up Firebase Firestore for your Next.js 15 application to store contact form submissions and order data.

## 📋 What's Included

✅ **Firebase Configuration** (`lib/firebase.ts`)
✅ **Firestore Functions** (`lib/firestore.ts`)
✅ **Contact Form Integration** (`components/contact-form.tsx`)
✅ **After Payment Form** (`components/after-payment-form.tsx`)
✅ **PayPal Integration Example** (`components/PayPalButton.tsx`)

## 🚀 Quick Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "frontal-hairs-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 3. Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname
6. Copy the configuration object

### 4. Set Up Environment Variables

1. Copy `env.local.example` to `.env.local`
2. Replace the placeholder values with your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📊 Firestore Collections

The app will create two collections automatically:

### 1. `contacts` Collection
Stores contact form submissions with the following structure:
```typescript
{
  name: string,
  email: string,
  message: string,
  createdAt: Timestamp
}
```

### 2. `orders` Collection
Stores order data after successful payment:
```typescript
{
  name: string,
  email: string,
  message: string,
  grade: string,
  subjects: string[],
  createdAt: Timestamp,
  status: 'paid'
}
```

## 🔧 Usage Examples

### Contact Form Usage

The contact form is already integrated and will automatically save to Firestore:

```tsx
import { ContactForm } from '@/components/contact-form';

// Use in any component
<ContactForm />
```

### After Payment Form Usage

Use the after payment form to collect additional order details:

```tsx
import { AfterPaymentForm } from '@/components/after-payment-form';

// Use after successful payment
<AfterPaymentForm />
```

### Manual Firestore Functions

You can also use the Firestore functions directly:

```tsx
import { saveContactForm, saveOrderAfterPayment } from '@/lib/firestore';

// Save contact form
const contactData = {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I have a question!'
};

try {
  const result = await saveContactForm(contactData);
  console.log('Contact saved with ID:', result.id);
} catch (error) {
  console.error('Error saving contact:', error);
}

// Save order after payment
const orderData = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  message: 'Please deliver to my address',
  grade: '12th Grade',
  subjects: ['Mathematics', 'Science']
};

try {
  const result = await saveOrderAfterPayment(orderData);
  console.log('Order saved with ID:', result.id);
} catch (error) {
  console.error('Error saving order:', error);
}
```

### PayPal Integration

In your PayPal `onApprove` callback, you can save order data:

```tsx
onApprove: function (data, actions) {
  return actions.order.capture().then(function (details) {
    // Payment successful - now save order data
    const orderData = {
      name: customerName,
      email: customerEmail,
      message: 'Order placed via PayPal',
      grade: selectedGrade,
      subjects: selectedSubjects
    };
    
    // Save to Firestore
    saveOrderAfterPayment(orderData)
      .then(result => {
        console.log('Order saved:', result.id);
        // Show success message to user
      })
      .catch(error => {
        console.error('Error saving order:', error);
        // Handle error
      });
  });
}
```

## 🔒 Security Rules (Optional)

For production, set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for contacts collection
    match /contacts/{document} {
      allow read, write: if true; // For demo - restrict in production
    }
    
    // Allow read/write for orders collection
    match /orders/{document} {
      allow read, write: if true; // For demo - restrict in production
    }
  }
}
```

## 🧪 Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Contact Form:**
   - Go to your website
   - Click "Contact Us" in the header
   - Fill out and submit the form
   - Check Firebase Console > Firestore Database > contacts collection

3. **Test Order Form:**
   - Use the AfterPaymentForm component
   - Fill out and submit the form
   - Check Firebase Console > Firestore Database > orders collection

## 🚨 Troubleshooting

### Common Issues:

1. **"Module not found: Can't resolve 'firebase/app'"**
   - Make sure Firebase is installed: `npm install firebase`
   - Check that your `.env.local` file exists and has correct values

2. **"Firebase: Error (auth/unauthorized)"**
   - Verify your Firebase API key is correct
   - Check that Firestore is enabled in your Firebase project

3. **"Permission denied"**
   - Check Firestore security rules
   - Make sure you're in test mode or have proper rules set up

4. **Environment variables not loading**
   - Restart your development server after adding `.env.local`
   - Make sure variable names start with `NEXT_PUBLIC_` for client-side access

## 📈 Next Steps

1. **Set up proper security rules** for production
2. **Add data validation** before saving to Firestore
3. **Implement user authentication** if needed
4. **Add real-time listeners** for live updates
5. **Set up Firebase Analytics** for insights

## 🆘 Support

If you encounter any issues:
1. Check the Firebase Console for error messages
2. Verify your environment variables are correct
3. Check the browser console for JavaScript errors
4. Ensure Firestore is enabled in your Firebase project

---

**Note:** This setup uses Firebase in test mode. For production, make sure to configure proper security rules and authentication. 
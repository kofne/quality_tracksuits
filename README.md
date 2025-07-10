# 💇‍♀️ Frontal Hair Collection

A modern e-commerce application for selling frontal hair pieces, built with Next.js, TypeScript, and Firebase.

## 🚀 Features

- **Product Selection**: Choose from a collection of 325+ frontal hair images
- **PayPal Integration**: Secure payment processing with PayPal
- **Firebase Database**: Order and contact form data storage
- **Email Notifications**: Automatic email alerts for new orders
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Contact Form**: Customer support integration
- **Real-time Validation**: Form validation with visual feedback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Payment**: PayPal SDK
- **Database**: Firebase Firestore
- **Email**: Nodemailer with Gmail
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Firebase project
- PayPal Developer account
- Gmail account (for email notifications)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontal-hairs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Gmail Configuration (for email notifications)
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_APP_PASSWORD=your_gmail_app_password

   # PayPal Configuration
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
   ```

## 🔥 Firebase Setup

1. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database

2. **Configure Firestore**
   - Create collections: `orders` and `contacts`
   - Set up security rules for your use case

3. **Get Firebase config**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Add a web app and copy the config values

## 💳 PayPal Setup

1. **Create PayPal Developer account**
   - Go to [PayPal Developer](https://developer.paypal.com/)
   - Create an account and get your client ID

2. **Configure PayPal**
   - Use sandbox credentials for testing
   - Switch to live credentials for production

## 📧 Gmail Setup

1. **Enable 2-factor authentication** on your Gmail account
2. **Generate an App Password**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"

## 🚀 Running the Application

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. **Build for production**
   ```bash
   npm run build
   npm start
   ```

3. **Open your browser**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── contact-form.tsx  # Contact form component
│   ├── gucci-form.tsx    # Main product form
│   ├── header.tsx        # Header component
│   └── PayPalButton.tsx  # PayPal integration
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── firestore.ts      # Firestore operations
│   └── size-data.ts      # Product data
├── types/                # TypeScript type definitions
└── public/               # Static assets
    └── images/           # Product images
```

## 🎯 Key Features Explained

### Product Selection
- Users can select up to 10 frontal hairs from 325+ options
- Visual feedback with hover effects and selection indicators
- Real-time counter showing selected items

### Payment Flow
1. User fills out customer information
2. Selects desired frontal hairs
3. Completes PayPal payment
4. Submits order for processing

### Data Storage
- Orders are saved to Firebase Firestore
- Contact form submissions are stored separately
- Email notifications are sent for new orders

## 🔒 Security Considerations

- Environment variables for sensitive data
- PayPal SDK for secure payment processing
- Firebase security rules for data access
- Input validation on all forms

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Note**: Make sure to replace placeholder values (emails, URLs, etc.) with your actual information before deploying. 
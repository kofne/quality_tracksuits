import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header';
import { PayPalProvider } from '@/components/paypal-provider';

export const metadata: Metadata = {
  title: 'Frontal Hairs - Premium Hair Collection',
  description: 'Select from our premium collection of frontal hairs. High-quality hair pieces for the perfect look.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Use a fallback client ID for testing if not configured
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';    
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <PayPalProvider clientId={paypalClientId}>
          <Header />
          {children}
        </PayPalProvider>
      </body>
    </html>
  )
}

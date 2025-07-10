import { useEffect, useRef, useState } from "react";
import { PayPalPaymentData } from "@/types/form";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: unknown) => { render: (container: HTMLElement) => void };
    };
  }
}

interface PayPalButtonProps {
  amount: number;
  onPaymentComplete: (paymentData: PayPalPaymentData) => void;
  disabled?: boolean;
}

export function PayPalButton({ amount, onPaymentComplete, disabled = false }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paypalError, setPaypalError] = useState<string | null>(null);

  if (disabled) {
    return (
      <div className="w-full p-4 text-center text-gray-500 bg-gray-100 rounded-lg">
        Please fill in all required information before proceeding to payment
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="w-full p-4 text-center text-gray-600 bg-gray-50 rounded-lg">
        <p>Loading PayPal...</p>
      </div>
    );
  }

  if (paypalError) {
    return (
      <div className="w-full p-4 text-center text-red-600 bg-red-50 rounded-lg">
        <p className="font-medium mb-2">PayPal is currently unavailable</p>
        <p className="text-sm">{paypalError}</p>
        <button 
          className="mt-3 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, width: '100%' }}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount.toString(),
              },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then((details) => {
            const paymentData: PayPalPaymentData = {
              paymentID: details.id,
              orderID: data.orderID,
              payerName: details.payer?.name?.given_name || 'Unknown',
              amount: amount,
              status: 'completed'
            };
            
            onPaymentComplete(paymentData);
            alert('Payment completed successfully! You can now submit your order.');
          });
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          setPaypalError('Payment failed. Please try again.');
        }}
      />
    </div>
  );
} 
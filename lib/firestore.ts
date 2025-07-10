import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { sendContactNotification, sendOrderNotification } from './email';

// Types for our data
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface OrderFormData {
  name: string;
  email: string;
  message: string;
  grade: string;
  subjects: string[];
}

// Validation functions
function validateContactData(data: ContactFormData): void {
  if (!data.name?.trim()) throw new Error('Name is required');
  if (!data.email?.trim()) throw new Error('Email is required');
  if (!data.message?.trim()) throw new Error('Message is required');
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) throw new Error('Invalid email format');
}

function validateOrderData(data: OrderFormData): void {
  if (!data.name?.trim()) throw new Error('Name is required');
  if (!data.email?.trim()) throw new Error('Email is required');
  if (!data.grade?.trim()) throw new Error('Grade is required');
  if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
    throw new Error('At least one subject must be selected');
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) throw new Error('Invalid email format');
}

/**
 * Save contact form submission to Firestore
 * @param contactData - The contact form data
 * @returns Promise with the document ID of the saved contact
 */
export async function saveContactForm(contactData: ContactFormData) {
  try {
    // Validate input data
    validateContactData(contactData);
    
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...contactData,
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      message: contactData.message.trim(),
      createdAt: serverTimestamp(),
    });
    
    console.log('Contact form saved with ID:', docRef.id);
    
    // Send email notification (fire and forget)
    try {
      await sendContactNotification(contactData);
      console.log('Contact notification email sent');
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // Don't fail the form submission if email fails
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact form:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save contact form: ${error.message}`);
    }
    throw new Error('Failed to save contact form');
  }
}

/**
 * Save order data to Firestore after successful payment
 * @param orderData - The order data including customer info and selected items
 * @returns Promise with the document ID of the saved order
 */
export async function saveOrderAfterPayment(orderData: OrderFormData) {
  try {
    // Validate input data
    validateOrderData(orderData);
    
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      name: orderData.name.trim(),
      email: orderData.email.trim().toLowerCase(),
      message: orderData.message.trim(),
      grade: orderData.grade.trim(),
      subjects: orderData.subjects,
      createdAt: serverTimestamp(),
      status: 'paid',
    });
    
    console.log('Order saved with ID:', docRef.id);
    
    // Send email notification (fire and forget)
    try {
      await sendOrderNotification(orderData);
      console.log('Order notification email sent');
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Don't fail the order submission if email fails
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving order:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save order: ${error.message}`);
    }
    throw new Error('Failed to save order');
  }
}

/**
 * Placeholder function for payment success callback
 * This can be used in PayPal onApprove or other payment success handlers
 */
export function onPaymentSuccess(orderData: OrderFormData) {
  return saveOrderAfterPayment(orderData);
} 
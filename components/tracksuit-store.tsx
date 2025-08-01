'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  tracksuitProducts, 
  getProductsByCategory, 
  calculateTotalPrice, 
  getTotalQuantity,
  MIN_ORDER_QUANTITY,
  MIN_ORDER_AMOUNT
} from '@/lib/tracksuit-data';
import { CartItem, TracksuitOrderData, PayPalPaymentData } from '@/types/form';
import { CheckCircle, ShoppingBag, XCircle, Loader2, Plus, Minus, Trash2, Share2, Users } from 'lucide-react';
import { PayPalButton } from './PayPalButton';
import { saveTracksuitOrder } from '@/lib/firestore';
import { sendCustomerConfirmation } from '@/lib/email';
import { ReferralCreator } from './referral-creator';
import { WhatsAppButton } from './whatsapp-button';

export function TracksuitStore() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    whatsapp: '',
    deliveryAddress: '',
  });
  const [referralCode, setReferralCode] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<PayPalPaymentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeCategory, setActiveCategory] = useState<'kids' | 'ladies' | 'mens'>('kids');

  const totalPrice = calculateTotalPrice(cartItems);
  const totalQuantity = getTotalQuantity(cartItems);
  const canCheckout = totalQuantity >= MIN_ORDER_QUANTITY && totalPrice >= MIN_ORDER_AMOUNT;

  // Get URL parameters for referral code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const addToCart = (product: any, size: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.itemId === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return prev.map(item =>
          item.itemId === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          itemId: product.id,
          itemName: product.name,
          category: product.category,
          image: product.image,
          quantity: 1,
          selectedSize: size,
          price: product.price,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string, size: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.itemId === itemId && item.selectedSize === size)
    ));
  };

  const updateQuantity = (itemId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCartItems(prev => prev.map(item =>
      item.itemId === itemId && item.selectedSize === size
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handlePaymentComplete = (paymentData: PayPalPaymentData) => {
    setPaymentData(paymentData);
    setPaymentCompleted(true);
  };

  const handleSubmit = async () => {
    if (!paymentCompleted) return;
    setIsSubmitting(true);
    
    try {
      const orderData: TracksuitOrderData = {
        name: customerInfo.name,
        email: customerInfo.email,
        whatsapp: customerInfo.whatsapp,
        deliveryAddress: customerInfo.deliveryAddress,
        cartItems,
        totalPrice,
        totalQuantity,
        paymentId: paymentData?.paymentID,
        referralCode: referralCode || undefined,
      };
      
      await saveTracksuitOrder(orderData);
      
      // Send customer confirmation email
      try {
        await sendCustomerConfirmation(orderData);
      } catch (emailError) {
        console.warn('Customer confirmation email failed, but order was saved');
      }
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(generateReferralLink());
      alert('Referral link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  const isFormValid = customerInfo.name.trim() && 
                     customerInfo.email.trim() && 
                     customerInfo.whatsapp.trim() && 
                     customerInfo.deliveryAddress.trim() &&
                     canCheckout;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            🏃‍♂️ Premium Tracksuits
          </h1>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-semibold mb-2">
              High-Quality Branded Tracksuits for Kids, Ladies & Men
            </p>
            <p className="text-base md:text-lg">
              Only <span className="font-bold">$10</span> per tracksuit • Minimum order: <span className="font-bold">3 items</span> • Free shipping!
            </p>
          </div>
        </div>

        {/* Location Note */}
        <div className="mb-6 bg-blue-600 border border-blue-700 rounded-lg p-6 text-center shadow-lg">
          <div className="flex items-center justify-center gap-3 text-white">
            <span className="text-2xl">📍</span>
            <p className="text-lg font-bold">
              Gucci Tracksuits are located in Durban, South Africa and take 3–4 days to arrive in Botswana.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Catalog */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Browse Products
                  </div>
                  <Badge variant="secondary">
                    {totalQuantity} / {MIN_ORDER_QUANTITY} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="kids">Kids</TabsTrigger>
                    <TabsTrigger value="ladies">Ladies</TabsTrigger>
                    <TabsTrigger value="mens">Men</TabsTrigger>
                  </TabsList>
                  
                  {(['kids', 'ladies', 'mens'] as const).map(category => (
                    <TabsContent key={category} value={category} className="mt-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {getProductsByCategory(category).map((product) => (
                          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105">
                            <div className="aspect-square bg-gray-100 relative group">
                              <img
                                src={`/images/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.style.display = 'flex';
                                }}
                              />
                              <div className="hidden absolute inset-0 bg-gray-200 items-center justify-center">
                                <span className="text-gray-500 text-xs text-center px-2">Image not available</span>
                              </div>
                              
                              {/* Product Number Badge */}
                              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md">
                                #{product.image.split('/').pop()?.replace('.png', '')}
                              </div>
                              
                              {/* Price Badge */}
                              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                                ${product.price}
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                              <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>
                              
                              <div className="space-y-2">
                                <Select onValueChange={(size) => addToCart(product, size)}>
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {product.sizes.map(size => (
                                      <SelectItem key={size} value={size}>
                                        {size}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                <Button
                                  size="sm"
                                  className="w-full h-8 text-xs"
                                  onClick={() => {
                                    const defaultSize = product.sizes[0];
                                    addToCart(product, defaultSize);
                                  }}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add to Cart
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {/* Category Summary */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">
                          {category.charAt(0).toUpperCase() + category.slice(1)} Collection
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {getProductsByCategory(category).length} tracksuits available • All priced at $10 each
                        </p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart & Checkout */}
          <div className="space-y-6">
            {/* Shopping Cart */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    {cartItems.map((item, index) => (
                      <div key={`${item.itemId}-${item.selectedSize}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={`/images/${item.image}`}
                          alt={item.itemName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.itemName}</p>
                          <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                          <p className="text-xs text-gray-500">${item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.itemId, item.selectedSize, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.itemId, item.selectedSize, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.itemId, item.selectedSize)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Items: {totalQuantity}</span>
                        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                      </div>
                      {totalQuantity < MIN_ORDER_QUANTITY && (
                        <p className="text-red-600 text-sm">
                          Minimum {MIN_ORDER_QUANTITY} items required
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={customerInfo.whatsapp}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="Enter your WhatsApp number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={customerInfo.deliveryAddress}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    required
                  />
                </div>
                {/* Referral Code Input - Temporarily Disabled
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral Code (Optional)
                  </label>
                  <Input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code if you have one"
                  />
                </div>
                */}
              </CardContent>
            </Card>

            {/* Checkout */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Total ({totalQuantity} items):</span>
                    <span className="text-xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                  {!canCheckout && (
                    <p className="text-red-600 text-sm">
                      Minimum order: {MIN_ORDER_QUANTITY} items (${MIN_ORDER_AMOUNT})
                    </p>
                  )}
                </div>

                {canCheckout && isFormValid && (
                  <PayPalButton 
                    amount={totalPrice}
                    onPaymentComplete={handlePaymentComplete}
                    disabled={!isFormValid}
                  />
                )}

                {paymentCompleted && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Payment completed! Submit your order below.</span>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!paymentCompleted || isSubmitting || !isFormValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Order'
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Order submitted successfully!</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <XCircle className="w-5 h-5" />
                    <span>Error submitting order. Please try again.</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referral System - Temporarily Disabled */}
            {/* 
            {referralCode && (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Referral Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Share this link with friends and earn $100 for each completed order!
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={generateReferralLink()}
                      readOnly
                      className="text-sm"
                    />
                    <Button size="sm" onClick={copyReferralLink}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <ReferralCreator />
            */}
          </div>
        </div>
      </div>
      
      {/* WhatsApp Support Button */}
      <WhatsAppButton 
        phoneNumber="26777746888" // Business WhatsApp number
        message="Hi! I have a question about your tracksuits. Can you help me?"
      />
    </div>
  );
} 
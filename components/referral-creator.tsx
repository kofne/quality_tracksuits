'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Share2, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { createReferralCode } from '@/lib/firestore';

export function ReferralCreator() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCreateReferral = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Please enter both name and email');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const result = await createReferralCode(email, name);
      if (result.success) {
        setReferralCode(result.referralCode);
      } else {
        setError('Failed to create referral code');
      }
    } catch (error) {
      console.error('Error creating referral code:', error);
      setError('Failed to create referral code. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const generateReferralLink = () => {
    if (!referralCode) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(generateReferralLink());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
      setError('Failed to copy link to clipboard');
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
              Create Your Referral Code
            </CardTitle>
          </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Create a referral code and earn $100 for each friend who completes an order using your link!
        </p>

        {!referralCode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
                <Input
                type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                  required
                />
              </div>
            <Button
              onClick={handleCreateReferral}
              disabled={isCreating || !name.trim() || !email.trim()}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Referral Code
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Referral Code Created!</span>
              </div>
              <p className="text-sm text-green-700">
                Your referral code: <Badge variant="secondary" className="ml-1">{referralCode}</Badge>
              </p>
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Referral Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={generateReferralLink()}
                  readOnly
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={copyReferralLink}
                  variant={isCopied ? "default" : "outline"}
                >
                  {isCopied ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {isCopied && (
                <p className="text-sm text-green-600 mt-1">Link copied to clipboard!</p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Share your referral link with friends</li>
                <li>• When they complete an order (25+ items), you earn $100</li>
                <li>• Track your earnings in your account</li>
                <li>• No limit on how many friends you can refer!</li>
              </ul>
              </div>

              <Button
              variant="outline"
              onClick={() => {
                setReferralCode('');
                setName('');
                setEmail('');
              }}
              className="w-full"
            >
              Create Another Code
                    </Button>
              </div>
            )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
              </div>
            )}
          </CardContent>
        </Card>
  );
}

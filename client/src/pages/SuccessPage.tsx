import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

export function SuccessPage() {
  useEffect(() => {
    // Clear any remaining cart data
    localStorage.removeItem('quickshop-cart');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
            <Package className="w-5 h-5" />
            <span className="font-medium">Order Confirmation</span>
          </div>
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your email address with order details and tracking information.
          </p>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 font-medium">What's next?</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• Your order will be processed within 1-2 business days</li>
            <li>• You'll get tracking information once shipped</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Link
            to="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          
          <p className="text-xs text-gray-500">
            Need help? Contact our support team anytime
          </p>
        </div>
      </div>
    </div>
  );
}
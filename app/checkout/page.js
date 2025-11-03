'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Home, ArrowLeft, Calendar, Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import StripePaymentForm from './components/StripePaymentForm';
import { calculateBookingPrice } from '@/lib/pricing-calculator';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get booking details from URL
  const propertyId = searchParams.get('propertyId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = parseInt(searchParams.get('adults') || '2');
  const children = parseInt(searchParams.get('children') || '0');
  const infants = parseInt(searchParams.get('infants') || '0');

  const [property, setProperty] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calculatedPricing, setCalculatedPricing] = useState(null);
  
  // Payment Intent state
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [creatingPaymentIntent, setCreatingPaymentIntent] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    marketingConsent: false,
    termsAccepted: false
  });

  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Guest Details, 2: Payment

  useEffect(() => {
    if (propertyId && checkIn && checkOut) {
      fetchPropertyAndPricing();
    } else {
      setError('Missing booking details. Please start from property page.');
      setLoading(false);
    }
  }, [propertyId, checkIn, checkOut]);

  async function fetchPropertyAndPricing() {
    try {
      // Fetch property details
      const propRes = await fetch(`/api/properties/${propertyId}`);
      const propData = await propRes.json();
      setProperty(propData.property);

      // Fetch pricing
      const pricingRes = await fetch(`/api/availability/${propertyId}?from=${checkIn}&to=${checkOut}`);
      const pricingData = await pricingRes.json();
      setPricing(pricingData.pricing);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleGuestDetailsSubmit = async (e) => {
    e.preventDefault();
    
    // Validate terms acceptance
    if (!formData.termsAccepted) {
      setError('Please accept the Terms & Conditions to proceed.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate phone format (basic check)
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setCreatingPaymentIntent(true);

    try {
      // Create Payment Intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          checkIn,
          checkOut,
          adults,
          children,
          infants,
          guestName: `${formData.firstName} ${formData.lastName}`,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          accommodationTotal: pricing?.total || 0,
          cleaningFee: property?.fees?.find(f => 
            f.attributes?.name?.toLowerCase().includes('cleaning')
          )?.attributes?.amount || 50,
          marketingConsent: formData.marketingConsent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to initialize payment');
      }

      console.log('✅ Payment Intent created:', result.paymentIntentId);

      // Store client secret and booking ID
      setClientSecret(result.clientSecret);
      setPaymentIntentId(result.paymentIntentId);
      setBookingId(result.bookingId);

      // Move to payment step
      setCurrentStep(2);

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      setError(error.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setCreatingPaymentIntent(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('🎉 Payment successful:', paymentIntent.id);
    
    // Redirect to success page
    const successParams = new URLSearchParams({
      bookingId,
      paymentIntentId: paymentIntent.id,
      propertyId,
      property: property?.name || 'Your Booking'
    });
    
    router.push(`/booking/success?${successParams.toString()}`);
  };

  const handlePaymentError = (error) => {
    console.error('💳 Payment error:', error);
    setError(error.message || 'Payment failed. Please try again.');
    
    // Optionally redirect to failure page
    // router.push(`/booking/failure?error=${encodeURIComponent(error.message)}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl mb-4">{error}</h1>
          <Link href="/stay">
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const currency = pricing?.currency || property?.currency || 'CHF';
  const accommodationTotal = pricing?.total || 0;
  
  // Get cleaning fee from property
  const cleaningFee = property?.fees?.find(f => 
    f.attributes?.label === 'cleaning_fee' && f.attributes?.enabled === true
  )?.attributes?.amount || 0;
  
  // Calculate pricing using the new calculator with property fees and taxes
  let calculatedPricing = null;
  if (property && accommodationTotal > 0) {
    try {
      calculatedPricing = calculateBookingPrice({
        accommodationTotal,
        cleaningFee,
        nights,
        adults,
        children,
        infants,
        propertyFees: property.fees || [],
        propertyTaxes: property.taxes || []
      });
    } catch (error) {
      console.error('Error calculating pricing:', error);
    }
  }
  
  // Use calculated values or fallback
  const subtotal = calculatedPricing?.subtotal || (accommodationTotal + cleaningFee);
  const totalTax = calculatedPricing?.totalTax || 0;
  const grandTotal = calculatedPricing?.grandTotal || subtotal;
  const totalGuests = adults + children + infants;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {creatingPaymentIntent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
            <h3 className="text-xl font-medium mb-2">Initializing Payment</h3>
            <p className="text-gray-600">Please wait while we prepare your secure payment...</p>
            <p className="text-sm text-gray-500 mt-4">Do not close or refresh this page</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6" />
              <span className="text-xl font-light">Swiss Alpine Journey</span>
            </Link>
            
            <Link href={`/property/${propertyId}`} className="flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4" />
              Back to property
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-light mb-8">Complete Your Booking</h1>
        
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-300'}`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <span className="font-medium">Guest Details</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Guest Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-light mb-6">Contact Information</h2>
                
                <form onSubmit={handleGuestDetailsSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                {/* Marketing Consent */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="marketingConsent"
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, marketingConsent: checked }))
                    }
                  />
                  <label htmlFor="marketingConsent" className="text-sm text-gray-700 cursor-pointer">
                    I would like to receive updates, special offers, and news from Swiss Alpine Journey
                  </label>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
                  <Checkbox
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, termsAccepted: checked }))
                    }
                  />
                  <label htmlFor="termsAccepted" className="text-sm text-gray-700 cursor-pointer">
                    I agree to the <Link href="/terms" className="text-blue-600 underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link> *
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={creatingPaymentIntent || !formData.termsAccepted}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg disabled:bg-gray-300"
                >
                  {creatingPaymentIntent ? 'Loading...' : 'Continue to Payment'}
                </Button>
              </form>
            </div>
            )}

            {/* Step 2: Payment with Stripe */}
            {currentStep === 2 && clientSecret && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-light">Payment</h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Edit Details
                  </button>
                </div>

                {/* Guest Info Summary */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Booking for:</strong> {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{formData.email}</p>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    amount={grandTotal}
                    currency={currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    guestName={`${formData.firstName} ${formData.lastName}`}
                    guestEmail={formData.email}
                  />
                </Elements>
              </div>
            )}

            {/* Cancellation Policy (always visible) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-light mb-4">Cancellation Policy</h2>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-gray-700 mb-2">
                    <strong>Free cancellation within 48 hours</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Cancel your booking within 48 hours of confirmation for a full refund. 
                    After 48 hours, cancellation fees may apply.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-light mb-6">Booking Summary</h2>

              {/* Property Image and Name */}
              <div className="mb-6">
                <img
                  src={property?.photos[0]?.url || '/placeholder.jpg'}
                  alt={property?.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium">{property?.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {property?.address?.city}, {property?.address?.state}
                </p>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Dates</p>
                    <p className="text-sm text-gray-600">
                      {new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500">{nights} night{nights > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Guests</p>
                    <p className="text-sm text-gray-600">
                      {adults} Adult{adults > 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}, {infants} Infant{infants !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {currency} {pricing?.averageRate || 0} x {nights} night{nights > 1 ? 's' : ''}
                  </span>
                  <span className="font-medium">{currency} {accommodationTotal}</span>
                </div>

                {cleaningFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Cleaning fee</span>
                    <span className="font-medium">{currency} {cleaningFee}</span>
                  </div>
                )}

                {calculatedPricing?.extraGuestFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      Extra guest fee
                      <span className="text-xs text-gray-500 block">
                        ({calculatedPricing.guests} guests)
                      </span>
                    </span>
                    <span className="font-medium">{currency} {calculatedPricing.extraGuestFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-medium">{currency} {subtotal}</span>
                </div>

                {/* Dynamic Tax Breakdown */}
                {calculatedPricing?.taxes && calculatedPricing.taxes.length > 0 ? (
                  calculatedPricing.taxes.map((tax, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {tax.name}
                        {tax.type === 'percentage' && ` (${tax.rate}%)`}
                        {tax.type === 'per_person_per_night' && (
                          <span className="text-xs text-gray-500 block">
                            ({tax.guests} guests × {tax.nights} nights × {currency} {tax.rate})
                          </span>
                        )}
                        {tax.type === 'per_night' && (
                          <span className="text-xs text-gray-500 block">
                            ({tax.nights} nights × {currency} {tax.rate})
                          </span>
                        )}
                      </span>
                      <span className="font-medium">{currency} {tax.amount}</span>
                    </div>
                  ))
                ) : (
                  totalTax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Taxes</span>
                      <span className="font-medium">{currency} {totalTax}</span>
                    </div>
                  )
                )}

                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-medium text-lg">Total</span>
                  <span className="font-medium text-lg">{currency} {grandTotal}</span>
                </div>
              </div>

              {pricing?.useFallback && (
                <p className="text-xs text-yellow-700 mt-4">
                  ⚠️ Price subject to confirmation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

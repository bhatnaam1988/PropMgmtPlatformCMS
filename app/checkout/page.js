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

  const handleSubmit = async (e) => {
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

    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        propertyId,
        checkIn,
        checkOut,
        adults,
        children,
        infants,
        guestName: `${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        marketingConsent: formData.marketingConsent,
        notes: `Booking from Swiss Alpine Journey website. Adults: ${adults}, Children: ${children}, Infants: ${infants}`
      };

      console.log('📋 BOOKING DATA TO BE SENT:', bookingData);

      // Show confirmation alert with all details including price
      const confirmBooking = confirm(`
🧪 FINAL CONFIRMATION BEFORE BOOKING

Property: ${property?.name}
Location: ${property?.address?.city}, ${property?.address?.state}

Check-in: ${checkIn}
Check-out: ${checkOut}
Nights: ${nights}

Guests:
- ${adults} Adult${adults > 1 ? 's' : ''}
- ${children} Child${children !== 1 ? 'ren' : ''}
- ${infants} Infant${infants !== 1 ? 's' : ''}

Guest Details:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}

PRICE BREAKDOWN:
- Accommodation: ${currency} ${accommodationTotal}
- Cleaning Fee: ${currency} ${cleaningFee}
- Taxes (${taxRate}%): ${currency} ${taxAmount}
- TOTAL: ${currency} ${grandTotal}

⚠️ This will create a REAL booking in Uplisting!
Click OK to proceed to payment, or Cancel to abort.
      `);

      if (!confirmBooking) {
        setSubmitting(false);
        return;
      }

      // Create the booking in Uplisting
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create booking');
      }

      console.log('✅ BOOKING CREATED:', result);

      // Redirect to Uplisting payment page
      if (result.paymentUrl) {
        console.log('🔗 Redirecting to Uplisting payment:', result.paymentUrl);
        window.location.href = result.paymentUrl;
      } else if (result.booking?.data?.attributes?.uplisting_url) {
        console.log('🔗 Redirecting to Uplisting URL:', result.booking.data.attributes.uplisting_url);
        window.location.href = result.booking.data.attributes.uplisting_url;
      } else {
        // If no payment URL is provided, this might be a booking that doesn't require payment
        // Redirect to success page
        console.log('✅ No payment required, redirecting to success');
        const successParams = new URLSearchParams({
          bookingId: result.bookingId || result.booking?.data?.id || 'pending',
          propertyId,
          property: property?.name || 'Your Booking'
        });
        router.push(`/booking/success?${successParams.toString()}`);
      }
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      setError(error.message || 'Failed to create booking. Please check your connection and try again.');
      setSubmitting(false);
    }
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
    f.attributes?.name?.toLowerCase().includes('cleaning')
  )?.attributes?.amount || 50;
  
  // Get tax rate
  const taxRate = property?.taxes?.reduce((sum, tax) => 
    sum + (parseFloat(tax.attributes?.percentage) || 0), 0
  ) || 0;
  
  const subtotal = accommodationTotal + cleaningFee;
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const grandTotal = subtotal + taxAmount;
  const totalGuests = adults + children + infants;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
            <h3 className="text-xl font-medium mb-2">Processing Your Booking</h3>
            <p className="text-gray-600">Please wait while we create your reservation...</p>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-light mb-6">Contact Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={submitting || !formData.termsAccepted}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg disabled:bg-gray-300"
                >
                  {submitting ? 'Processing...' : `Confirm and Pay ${currency} ${grandTotal}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to Uplisting's secure payment page
                </p>
              </form>
            </div>

            {/* Cancellation Policy */}
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

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Cleaning fee</span>
                  <span className="font-medium">{currency} {cleaningFee}</span>
                </div>

                {taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Taxes ({taxRate}%)</span>
                    <span className="font-medium">{currency} {taxAmount}</span>
                  </div>
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

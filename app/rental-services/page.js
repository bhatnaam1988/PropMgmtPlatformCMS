'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Home, Calendar, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function RentalServices() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    propertyType: '',
    bedrooms: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required';
    if (!formData.propertyType.trim()) newErrors.propertyType = 'Property type is required';
    if (!formData.bedrooms.trim()) newErrors.bedrooms = 'Number of bedrooms is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/forms/rental-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Inquiry submitted! Our team will contact you within 48 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyAddress: '',
          propertyType: '',
          bedrooms: '',
          message: ''
        });
        setErrors({});
      } else {
        toast.error(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: <Home className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Listing Optimization",
      description: "We create and manage professional listings on major booking platforms to maximize your property's visibility"
    },
    {
      icon: <ClipboardCheck className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Cleaning Coordination",
      description: "Reliable turnover cleaning management to keep your property guest-ready between bookings"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Booking Management",
      description: "Calendar synchronization and booking oversight across all platforms to prevent double bookings"
    }
  ];

  const benefits = [
    {
      title: "Increased Booking Potential",
      description: "Professional listings and strategic improvements help attract more guests and justify premium rates"
    },
    {
      title: "Local Expertise",
      description: "We understand what works in the local market and know how to make your property stand out"
    },
    {
      title: "Streamlined Operations",
      description: "Coordinated cleaning and reliable service partners mean less hassle and better guest experiences"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[280px] bg-muted flex items-center justify-center" aria-labelledby="hero-heading">
        <img
          src="https://images.unsplash.com/photo-1691027599401-a8de556be41b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMG1vdW50YWluJTIwY2hhbGV0fGVufDF8fHx8MTc2MTM5OTUyNnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Swiss Alpine rental property with mountain views"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 id="hero-heading" className="mb-3">Rental Listing Services</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base">
            Professional listing optimization, property improvements, and cleaning coordination to help your vacation rental succeed.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-background" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <h2 id="services-heading" className="sr-only">Our Rental Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    {service.icon}
                    <h3 className="text-base">{service.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="pt-8 pb-12 bg-muted" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-4">
          <h2 id="benefits-heading" className="mb-6">Why Partner With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <article key={index} className="bg-background p-4 rounded-lg border border-border">
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-background" aria-labelledby="form-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 id="form-heading" className="mb-2">Get Started</h2>
              <p className="text-muted-foreground">
                Tell us about your property and we'll contact you within 48 hours to discuss how we can help maximize your rental income.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Rental services inquiry form">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && <span id="name-error" className="text-sm text-red-600" role="alert">{errors.name}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && <span id="email-error" className="text-sm text-red-600" role="alert">{errors.email}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      {errors.phone && <span id="phone-error" className="text-sm text-red-600" role="alert">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="propertyAddress">Property Address <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.propertyAddress ? 'true' : 'false'}
                        aria-describedby={errors.propertyAddress ? 'propertyAddress-error' : undefined}
                      />
                      {errors.propertyAddress && <span id="propertyAddress-error" className="text-sm text-red-600" role="alert">{errors.propertyAddress}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="propertyType">Property Type <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="propertyType"
                        placeholder="e.g., Apartment, Chalet, Studio"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.propertyType ? 'true' : 'false'}
                        aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
                      />
                      {errors.propertyType && <span id="propertyType-error" className="text-sm text-red-600" role="alert">{errors.propertyType}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bedrooms">Number of Bedrooms <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.bedrooms ? 'true' : 'false'}
                        aria-describedby={errors.bedrooms ? 'bedrooms-error' : undefined}
                      />
                      {errors.bedrooms && <span id="bedrooms-error" className="text-sm text-red-600" role="alert">{errors.bedrooms}</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Tell Us About Your Property</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Share details about your property, amenities, current rental status, and what services you're interested in"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      aria-describedby="message-help"
                    />
                    <p id="message-help" className="text-sm text-muted-foreground">Optional: Help us understand your property better</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function CleaningServices() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    serviceType: '',
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
    if (!formData.serviceType.trim()) newErrors.serviceType = 'Service type is required';
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
      const response = await fetch('/api/forms/cleaning-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Request submitted! We\'ll contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyAddress: '',
          serviceType: '',
          message: ''
        });
        setErrors({});
      } else {
        toast.error(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: <Clock className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Turnover Service",
      description: "Quick and efficient cleaning between guest stays to maintain your schedule"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Quality Guarantee",
      description: "Professional standards with detailed checklists and quality inspections"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Flexible Scheduling",
      description: "Book one-time services or set up recurring cleaning schedules"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[280px] bg-muted flex items-center justify-center" aria-labelledby="hero-heading">
        <img
          src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBob21lfGVufDF8fHx8MTc1OTM3ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Professional cleaning service team working in a modern home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 id="hero-heading" className="mb-3">Professional Cleaning Services</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base">
            Keep your Alpine property pristine with our trusted cleaning team. Professional, reliable service that maintains the quality your guests expect.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-background" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <h2 id="services-heading" className="sr-only">Our Cleaning Services</h2>
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

      {/* Why Choose Us */}
      <section className="pt-8 pb-12 bg-muted" aria-labelledby="why-choose-heading">
        <div className="container mx-auto px-4">
          <h2 id="why-choose-heading" className="mb-6">Why Property Owners Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="bg-background p-4 rounded-lg border border-border">
              <h3 className="mb-2">Local Expertise</h3>
              <p className="text-sm text-muted-foreground">
                Based nearby, we understand the area, your property's needs, and how to keep things running smoothly between guests.
              </p>
            </article>
            <article className="bg-background p-4 rounded-lg border border-border">
              <h3 className="mb-2">Quick Turnaround Times</h3>
              <p className="text-sm text-muted-foreground">
                Same-day and intra-weekly turnovers are available to maximize your booking potential.
              </p>
            </article>
            <article className="bg-background p-4 rounded-lg border border-border">
              <h3 className="mb-2">Inventory Management</h3>
              <p className="text-sm text-muted-foreground">
                We track supplies and report maintenance issues to ensure your listing is always guest-ready.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-background" aria-labelledby="form-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 id="form-heading" className="mb-2">Request Cleaning Services</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours with a customized quote.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Cleaning services request form">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="serviceType">Service Type <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="serviceType"
                        placeholder="e.g., Turnover, Deep Clean, Recurring"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.serviceType ? 'true' : 'false'}
                        aria-describedby={errors.serviceType ? 'serviceType-error' : undefined}
                      />
                      {errors.serviceType && <span id="serviceType-error" className="text-sm text-red-600" role="alert">{errors.serviceType}</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Additional Details</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your property size, specific needs, frequency, etc."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      aria-describedby="message-help"
                    />
                    <p id="message-help" className="text-sm text-muted-foreground">Optional: Share any specific requirements or concerns</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-black" 
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
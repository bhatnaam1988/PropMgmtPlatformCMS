'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function CleaningServicesClient({ content }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    serviceType: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/forms/cleaning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert('Request submitted! We\'ll contact you within 24 hours.');
        setFormData({ name: '', email: '', phone: '', propertyAddress: '', serviceType: '', message: '' });
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      alert('Failed to submit. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="page-no-hero min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${content.heroSection.backgroundImage?.asset?.url || content.heroSection.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-white mb-6">{content.heroSection.heading}</h1>
            <p className="text-xl text-white/90">{content.heroSection.description}</p>
          </div>
        </div>
      </section>

      {/* Services Grid - Display 3 items in one row */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.servicesGrid.services.slice(0, 3).map((service, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-8">
                  <Sparkles className="h-10 w-10 text-primary mb-4 mx-auto" />
                  <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">{content.benefitsSection?.heading || 'Why Choose Our Cleaning Service'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {content.benefitsSection?.benefits?.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="mb-4">{content.formSection.heading}</h2>
            <p className="text-muted-foreground">{content.formSection.description}</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="propertyAddress">Property Address *</Label>
                  <Input id="propertyAddress" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} placeholder="e.g., Turnover Cleaning" required />
                </div>
                <div>
                  <Label htmlFor="message">Additional Details</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} />
                </div>
                <Button type="submit" className="w-full">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

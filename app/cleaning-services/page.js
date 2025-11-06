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

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Request submitted! We\'ll contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyAddress: '',
      serviceType: '',
      message: ''
    });
  };

  const services = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Turnover Service",
      description: "Quick and efficient cleaning between guest stays to maintain your schedule"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Quality Guarantee",
      description: "Professional standards with detailed checklists and quality inspections"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Flexible Scheduling",
      description: "Book one-time services or set up recurring cleaning schedules"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[280px] bg-muted flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjBob21lfGVufDF8fHx8MTc1OTM3ODgzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Professional cleaning service"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="mb-3">Professional Cleaning Services</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base">
            Keep your Alpine property pristine with our trusted cleaning team. Professional, reliable service that maintains the quality your guests expect.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
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
      <section className="pt-8 pb-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="mb-6">Why Property Owners Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-4 rounded-lg border border-border">
              <h3 className="mb-2">Local Expertise</h3>
              <p className="text-sm text-muted-foreground">
                Based nearby, we understand the area, your property's needs, and how to keep things running smoothly between guests.
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg border border-border">
              <h3 className="mb-2">Quick Turnaround Times</h3>
              <p className="text-sm text-muted-foreground">
                Same-day and intra-weekly turnovers are available to maximize your booking potential.
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg border border-border">
              <h3 className="mb-2">Inventory Management</h3>
              <p className="text-sm text-muted-foreground">
                We track supplies and report maintenance issues to ensure your listing is always guest-ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="mb-2">Request Cleaning Services</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours with a customized quote.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="propertyAddress">Property Address *</Label>
                      <Input
                        id="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="serviceType">Service Type *</Label>
                      <Input
                        id="serviceType"
                        placeholder="e.g., Turnover, Deep Clean, Recurring"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        required
                      />
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
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Request
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

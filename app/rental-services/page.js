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

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  const services = [
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: "Listing Optimization",
      description: "We create and manage professional listings on major booking platforms to maximize your property's visibility"
    },
    {
      icon: <ClipboardCheck className="h-8 w-8 text-primary" />,
      title: "Cleaning Coordination",
      description: "Reliable turnover cleaning management to keep your property guest-ready between bookings"
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
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
      <section className="relative h-[280px] bg-muted flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1691027599401-a8de556be41b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2lzcyUyMG1vdW50YWluJTIwY2hhbGV0fGVufDF8fHx8MTc2MTM5OTUyNnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Swiss Alpine rental properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="mb-3">Rental Listing Services</h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base">
            Professional listing optimization, property improvements, and cleaning coordination to help your vacation rental succeed.
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

      {/* Benefits */}
      <section className="pt-8 pb-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="mb-6">Why Partner With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-background p-4 rounded-lg border border-border">
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h2 className="mb-2">Get Started</h2>
              <p className="text-muted-foreground">
                Tell us about your property and we'll contact you within 48 hours to discuss how we can help maximize your rental income.
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Input
                        id="propertyType"
                        placeholder="e.g., Apartment, Chalet, Studio"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bedrooms">Number of Bedrooms *</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        required
                      />
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
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Inquiry
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

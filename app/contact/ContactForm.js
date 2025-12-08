'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MessageCircle, Clock, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export default function ContactForm({ content }) {
  const [formData, setFormData] = useState({
    inquiryType: '',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ReCaptcha hook
  const { executeRecaptcha, isLoading: isVerifying, error: recaptchaError, clearError } = useRecaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    
    // Execute ReCaptcha verification
    const isVerified = await executeRecaptcha('submit_contact');
    
    if (!isVerified) {
      // ReCaptcha verification failed, error is already set in state
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Message sent successfully! We\'ll respond within 24 hours.');
        setFormData({
          inquiryType: '',
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleInquiryTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      inquiryType: value
    }));
  };

  return (
    <div className="page-no-hero min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">{content.heroSection.heading}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.heroSection.description}
          </p>
        </div>

        {/* ReCaptcha Error - Show at top */}
        {recaptchaError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-3xl mx-auto">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-1">Verification Failed</p>
                <p className="text-sm text-red-700 mb-3">{recaptchaError}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { clearError(); document.querySelector('form').requestSubmit(); }}
                    className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/contact"
                    className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Contact Info</h2>
                <div className="space-y-6">
                  {/* Phone - Only render if phone exists */}
                  {content.contactInfo?.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{content.contactInfo.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Email - Only render if email exists */}
                  {content.contactInfo?.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground break-all">{content.contactInfo.email}</p>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp - Only render if whatsapp exists */}
                  {content.contactInfo?.whatsapp && (
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-muted-foreground">{content.contactInfo.whatsapp}</p>
                      </div>
                    </div>
                  )}

                  {/* Response Time - Only render if responseTime exists */}
                  {content.contactInfo?.responseTime && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-muted-foreground">{content.contactInfo.responseTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">{content.formSection.heading}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select 
                      value={formData.inquiryType} 
                      onValueChange={handleInquiryTypeChange}
                      required
                      disabled={isSubmitting || isVerifying}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="booking">Booking Question</SelectItem>
                        <SelectItem value="property">List a Property</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || isVerifying}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || isVerifying}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting || isVerifying}
                      placeholder="+41 XX XXX XX XX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting || isVerifying}
                      placeholder="Brief subject line"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting || isVerifying}
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full md:w-auto" 
                    size="lg"
                    disabled={isSubmitting || isVerifying}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isVerifying ? 'Verifying...' : isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

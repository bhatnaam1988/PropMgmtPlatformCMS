'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Users, Award, Mountain, MapPin, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export default function JobsClient({ content }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  // ReCaptcha hook
  const { executeRecaptcha, isLoading: isVerifying, error: recaptchaError, clearError } = useRecaptcha();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    clearError();
    
    // Execute ReCaptcha verification
    const isVerified = await executeRecaptcha('submit_job_application');
    
    if (!isVerified) {
      // ReCaptcha verification failed, error is already set in state
      setIsSubmitting(false);
      window.scrollTo({ top: document.querySelector('#application-form').offsetTop - 100, behavior: 'smooth' });
      return;
    }
    
    try {
      const response = await fetch('/api/forms/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: 'Application submitted! We\'ll review and contact you soon.' 
        });
        setFormData({ name: '', email: '', phone: '', position: '', message: '' });
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: 'Failed to submit. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitMessage({ 
        type: 'error', 
        text: 'Failed to submit. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const valueIcons = { 0: Heart, 1: Users, 2: Award, 3: Mountain };

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

      {/* Company Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {content.valuesSection.values.map((value, idx) => {
              const Icon = valueIcons[idx] || Heart;
              return (
                <Card key={idx} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-sm">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">{content.openPositionsSection.heading}</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {content.openPositionsSection.positions.map((position, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="mb-2">{position.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {position.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <Button variant="outline" onClick={() => setFormData(prev => ({ ...prev, position: position.title }))}>Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="mb-4">{content.applicationSection.heading}</h2>
            <p className="text-muted-foreground">{content.applicationSection.description}</p>
          </div>
          
          {/* ReCaptcha Error */}
          {recaptchaError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-red-900 mb-1">Verification Failed</p>
                  <p className="text-sm text-red-700 mb-3">{recaptchaError}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { clearError(); handleSubmit(new Event('submit')); }}
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
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      disabled={isSubmitting || isVerifying}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    disabled={isSubmitting || isVerifying}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position Applying For *</Label>
                  <Input 
                    id="position" 
                    name="position" 
                    value={formData.position} 
                    onChange={handleChange} 
                    required 
                    disabled={isSubmitting || isVerifying}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Cover Letter / Why You'd Be Great *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows={6} 
                    required 
                    disabled={isSubmitting || isVerifying}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
                
                {/* Success/Error Message */}
                {submitMessage.text && (
                  <div 
                    className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                      submitMessage.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                    role="alert"
                  >
                    {submitMessage.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    )}
                    <span>{submitMessage.text}</span>
                  </div>
                )}
              </form>
              <p className="text-sm text-muted-foreground text-center mt-4">{content.applicationSection.footerText}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

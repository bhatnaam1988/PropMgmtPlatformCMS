'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, Users, Heart, TrendingUp, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Jobs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    location: '',
    resume: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.resume.trim()) newErrors.resume = 'Resume is required';
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
      const response = await fetch('/api/forms/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Application submitted! We\'ll review your application and be in touch soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          location: '',
          resume: '',
          coverLetter: ''
        });
        setErrors({});
      } else {
        toast.error(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Passion for Quality",
      description: "We take pride in well-kept homes and smooth guest stays — every detail matters."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Team Collaboration",
      description: "You'll work in close contact with a small, supportive team that values trust, clear communication, and respect."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" aria-hidden="true" />,
      title: "Room to Grow",
      description: "As our portfolio expands, we offer new opportunities to take on responsibility and grow with the business."
    }
  ];

  const openPositions = [
    {
      title: "Guest Services Coordinator",
      location: "Remote",
      type: "Full-time",
      description: "Manage guest communications, handle check-ins/check-outs, and provide 24/7 support to ensure seamless stays."
    },
    {
      title: "Marketing Specialist",
      location: "Remote",
      type: "Full-time",
      description: "Manage social media, optimize marketing across platforms"
    },
    {
      title: "Housekeeping",
      location: "Grächen & Surrounding Areas",
      type: "Hourly",
      description: ""
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[280px] bg-muted flex items-center justify-center" aria-labelledby="hero-heading">
        <img
          src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBoaXJpbmd8ZW58MXx8fHwxNzU5NDczMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Professional team collaboration and hiring process"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 id="hero-heading" className="mb-4">Join Our Team</h1>
          <p className="max-w-2xl mx-auto">
            Build your career with Swiss Alpine Journey. We're looking for passionate people who value great hospitality and delivering exceptional guest experiences.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-12 bg-background" aria-labelledby="values-heading">
        <div className="container mx-auto px-4">
          <h2 id="values-heading" className="sr-only">Our Company Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <Card key={index}>
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    {value.icon}
                    <CardTitle className="text-base">{value.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm mt-2">{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="pt-8 pb-12 bg-muted" aria-labelledby="positions-heading">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 id="positions-heading" className="mb-4">Current Openings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openPositions.map((position, index) => (
              <article key={index}>
                <Card className="flex flex-col h-full">
                  <CardHeader className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                      <CardTitle className="text-base">{position.title}</CardTitle>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm">{position.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm">{position.type}</span>
                      </div>
                    </div>
                    {position.description && (
                      <CardDescription className="text-sm">{position.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-background" aria-labelledby="form-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 id="form-heading" className="mb-4">Apply Now</h2>
              <p className="text-muted-foreground">
                Submit your application below. We review all applications and will contact qualified candidates for interviews.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label="Job application form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Label htmlFor="position">Position Applied For <span className="text-red-600" aria-label="required">*</span></Label>
                      <Input
                        id="position"
                        placeholder="e.g., Property Manager"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                        aria-required="true"
                        aria-invalid={errors.position ? 'true' : 'false'}
                        aria-describedby={errors.position ? 'position-error' : undefined}
                      />
                      {errors.position && <span id="position-error" className="text-sm text-red-600" role="alert">{errors.position}</span>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Your Location <span className="text-red-600" aria-label="required">*</span></Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      aria-required="true"
                      aria-invalid={errors.location ? 'true' : 'false'}
                      aria-describedby={errors.location ? 'location-error' : undefined}
                    />
                    {errors.location && <span id="location-error" className="text-sm text-red-600" role="alert">{errors.location}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume / CV <span className="text-red-600" aria-label="required">*</span></Label>
                    <Textarea
                      id="resume"
                      rows={6}
                      placeholder="Paste your resume or provide a link to your LinkedIn profile / online CV"
                      value={formData.resume}
                      onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                      required
                      aria-required="true"
                      aria-invalid={errors.resume ? 'true' : 'false'}
                      aria-describedby={errors.resume ? 'resume-error resume-help' : 'resume-help'}
                    />
                    <p id="resume-help" className="text-sm text-muted-foreground">
                      You can paste your resume text here or include a link to an online version
                    </p>
                    {errors.resume && <span id="resume-error" className="text-sm text-red-600" role="alert">{errors.resume}</span>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      rows={6}
                      placeholder="Tell us why you'd be a great fit for this position and our team"
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      aria-describedby="coverLetter-help"
                    />
                    <p id="coverLetter-help" className="text-sm text-muted-foreground">Optional: Share your motivation and relevant experience</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-muted-foreground">
              <p>
                Don't see the right position? Send us your resume anyway - we're always looking for talented people to join our growing team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
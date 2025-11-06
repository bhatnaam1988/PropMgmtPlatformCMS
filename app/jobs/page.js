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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      } else {
        toast.error(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Passion for Quality",
      description: "We take pride in well-kept homes and smooth guest stays — every detail matters."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Team Collaboration",
      description: "You'll work in close contact with a small, supportive team that values trust, clear communication, and respect."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
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
      <section className="relative h-[280px] bg-muted flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBoaXJpbmd8ZW58MXx8fHwxNzU5NDczMDY0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Join our team"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="mb-4">Join Our Team</h1>
          <p className="max-w-2xl mx-auto">
            Build your career with Swiss Alpine Journey. We're looking for passionate people who value great hospitality and delivering exceptional guest experiences.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
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
      <section className="pt-8 pb-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="mb-4">Current Openings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <Briefcase className="h-5 w-5 text-primary mt-1" />
                    <CardTitle className="text-base">{position.title}</CardTitle>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{position.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{position.type}</span>
                    </div>
                  </div>
                  {position.description && (
                    <CardDescription className="text-sm">{position.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="mb-4">Apply Now</h2>
              <p className="text-muted-foreground">
                Submit your application below. We review all applications and will contact qualified candidates for interviews.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position Applied For *</Label>
                      <Input
                        id="position"
                        placeholder="e.g., Property Manager"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Your Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume / CV *</Label>
                    <Textarea
                      id="resume"
                      rows={6}
                      placeholder="Paste your resume or provide a link to your LinkedIn profile / online CV"
                      value={formData.resume}
                      onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      You can paste your resume text here or include a link to an online version
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      rows={6}
                      placeholder="Tell us why you'd be a great fit for this position and our team"
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Application
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

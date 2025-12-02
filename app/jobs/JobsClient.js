'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Users, Award, Mountain, MapPin, Clock } from 'lucide-react';

export default function JobsClient({ content }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: ''
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
        alert('Application submitted! We\'ll review and contact you soon.');
        setFormData({ name: '', email: '', phone: '', position: '', message: '' });
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
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="mb-4">{content.applicationSection.heading}</h2>
            <p className="text-muted-foreground">{content.applicationSection.description}</p>
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
                  <Label htmlFor="position">Position Applying For *</Label>
                  <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="message">Cover Letter / Why You'd Be Great *</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} required />
                </div>
                <Button type="submit" className="w-full">Submit Application</Button>
              </form>
              <p className="text-sm text-muted-foreground text-center mt-4">{content.applicationSection.footerText}</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

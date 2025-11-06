'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Cookie } from 'lucide-react';

export default function Legal() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to section if hash is present
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [pathname, searchParams]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Legal Information</h1>
          <p className="text-muted-foreground">
            Important legal documents and policies for Swiss Alpine Journey
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="mb-2">Terms & Conditions</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Booking terms and rental conditions
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#terms">Read Terms</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="mb-2">Privacy Policy</h3>
              <p className="text-muted-foreground text-sm mb-4">
                How we protect your personal data
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#privacy">Read Policy</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Cookie className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="mb-2">GDPR Information</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your data rights under GDPR
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#gdpr">Learn More</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Terms & Conditions */}
        <section id="terms" className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6">Terms & Conditions</h2>
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-muted-foreground">
                  <em>Last updated: November 2024</em>
                </p>

                <div>
                  <h3>1. Booking and Reservation</h3>
                  <p>
                    By making a reservation with Swiss Alpine Journey, you agree to these terms and conditions. 
                    All bookings are subject to availability and confirmation. A booking is only confirmed 
                    when you receive written confirmation from us.
                  </p>
                </div>

                <div>
                  <h3>2. Payment Terms</h3>
                  <p>
                    A deposit of 30% of the total booking value is required to secure your reservation. 
                    The remaining balance must be paid 30 days before your arrival date. 
                    Payment can be made by bank transfer or major credit cards.
                  </p>
                </div>

                <div>
                  <h3>3. Cancellation Policy</h3>
                  <ul>
                    <li>Free cancellation up to 48 hours before check-in</li>
                    <li>Cancellations within 48 hours: 50% of booking value retained</li>
                    <li>No-shows: 100% of booking value retained</li>
                    <li>Different policies may apply during peak seasons</li>
                  </ul>
                </div>

                <div>
                  <h3>4. Check-in and Check-out</h3>
                  <p>
                    Check-in time is between 15:00 and 19:00. Check-out time is 10:00. 
                    Late check-in or early check-out can be arranged with advance notice 
                    and may incur additional charges.
                  </p>
                </div>

                <div>
                  <h3>5. Property Usage</h3>
                  <p>
                    Properties must be used respectfully and in accordance with local regulations. 
                    Smoking is prohibited in all properties. Parties and events are not permitted 
                    unless specifically agreed upon. Maximum occupancy must not be exceeded.
                  </p>
                </div>

                <div>
                  <h3>6. Liability</h3>
                  <p>
                    Guests are responsible for any damage to the property during their stay. 
                    We recommend travel insurance. Swiss Alpine Journey cannot be held liable for 
                    personal injury, loss, or damage to personal belongings.
                  </p>
                </div>

                <div>
                  <h3>7. Force Majeure</h3>
                  <p>
                    In cases of events beyond our control (natural disasters, government restrictions, etc.), 
                    we will work with guests to find alternative solutions or provide refunds as appropriate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6">Privacy Policy</h2>
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-muted-foreground">
                  <em>Last updated: November 2024</em>
                </p>

                <div>
                  <h3>1. Information We Collect</h3>
                  <p>We collect information necessary to provide our accommodation services:</p>
                  <ul>
                    <li>Personal details (name, address, contact information)</li>
                    <li>Booking preferences and special requirements</li>
                    <li>Payment information (processed securely through third parties)</li>
                    <li>Communication records for customer service</li>
                  </ul>
                </div>

                <div>
                  <h3>2. How We Use Your Information</h3>
                  <p>Your information is used solely for:</p>
                  <ul>
                    <li>Processing and managing your booking</li>
                    <li>Providing customer support</li>
                    <li>Sending booking confirmations and important updates</li>
                    <li>Improving our services (with anonymized data)</li>
                  </ul>
                </div>

                <div>
                  <h3>3. Information Sharing</h3>
                  <p>
                    We do not sell or share your personal information with third parties, 
                    except as required for service delivery (payment processing, cleaning services) 
                    or as required by law.
                  </p>
                </div>

                <div>
                  <h3>4. Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational measures to protect 
                    your personal data against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h3>5. Your Rights</h3>
                  <p>Under GDPR, you have the right to:</p>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to data processing</li>
                    <li>Data portability</li>
                  </ul>
                </div>

                <div>
                  <h3>6. Contact Information</h3>
                  <p>
                    For any privacy-related questions, contact us at: 
                    <strong> privacy@swissalpinejourney.com</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* GDPR Information */}
        <section id="gdpr" className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6">GDPR Information</h2>
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-muted-foreground">
                  <em>Your rights under the General Data Protection Regulation</em>
                </p>

                <div>
                  <h3>Your Data Protection Rights</h3>
                  <p>
                    As a data subject under GDPR, you have several rights regarding your personal data. 
                    We are committed to facilitating the exercise of these rights.
                  </p>
                </div>

                <div>
                  <h3>Right to Access</h3>
                  <p>
                    You can request a copy of all personal data we hold about you. 
                    We will provide this information within 30 days of your request.
                  </p>
                </div>

                <div>
                  <h3>Right to Rectification</h3>
                  <p>
                    If any of your personal data is inaccurate or incomplete, 
                    you have the right to have it corrected or completed.
                  </p>
                </div>

                <div>
                  <h3>Right to Erasure ('Right to be Forgotten')</h3>
                  <p>
                    You can request the deletion of your personal data, subject to certain conditions 
                    such as legal obligations to retain records.
                  </p>
                </div>

                <div>
                  <h3>Right to Restrict Processing</h3>
                  <p>
                    You can request that we limit the processing of your personal data 
                    in certain circumstances.
                  </p>
                </div>

                <div>
                  <h3>Right to Data Portability</h3>
                  <p>
                    You can request that we transfer your data to another service provider 
                    in a structured, commonly used format.
                  </p>
                </div>

                <div>
                  <h3>Right to Object</h3>
                  <p>
                    You can object to the processing of your personal data for marketing purposes 
                    at any time.
                  </p>
                </div>

                <div>
                  <h3>How to Exercise Your Rights</h3>
                  <p>
                    To exercise any of these rights, please contact us at: 
                    <strong> gdpr@swissalpinejourney.com</strong>
                  </p>
                  <p>
                    We will respond to your request within 30 days. If you are not satisfied 
                    with our response, you have the right to lodge a complaint with the 
                    Swiss Federal Data Protection and Information Commissioner (FDPIC).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t">
          <p className="text-muted-foreground text-sm">
            If you have any questions about these legal documents, please{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contact us
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

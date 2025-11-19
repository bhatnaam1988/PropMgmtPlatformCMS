'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Cookie } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function LegalClient({ content }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
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

  const iconMap = {
    FileText: FileText,
    Shield: Shield,
    Cookie: Cookie
  };

  return (
    <div className="page-no-hero min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="text-center mb-12">
          <h1 className="mb-4">{content.pageHeader?.heading}</h1>
          <p className="text-muted-foreground">{content.pageHeader?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {content.navigationCards?.map((card, index) => {
            const IconComponent = iconMap[card.icon] || FileText;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{card.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={card.anchor}>Read {card.title.split(' ')[0]}</a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Terms Section */}
        <section id="terms" className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6">{content.termsSection?.heading}</h2>
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-muted-foreground">
                  <em>Last updated: {content.termsSection?.lastUpdated}</em>
                </p>
                {content.termsSection?.sections?.map((section, index) => (
                  <div key={index}>
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6">{content.privacySection?.heading}</h2>
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-muted-foreground">
                  <em>Last updated: {content.privacySection?.lastUpdated}</em>
                </p>
                {content.privacySection?.sections?.map((section, index) => (
                  <div key={index}>
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* GDPR Section */}
        <section id="gdpr" className="mb-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6">{content.gdprSection?.heading}</h2>
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-muted-foreground">
                  <em>{content.gdprSection?.description}</em>
                </p>
                {content.gdprSection?.sections?.map((section, index) => (
                  <div key={index}>
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="text-center pt-8 border-t">
          <p className="text-muted-foreground text-sm">
            {content.footerText?.text}{' '}
            <Link href={content.footerText?.linkUrl || '/contact'} className="text-primary hover:underline">
              {content.footerText?.linkText}
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

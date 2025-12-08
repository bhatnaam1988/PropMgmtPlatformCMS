import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import SkipLink from '@/components/SkipLink'
import { getPageMetadata } from '@/lib/metadata'
import { MultipleStructuredData } from '@/components/StructuredData'
import { getOrganizationSchema, getLocalBusinessSchema, getWebSiteSchema } from '@/lib/schemas'
import { RecaptchaProvider } from '@/components/RecaptchaProvider'

export const metadata = getPageMetadata('home')

export default function RootLayout({ children }) {
  // Global schemas that appear on every page
  const globalSchemas = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema(),
  ];

  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical external domains for performance */}
        <link rel="preconnect" href="https://cdn.filestackcontent.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdn.filestackcontent.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <MultipleStructuredData schemas={globalSchemas} />
      </head>
      <body>
        <SkipLink />
        <RecaptchaProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <Footer />
            <Toaster />
          </div>
        </RecaptchaProvider>
      </body>
    </html>
  )
}
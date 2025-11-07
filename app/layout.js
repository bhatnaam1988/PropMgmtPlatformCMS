import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'
import { getPageMetadata } from '@/lib/metadata'
import { MultipleStructuredData } from '@/components/StructuredData'
import { getOrganizationSchema, getLocalBusinessSchema, getWebSiteSchema } from '@/lib/schemas'

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
        <MultipleStructuredData schemas={globalSchemas} />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  )
}
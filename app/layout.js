import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Swiss Alpine Journey - Vacation Rentals in Grächen',
  description: 'Discover authentic Swiss Alpine vacation rentals in Grächen. Quality properties with modern comfort, stunning mountain views, and convenient locations.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
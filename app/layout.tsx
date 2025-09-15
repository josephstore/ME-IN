import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/Toaster'
import { LanguageProvider } from '@/lib/LanguageContext'
import { SimpleAuthProvider } from '@/lib/SimpleAuthContext'
import Navigation from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ME-IN - MiddleEast Influencer Network',
  description: 'Connect Korean brands with Middle Eastern influencers through our AI-powered matching platform',
  keywords: 'influencer marketing, middle east, korean brands, social media, marketing platform',
  authors: [{ name: 'ME-IN Team' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <LanguageProvider>
          <SimpleAuthProvider>
            <Navigation />
            <main>
              {children}
            </main>
            <Toaster />
          </SimpleAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

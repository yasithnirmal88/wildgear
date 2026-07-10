import type { Metadata, Viewport } from 'next'
import './globals.css'
import './fonts.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import JsonLd from '@/components/JsonLd'
import { SpeedInsights } from '@vercel/speed-insights/next'

const siteUrl = 'https://www.wildtrailgear.lk'

export const viewport: Viewport = {
  themeColor: '#1B4332',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Camping & Hiking Gear Rental Sri Lanka | Wild Trail Gear',
    template: '%s | Wild Trail Gear',
  },

  description:
    'Rent quality camping and hiking gear in Sri Lanka. Tents, cooking equipment, trekking accessories and outdoor essentials for your next adventure. Based in Panadura.',

  keywords: [
    'camping gear rental sri lanka',
    'hiking gear sri lanka',
    'outdoor gear sri lanka',
    'camping equipment rental sri lanka',
    'trekking accessories sri lanka',
    'tent rental sri lanka',
    'wild trail gear',
  ],

  authors: [{ name: 'Wild Trail Gear' }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Camping & Hiking Gear Rental Sri Lanka | Wild Trail Gear',
    description: 'Rent tents, camping equipment and hiking essentials in Sri Lanka.',
    url: siteUrl,
    siteName: 'Wild Trail Gear',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/brand-poster.jpeg',
        width: 1200,
        height: 630,
        alt: 'Wild Trail Gear — Camping and Hiking Gear Rental Sri Lanka',
      },
    ],
  },



  twitter: {
    card: 'summary_large_image',
    title: 'Camping & Hiking Gear Rental Sri Lanka | Wild Trail Gear',
    description: 'Rent tents, camping equipment and hiking essentials in Sri Lanka.',
    images: ['/images/brand-poster.jpeg'],
  },

  alternates: {
    canonical: siteUrl,
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <FloatingWA />
        <JsonLd />
        <SpeedInsights />
      </body>
    </html>
  )
}

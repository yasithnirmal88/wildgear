import type { Metadata } from 'next'
import './globals.css'
import './fonts.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'

export const metadata: Metadata = {
  metadataBase: new URL("https://wildtrailgear.lk"),

  title: "Wild Trail Gear | Camping & Hiking Gear Rental in Sri Lanka",

  description:
    "Rent camping tents, hiking backpacks, sleeping bags and outdoor equipment in Sri Lanka.",

  keywords: [
    "camping gear rental sri lanka",
    "hiking gear rental",
    "outdoor gear sri lanka",
    "tent rental",
    "wild trail gear"
  ],

  robots: {
    index: true,
    follow: true,
  },
};

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
      </body>
    </html>
  )
}

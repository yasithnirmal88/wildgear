import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Wild Trail Gear via WhatsApp, phone, or email. Pick up gear from our Panadura location or inquire about delivery. We respond fast.',
  openGraph: {
    title: 'Contact Wild Trail Gear | Camping Gear Rental Sri Lanka',
    description:
      'Message us on WhatsApp, call, or visit our location in Panadura to rent camping and hiking gear in Sri Lanka.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

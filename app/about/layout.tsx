import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Wild Trail Gear is a Panadura-based outdoor gear rental service founded by Keshara Weliwaththa. Trail-tested tents, stoves, and trekking equipment for Sri Lanka.',
  openGraph: {
    title: 'About Wild Trail Gear | Camping & Hiking Gear Rental Sri Lanka',
    description:
      'Founded in 2025 by Keshara Weliwaththa. We rent trail-tested camping and hiking gear from our base in Panadura, Sri Lanka.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}

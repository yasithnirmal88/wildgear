import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gear Detail',
  description:
    'View details, pricing, and availability for individual camping and hiking gear items available for rent in Sri Lanka.',
  openGraph: {
    title: 'Gear Detail | Wild Trail Gear',
    description:
      'Check pricing, variants, and availability for this camping or hiking gear item available for rent in Sri Lanka.',
  },
}

export default function ItemDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}

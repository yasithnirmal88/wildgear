import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rental Catalog',
  description:
    'Browse our full catalog of camping and hiking gear for rent in Sri Lanka. Tents, gas stoves, cooking sets, hammocks, anti-leech socks, and more. Available for daily rental.',
  openGraph: {
    title: 'Gear Rental Catalog | Wild Trail Gear',
    description:
      'Browse tents, stoves, cooking sets, hammocks, and trekking accessories available for daily rental in Sri Lanka.',
  },
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children
}

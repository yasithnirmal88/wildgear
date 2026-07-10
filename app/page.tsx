import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import FeaturedGear from '@/components/home/FeaturedGear'
import WhyRent from '@/components/home/WhyRent'
import Bundles from '@/components/home/Bundles'
import Destinations from '@/components/home/Destinations'
import Testimonials from '@/components/home/Testimonials'
import HomeCTA from '@/components/home/HomeCTA'

export const metadata: Metadata = {
  title: 'Wild Trail Gear: Camping & Hiking Gear Rental Sri Lanka',
  description:
    'Wild Trail Gear: Rent quality camping and hiking gear in Sri Lanka. Tents, cooking equipment, trekking accessories and outdoor essentials for your next adventure. Based in Panadura.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGear />
      <WhyRent />
      <Bundles />
      <Destinations />
      <Testimonials />
      <HomeCTA />
    </>
  )
}


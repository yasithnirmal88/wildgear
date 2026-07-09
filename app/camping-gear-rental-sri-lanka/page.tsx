import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Eyebrow from '@/components/Eyebrow'
import { IconTent, IconCompass, IconBoot, IconWA } from '@/components/Icons'
import { waLink } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Camping Equipment Rental Sri Lanka | Wild Trail Gear',
  description:
    'Rent camping tents, cooking sets, gas stoves and outdoor gear in Sri Lanka. Quality equipment for weekend camping and expeditions. Pick up in Panadura.',
  openGraph: {
    title: 'Camping Equipment Rental Sri Lanka | Wild Trail Gear',
    description:
      'Rent tents, cooking gear, and camping essentials in Sri Lanka. Daily rental from Panadura.',
  },
}

const CAMPING_ITEMS = [
  {
    name: 'Manual Tents',
    image: '/images/products/tent.jpeg',
    desc: 'Spacious tents for 3 to 8 people. Ideal for beach camps, forest stays, and mountain basecamps.',
    variants: '3P / 4P / 6P / 8P',
    price: 'from LKR 500/day',
  },
  {
    name: 'Windproof Gas Stove',
    image: '/images/products/gas-stove.jpeg',
    desc: 'Reliable windproof burner for cooking on the trail. Works with standard gas canisters.',
    variants: 'Single burner',
    price: 'LKR 250/day',
  },
  {
    name: 'Cooking Set',
    image: '/images/products/cooking-set.jpeg',
    desc: 'Complete cookware set with pots, pan, and utensils. Perfect for group camping meals.',
    variants: '4-piece set',
    price: 'LKR 300/day',
  },
  {
    name: 'Water Bag 3L',
    image: '/images/products/water-bag.jpeg',
    desc: 'Durable collapsible water carrier for campsite hydration. Lightweight and easy to pack.',
    variants: '3-litre capacity',
    price: 'LKR 300/day',
  },
]

export default function CampingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pb-28 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-[10%] right-[8%]"><IconTent size={200} color="#F8F5F0" /></div>
          <div className="absolute bottom-[15%] left-[5%]"><IconCompass size={160} color="#F8F5F0" /></div>
        </div>
        <div className="max-w-[900px] mx-auto relative z-10">
          <Eyebrow label="Camping Gear Rental Sri Lanka" light />
          <h1 className="font-black uppercase text-canvas text-[clamp(32px,5vw,72px)] tracking-[-0.03em] leading-[1.05] mt-4 mb-5">
            CAMPING{' '}
            <span className="font-light text-sage-light">Equipment Rental</span>
          </h1>
          <p className="text-canvas/70 text-[17px] md:text-[19px] leading-relaxed max-w-[640px] mb-8">
            Rent quality camping gear in Sri Lanka — from spacious tents to full cooking setups.
            Everything you need for a night under the stars.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-canvas text-forest rounded-btn px-7 py-3.5 text-[15px] font-semibold no-underline hover:opacity-85 transition-opacity"
            >
              Browse All Gear
            </Link>
            <a
              href={waLink("Hi! I'd like to rent camping gear from Wild Trail Gear. Can you help?")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-canvas rounded-btn px-7 py-3.5 text-[15px] font-medium no-underline border-[1.5px] border-canvas/40 hover:border-canvas/80 transition-colors"
            >
              <IconWA size={16} /> Inquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Gear List */}
      <section className="bg-lifted py-20 md:py-28 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <Eyebrow label="Available for Rent" className="justify-center" />
            <h2 className="font-black uppercase text-ink text-[clamp(26px,3.5vw,44px)] tracking-[-0.03em] mt-3">
              Camping{' '}
              <span className="font-light text-sage">Gear We Offer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAMPING_ITEMS.map((item) => (
              <div key={item.name} className="bg-white rounded-card overflow-hidden shadow-sm border border-bone flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={`${item.name} available for camping gear rental in Sri Lanka`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/20 to-transparent" />
                </div>
                <div className="p-5 flex flex-col justify-center flex-1">
                  <div className="text-xs font-bold text-sage uppercase tracking-wider mb-1">{item.variants}</div>
                  <h3 className="text-lg font-bold text-ink mb-1.5">{item.name}</h3>
                  <p className="text-sm text-slate leading-relaxed mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-olive text-canvas text-[13px] font-bold rounded-[10px] px-3 py-1">{item.price}</span>
                    <a
                      href={waLink(`Hi! I'd like to rent a ${item.name}. Can you share availability and pricing?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-forest hover:text-sage transition-colors"
                    >
                      Rent Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-20 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute opacity-[0.05] bottom-[10%] right-[8%] hidden md:block"><IconBoot size={180} color="#F8F5F0" /></div>
        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <Eyebrow label="Ready to Camp?" light className="justify-center" />
          <h2 className="font-black uppercase text-canvas text-[clamp(26px,4vw,52px)] tracking-[-0.03em] leading-none mt-3 mb-5">
            Pack Light.{' '}
            <span className="font-light text-sage-light">Camp Right.</span>
          </h2>
          <p className="text-canvas/65 text-sm md:text-base mb-8 max-w-[500px] mx-auto">
            No need to buy expensive gear. Rent what you need, return it when you&apos;re done.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink("Hi! I'd like to rent camping gear. Can you help me choose the right equipment?")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white rounded-btn px-8 py-4 text-[15px] font-semibold no-underline"
            >
              <IconWA size={16} /> Chat on WhatsApp
            </a>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 text-canvas rounded-btn px-7 py-4 text-[15px] font-medium no-underline border-[1.5px] border-canvas/40 hover:border-canvas/80 transition-colors"
            >
              View Full Catalog
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

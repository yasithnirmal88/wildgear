import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Eyebrow from '@/components/Eyebrow'
import { IconBackpack, IconCompass, IconBoot, IconWA } from '@/components/Icons'
import { waLink } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Hiking Gear Rental Sri Lanka | Wild Trail Gear',
  description:
    'Rent hiking backpacks, trekking accessories, anti-leech socks and hiking essentials in Sri Lanka. Lightweight gear for day hikes and multi-day treks.',
  openGraph: {
    title: 'Hiking Gear Rental Sri Lanka | Wild Trail Gear',
    description:
      'Rent backpacks, trekking accessories, and hiking essentials in Sri Lanka. Daily rental from Panadura.',
  },
}

const HIKING_ITEMS = [
  {
    name: 'Anti Leech Socks',
    image: '/images/products/anti-leech-socks.jpeg',
    desc: 'Essential for Sri Lankan rainforest trails. Durable fabric that keeps leeches out so you can hike with peace of mind.',
    variants: 'One size fits most',
    price: 'LKR 250/day',
  },
  {
    name: 'Hammock',
    image: '/images/products/hammock.jpeg',
    desc: 'Lightweight camping hammock for trail breaks and overnight rests. Packs small, sets up in seconds.',
    variants: 'Single person',
    price: 'LKR 200/day',
  },
  {
    name: 'Water Bag 3L',
    image: '/images/products/water-bag.jpeg',
    desc: 'Collapsible hydration carrier for long hikes. Store extra water without the bulk of multiple bottles.',
    variants: '3-litre capacity',
    price: 'LKR 300/day',
  },
  {
    name: 'Windproof Gas Stove',
    image: '/images/products/gas-stove.jpeg',
    desc: 'Compact stove for hot meals on the trail. Windproof design works reliably in exposed conditions.',
    variants: 'Single burner',
    price: 'LKR 250/day',
  },
]

export default function HikingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 md:pb-28 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute top-[12%] right-[6%]"><IconBackpack size={180} color="#F8F5F0" /></div>
          <div className="absolute bottom-[12%] left-[4%]"><IconCompass size={150} color="#F8F5F0" /></div>
        </div>
        <div className="max-w-[900px] mx-auto relative z-10">
          <Eyebrow label="Hiking Gear Rental Sri Lanka" light />
          <h1 className="font-black uppercase text-canvas text-[clamp(32px,5vw,72px)] tracking-[-0.03em] leading-[1.05] mt-4 mb-5">
            HIKING{' '}
            <span className="font-light text-sage-light">Gear Rental</span>
          </h1>
          <p className="text-canvas/70 text-[17px] md:text-[19px] leading-relaxed max-w-[640px] mb-8">
            Rent lightweight hiking gear and trekking accessories in Sri Lanka.
            From anti-leech socks to hydration gear — be ready for the trail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-canvas text-forest rounded-btn px-7 py-3.5 text-[15px] font-semibold no-underline hover:opacity-85 transition-opacity"
            >
              Browse All Gear
            </Link>
            <a
              href={waLink("Hi! I'd like to rent hiking gear from Wild Trail Gear. Can you help?")}
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
              Hiking{' '}
              <span className="font-light text-sage">Gear We Offer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HIKING_ITEMS.map((item) => (
              <div key={item.name} className="bg-white rounded-card overflow-hidden shadow-sm border border-bone flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={`${item.name} available for hiking gear rental in Sri Lanka`}
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
                      href={waLink(`Hi! I'd like to rent ${item.name}. Can you share availability and pricing?`)}
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
        <div className="absolute opacity-[0.05] bottom-[8%] right-[6%] hidden md:block"><IconBoot size={200} color="#F8F5F0" /></div>
        <div className="max-w-[700px] mx-auto text-center relative z-10">
          <Eyebrow label="Hit the Trail" light className="justify-center" />
          <h2 className="font-black uppercase text-canvas text-[clamp(26px,4vw,52px)] tracking-[-0.03em] leading-none mt-3 mb-5">
            TRAIL READY.{' '}
            <span className="font-light text-sage-light">Zero Compromise.</span>
          </h2>
          <p className="text-canvas/65 text-sm md:text-base mb-8 max-w-[500px] mx-auto">
            No storage hassles. No equipment to maintain. Just show up and hike.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink("Hi! I'd like to rent hiking gear. Can you help me choose the right equipment?")}
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

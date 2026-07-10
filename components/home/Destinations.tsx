'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Eyebrow from '@/components/Eyebrow'
import { IconCompass, IconArrow } from '@/components/Icons'

gsap.registerPlugin(ScrollTrigger)

const DESTINATIONS = [
  {
    name: 'Knuckles Mountain Range',
    image: '/images/hero-bg.jpeg',
    tag: 'Cloud Forest',
    desc: 'Known for misty paths, heavy rain, and leech-prone forests. Requires robust windproof/waterproof gear.',
    gear: 'Anti-Leech Socks, Windproof Gas Stove, 3P/4P Tents',
  },
  {
    name: 'Horton Plains National Park',
    image: '/images/final-hero-bg.jpeg',
    tag: 'High Altitude',
    desc: 'Freezing night temperatures and strong winds. Elevated plains require thermal prep and wind-resistant tents.',
    gear: 'Double-layer Tents, Warm Sleeping Kits, Stoves',
  },
  {
    name: 'Ella & Ohiya Trails',
    image: '/images/camping-eg.webp',
    tag: 'Scenic Ridges',
    desc: 'Gentle climate but steep ascents. Ideal for hammock camping and lightweight backpacking setups.',
    gear: 'Lightweight Hammock, Water Bag 3L, Cooking Set',
  },
]

export default function Destinations() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Header reveal
    gsap.fromTo(
      headerRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 82%',
        },
      }
    )

    // Cards stagger
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.dest-card')
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 78%',
          },
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-canvas py-16 md:py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Compass background decoration */}
      <div className="absolute left-[-8%] top-[10%] opacity-[0.03] pointer-events-none">
        <IconCompass size={360} color="#1B4332" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-10 md:mb-16">
          <Eyebrow label="Explore Sri Lanka" className="justify-center" />
          <h2
            className="font-black uppercase text-ink text-[clamp(28px,3.5vw,48px)] tracking-[-0.03em] mt-3"
          >
            Popular Camping{' '}
            <span className="font-light text-sage">Destinations in Sri Lanka</span>
          </h2>
          <p className="text-base text-slate mt-4 mx-auto max-w-[520px]">
            Plan your next trail adventure. Discover the island&rsquo;s most stunning campgrounds and get equipped with the right gear for each unique terrain.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              className="dest-card bg-white rounded-card overflow-hidden border border-bone shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={dest.image}
                  alt={`${dest.name} camping destination Sri Lanka`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-forest text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {dest.tag}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-ink mb-2">{dest.name}</h3>
                <p className="text-sm text-slate leading-relaxed mb-5 flex-1">{dest.desc}</p>
                <div className="pt-4 border-t border-bone">
                  <div className="text-[10px] font-bold text-sage uppercase tracking-wider mb-1.5">Recommended Equipment</div>
                  <div className="text-[12px] font-semibold text-forest bg-forest/5 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span>{dest.gear}</span>
                    <Link href="/catalog" className="text-forest hover:text-sage transition-colors ml-2">
                      <IconArrow size={12} color="#1B4332" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog/best-camping-places-sri-lanka"
            className="inline-flex items-center gap-2 text-forest hover:text-sage font-bold text-sm transition-colors"
          >
            Read Our Full Camping Destination Guide <IconArrow size={14} color="#1B4332" />
          </Link>
        </div>
      </div>
    </section>
  )
}

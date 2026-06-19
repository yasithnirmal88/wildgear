'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { IconCompass, IconBoot, IconWA, IconArrow } from '@/components/Icons'
import Eyebrow from '@/components/Eyebrow'
import { waLink } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const compassRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    const content = contentRef.current

    if (!section || !bg || !content) return

    // Parallax background — slow, atmospheric
    gsap.to(bg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    // Hero text stagger fade-up — warm morning mist feel
    const children = content.querySelectorAll('.hero-reveal')
    gsap.fromTo(
      children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.18,
        delay: 0.2,
      }
    )

    // Compass slow spin
    if (compassRef.current) {
      gsap.to(compassRef.current, {
        rotation: 360,
        duration: 8,
        ease: 'none',
        repeat: -1,
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col min-h-screen px-6 md:px-[64px] pt-[140px] md:pt-[180px] pb-16 md:pb-[96px]"
    >
      {/* Parallax background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 -top-[20%] -bottom-[20%] overflow-hidden"
      >
        <Image
          src="/images/hero-bg-optimized.jpg"
          alt="Wild Trail Gear mountain landscape with hikers"
          fill
          priority
          className="object-cover" style={{ objectPosition: 'center 10%' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
          quality={100}
        />
      </div>

      {/* Fog overlay top */}
      <div
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_0%,rgba(27,67,50,0.40)_0%,transparent_60%)]"
      />

      {/* Dark scrim bottom — product content below "emerges from landscape" */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] h-[72%] bg-gradient-to-t from-[rgba(14,20,16,0.96)] via-[rgba(14,20,16,0.55)_45%] to-transparent"
      />

      {/* Decorative compass */}
      <div
        ref={compassRef}
        className="absolute z-[1] top-[12%] right-[8%] opacity-10 origin-center hidden md:block"
      >
        <IconCompass size={180} color="#F8F5F0" />
      </div>

      {/* Decorative boot */}
      <div className="absolute z-[1] bottom-[28%] right-[14%] opacity-[0.08] hidden md:block">
        <IconBoot size={120} color="#F8F5F0" />
      </div>

      {/* Ghost watermark — hidden on mobile to prevent overlap */}
      <div
        className="absolute z-[1] pointer-events-none select-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(80px,14vw,220px)] font-extrabold text-[#F8F5F0]/[0.03] tracking-[-0.03em] uppercase whitespace-nowrap leading-none hidden md:block"
      >
        WILD TRAIL
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-[3] max-w-[760px]">
        <div className="hero-reveal">
          <Eyebrow label="Panadura, Sri Lanka · Rent Quality Gear" light />
        </div>

        <div className="hero-reveal mb-2 mt-4 md:mt-0" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.40)' }}>
          <span
            className="block font-black uppercase text-canvas text-[clamp(36px,7vw,96px)] tracking-[-0.03em] leading-[0.93]"
          >
            WILD TRAIL
          </span>
          <span
            className="block font-light uppercase text-sage-light text-[clamp(36px,7vw,96px)] tracking-[0.03em] leading-[0.93]"
          >
            GEAR
          </span>
        </div>

        <p
          className="hero-reveal text-canvas leading-relaxed text-[16px] md:text-[20px] font-medium mt-5 md:mt-[28px] mb-6 md:mb-[44px] max-w-[560px]"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
        >
          From hiking to camping, rent trusted equipment for every outdoor experience.
        </p>

        <div className="hero-reveal flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2.5 bg-forest text-canvas rounded-btn px-8 py-4 min-h-[48px] text-[15px] font-semibold no-underline transition-opacity hover:opacity-85"
          >
            Browse Rental Gear <IconArrow />
          </Link>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 text-canvas rounded-btn px-7 py-4 min-h-[48px] text-[15px] font-medium no-underline transition-colors border-[1.5px] border-canvas/40 hover:border-canvas/80"
          >
            <IconWA size={16} /> WhatsApp Us
          </a>
        </div>

        {/* Stats */}
        <div
          className="hero-reveal flex gap-6 md:gap-12 mt-10 md:mt-14 pt-6 md:pt-8 flex-wrap border-t border-canvas/12"
        >
          {[['50+', 'Gear Items'], ['4.9★', 'Avg. Rating'], ['2-Day', 'Min. Rental']].map(([val, lbl]) => (
            <div key={lbl}>
              <div
                className="font-black text-canvas text-[22px] md:text-[28px] tracking-[-0.03em] leading-none"
              >
                {val}
              </div>
              <div
                className="font-semibold uppercase mt-1 text-[11px] md:text-[12px] text-canvas/45 tracking-[0.05em]"
              >
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

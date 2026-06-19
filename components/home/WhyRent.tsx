'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { IconBackpack, IconShield, IconCompass, IconTent, IconArrow } from '@/components/Icons'
import Eyebrow from '@/components/Eyebrow'
import { waLink } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const REASONS = [
  {
    icon: <IconBackpack size={28} color="#84A98C" />,
    title: 'Quality Tested Gear',
    body: 'Every item is inspected before each rental. You get gear that actually works on the trail.',
  },
  {
    icon: <IconShield size={28} color="#84A98C" />,
    title: 'No Commitment',
    body: 'Rent for a weekend or a full expedition. No long-term ties. Pay only for what you use.',
  },
  {
    icon: <IconCompass size={28} color="#84A98C" />,
    title: 'Local Trail Knowledge',
    body: "We know Sri Lanka's trails. We'll help you pick the right gear for your specific route.",
  },
  {
    icon: <IconTent size={28} color="#84A98C" />,
    title: 'WhatsApp Simple',
    body: 'No booking forms. Just message us on WhatsApp — gear confirmed in minutes.',
  },
]

export default function WhyRent() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Dark section horizontal reveal
    gsap.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    )

    gsap.fromTo(
      rightRef.current,
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-forest py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left */}
          <div ref={leftRef}>
            <Eyebrow label="Why Choose Us" light />
            <h2
              className="font-black uppercase text-canvas text-[clamp(28px,4vw,52px)] tracking-[-0.03em] leading-[1.05] mb-5 md:mb-6 mt-4 md:mt-0"
            >
              GEAR MADE<br />
              <span className="font-light text-sage-light">For The Trail</span>
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-8 md:mb-10 text-canvas/65">
              We&rsquo;re not a warehouse. We&rsquo;re fellow hikers who&rsquo;ve tested every piece of gear on Sri Lanka&rsquo;s trails. When you rent from us, you rent with confidence.
            </p>
            <a
              href={waLink("Hi! I'd like to know more about renting gear from Wild Trail Gear.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-canvas text-forest rounded-btn px-7 py-3 min-h-[48px] text-[15px] font-semibold no-underline"
            >
              Ask Us Anything <IconArrow color="#1B4332" size={15} />
            </a>
          </div>

          {/* Right — reasons grid */}
          <div ref={rightRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {REASONS.map((r, i) => (
              <div
                key={i}
                className="rounded-3xl p-5 md:p-7 bg-canvas/10 border border-canvas/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300"
              >
                <div className="mb-3 md:mb-4">{r.icon}</div>
                <div className="text-sm md:text-base font-bold text-canvas mb-2 tracking-[-0.01em]">
                  {r.title}
                </div>
                <div className="text-xs md:text-sm leading-relaxed text-canvas/55">
                  {r.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

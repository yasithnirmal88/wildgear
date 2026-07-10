import type { Metadata } from 'next'
import Image from 'next/image'
import Eyebrow from '@/components/Eyebrow'
import { BLOG_POSTS } from '@/lib/blog-data'
import { IconCompass, IconBoot } from '@/components/Icons'
import BlogListingClient from '@/components/BlogListingClient'

export const metadata: Metadata = {
  title: 'Camping & Hiking Guides Sri Lanka | Wild Trail Blog',
  description:
    'Read expert camping guides, hiking checklists, and mountain guides for Sri Lanka. Tips for Knuckles Mountain Range, Horton Plains, and renting gear in Panadura.',
  openGraph: {
    title: 'Camping & Hiking Guides Sri Lanka | Wild Trail Blog',
    description: 'Expert camping advice, trail checklists, and gear recommendations for Sri Lanka.',
  },
}

export default function BlogListingPage() {
  return (
    <div className="bg-canvas min-h-screen pt-24 pb-24 relative">
      <div className="absolute right-[-4%] top-[10%] opacity-[0.03] pointer-events-none">
        <IconCompass size={350} color="#1B4332" />
      </div>
      <div className="absolute left-[2%] bottom-[12%] opacity-[0.03] pointer-events-none">
        <IconBoot size={220} color="#1B4332" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 relative z-10">
        <div className="bg-forest rounded-[32px] px-8 py-16 md:py-20 relative overflow-hidden mb-12 shadow-sm text-center">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <Image src="/images/hero-bg.jpeg" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10 max-w-[650px] mx-auto">
            <Eyebrow label="Wild Trail Blog" light className="justify-center" />
            <h1
              className="font-black uppercase text-canvas mt-4 mb-5"
              style={{ fontSize: 'clamp(32px,4.5vw,56px)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
            >
              TRAIL GUIDES &<br />
              <span className="font-light text-sage-light">Outdoor Insights</span>
            </h1>
            <p className="text-canvas/70 text-sm md:text-base leading-relaxed">
              Expert advice, gear checklists, and destination reviews from fellow hikers to prepare you for the untamed paths of Sri Lanka.
            </p>
          </div>
        </div>

        <BlogListingClient posts={BLOG_POSTS} />
      </div>
    </div>
  )
}

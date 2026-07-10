'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { type BlogPost } from '@/lib/blog-data'

const CATEGORIES = ['All', 'Camping Guides', 'Hiking Guides', 'Gear Guides', 'Travel Tips'] as const

export default function BlogListingClient({ posts }: { posts: BlogPost[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.blog-card')
    gsap.fromTo(
      cards,
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
      }
    )
  }, { scope: gridRef, dependencies: [activeFilter] })

  const filtered = posts.filter(
    (post) => activeFilter === 'All' || post.category === activeFilter
  )

  return (
    <div>
      {/* Filters bar */}
      <div className="flex justify-center gap-2 flex-wrap mb-12">
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="rounded-full px-[18px] py-[7px] text-[13px] font-semibold transition-all duration-150 cursor-pointer"
              style={{
                background: isActive ? '#1B4332' : 'transparent',
                color: isActive ? '#F8F5F0' : '#1A1A18',
                border: `1.5px solid ${isActive ? '#1B4332' : '#EDE8E0'}`,
                fontFamily: 'inherit',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate">
          <div className="text-6xl mb-4 opacity-20">⛺</div>
          <p className="text-base font-semibold">No articles found in this category.</p>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
        >
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-card group bg-white rounded-card overflow-hidden border border-bone shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col no-underline text-ink"
            >
              {/* Cover Image */}
              <div className="relative h-52 w-full bg-bone overflow-hidden">
                <Image
                  src={post.image.url}
                  alt={post.image.alt}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/35" />
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-forest text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                  {post.category}
                </span>
                {post.image.source && (
                  <span className="absolute bottom-2 right-2 text-[9px] text-white/50 bg-black/25 px-2 py-0.5 rounded">
                    © {post.image.source}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-[11px] font-semibold text-slate mb-3">
                  <span>{post.publishedDate}</span>
                  <span className="w-1 h-1 rounded-full bg-slate/40" />
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="text-lg font-bold text-ink group-hover:text-forest transition-colors mb-3 leading-snug tracking-tight">
                  {post.title}
                </h3>
                
                <p className="text-sm text-slate leading-relaxed mb-6 flex-1">
                  {post.description}
                </p>
                
                <div className="pt-4 border-t border-bone flex items-center gap-1.5 text-[13px] font-bold text-forest group-hover:text-sage transition-colors mt-auto">
                  Read More <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

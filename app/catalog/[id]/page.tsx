'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { type CatalogItem } from '@/lib/catalog-data'
import { waLink } from '@/lib/constants'
import { IconWA, IconCompass } from '@/components/Icons'

const AVAIL_COLORS: Record<string, string> = {
  available: '#4ADE80',
  limited: '#FDBA74',
  unavailable: '#FF6B6B',
}

const AVAIL_LABELS: Record<string, string> = {
  available: 'Available',
  limited: 'Limited',
  unavailable: 'Unavailable',
}

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [item, setItem] = useState<CatalogItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from('rental_items')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setItem(data as unknown as CatalogItem)
      }
      setLoading(false)
    }

    fetchItem()
  }, [params.id])

  if (loading) {
    return (
      <div className="bg-canvas min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center text-slate">
          <div className="animate-pulse text-4xl mb-4">⛺</div>
          <p className="text-sm font-medium">Loading gear details...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="bg-canvas min-h-screen pt-32 pb-24 px-8 flex items-center justify-center">
        <div className="text-center text-slate">
          <div className="text-6xl mb-4 opacity-20">⛺</div>
          <p className="text-xl font-bold text-ink mb-2">Gear Not Found</p>
          <p className="text-base mb-6">We couldn't find the item you're looking for.</p>
          <button 
            onClick={() => router.push('/catalog')}
            className="px-6 py-3 bg-forest text-white rounded-full font-semibold"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    )
  }

  const currentAvail = item.availability || 'available'
  const isAvailable = currentAvail !== 'unavailable'
  const priceDisplay = item.variants && item.variants.length > 0
    ? `from LKR ${item.variants[0].price.toLocaleString()}`
    : `LKR ${(item.pricePerDay || item.price || 0).toLocaleString()}`

  return (
    <div className="bg-canvas min-h-screen pt-24 pb-24 relative">
      {/* Decorative Background */}
      <div className="absolute right-[-5%] top-[15%] opacity-[0.03] pointer-events-none">
        <IconCompass size={400} color="#1B4332" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 relative z-10">
        
        {/* Back Link */}
        <Link 
          href="/catalog" 
          className="inline-flex items-center gap-2 text-sage hover:text-forest font-semibold text-sm mb-8 transition-colors"
        >
          <span>←</span> Back to Catalog
        </Link>

        <div className="bg-white rounded-[32px] p-6 lg:p-12 shadow-[0_20px_60px_rgba(27,67,50,0.05)] border border-[#EDE8E0] flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* Left Column: Image */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="relative aspect-square rounded-[24px] overflow-hidden bg-[#F8F5F0]">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate opacity-50">
                  <span className="text-6xl">⛺</span>
                </div>
              )}
              
              {/* Category Badge on Image */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-forest rounded-full px-4 py-1.5 text-xs font-bold shadow-sm">
                {item.category}
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="mb-8">
              <h1 className="text-3xl lg:text-5xl font-black text-ink leading-tight mb-4 tracking-tight">
                {item.name}
              </h1>
              
              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                  style={{ 
                    background: `${AVAIL_COLORS[currentAvail]}22`,
                    color: currentAvail === 'available' ? '#1B4332' : (currentAvail === 'limited' ? '#9a3412' : '#991b1b')
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full inline-block shadow-sm" 
                    style={{ background: AVAIL_COLORS[currentAvail] }} 
                  />
                  {AVAIL_LABELS[currentAvail]}
                </div>

                {item.tag && (
                  <div className="bg-sage/10 text-sage rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                    {item.tag}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-sage uppercase tracking-wider mb-3">About this gear</h3>
              <p className="text-ink/80 text-base leading-relaxed">
                {item.description || "No specific description has been added for this item yet. It's built for durability and comfort in the wild."}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-[#F8F5F0] rounded-[20px] p-5 border border-[#EDE8E0]">
                <div className="text-[10px] font-bold text-sage uppercase tracking-wider mb-1">Rental Rate</div>
                <div className="text-2xl font-black text-forest">
                  {priceDisplay}
                  {!item.variants && <span className="text-sm font-semibold text-sage ml-1">/ day</span>}
                </div>
              </div>
              <div className="bg-[#F8F5F0] rounded-[20px] p-5 border border-[#EDE8E0]">
                <div className="text-[10px] font-bold text-sage uppercase tracking-wider mb-1">Stock Available</div>
                <div className="text-2xl font-black text-ink">
                  {item.quantity !== undefined ? item.quantity : 'Unknown'}
                  <span className="text-sm font-semibold text-sage ml-1">units</span>
                </div>
              </div>
            </div>

            {/* Variants if any */}
            {item.variants && item.variants.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs font-bold text-sage uppercase tracking-wider mb-3">Available Options</h3>
                <div className="flex flex-wrap gap-2">
                  {item.variants.map(v => (
                    <div 
                      key={v.label} 
                      className="bg-white border border-[#EDE8E0] rounded-xl px-4 py-2 text-sm font-semibold text-ink shadow-sm"
                    >
                      {v.label} <span className="text-sage ml-1 font-normal">— LKR {v.price}/day</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Area */}
            <div className="mt-auto">
              <a
                href={waLink(item.waMessage || `Hi! I'd like to rent the ${item.name}. Could you share availability for my dates?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full rounded-[24px] py-4 px-8 text-[15px] font-bold text-white transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ 
                  background: isAvailable ? '#25D366' : '#b0b0b0',
                  pointerEvents: isAvailable ? 'auto' : 'none',
                  boxShadow: isAvailable ? '0 10px 25px rgba(37, 211, 102, 0.3)' : 'none'
                }}
              >
                <IconWA size={20} />
                {isAvailable ? 'Check Availability on WhatsApp' : 'Currently Unavailable'}
              </a>
              <p className="text-center text-xs text-sage mt-4 font-medium">
                Payments and pickups are coordinated directly via WhatsApp.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

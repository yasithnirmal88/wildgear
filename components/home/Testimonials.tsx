'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { IconPin } from '@/components/Icons'
import { StarRow } from '@/components/Icons'
import Eyebrow from '@/components/Eyebrow'
import { supabase } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const statRef = useRef<HTMLDivElement>(null)

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [loc, setLoc] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('rental_reviews')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const averageRating = reviews.length > 0
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
    : 4.9;

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      leftRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      }
    )

    if (reviewsRef.current) {
      const cards = reviewsRef.current.querySelectorAll('.review-card')
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.1, ease: 'power2.out', stagger: 0.14,
          scrollTrigger: { trigger: reviewsRef.current, start: 'top 80%' },
        }
      )
    }

    // Count-up for the rating number
    if (statRef.current) {
      const obj = { value: 0 }
      gsap.to(obj, {
        value: averageRating,
        duration: 2.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statRef.current,
          start: 'top 85%',
          once: true,
        },
        onUpdate() {
          if (statRef.current) {
            statRef.current.textContent = obj.value.toFixed(1)
          }
        },
      })
    }
  }, { scope: sectionRef, dependencies: [reviews, averageRating] })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setSubmitError('Please enter your name.')
    if (!text.trim()) return setSubmitError('Please enter your review.')

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const { error } = await supabase.from('rental_reviews').insert({
        name: name.trim(),
        loc: loc.trim() || 'Explorer',
        rating,
        text: text.trim(),
      })

      if (error) throw error

      setSubmitSuccess(true)
      setName('')
      setLoc('')
      setRating(5)
      setText('')
      setShowForm(false)
      await fetchReviews()
    } catch (err: any) {
      console.error('Error submitting review:', err)
      setSubmitError(err.message || 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className="bg-lifted py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 items-start">
          {/* Left */}
          <div ref={leftRef}>
            <Eyebrow label="Reviews" />
            <h2
              className="font-black uppercase text-ink text-[clamp(28px,3.5vw,48px)] tracking-[-0.03em] leading-[1.05]"
            >
              WHAT OUR{' '}
              <span className="font-light text-sage">Adventurers say</span>
            </h2>
            <p className="text-[15px] text-slate leading-relaxed mt-5">
              Trusted by hikers, trekkers, and weekend explorers across Sri Lanka.
            </p>

            <div className="flex gap-3 mt-8">
              <div className="text-center">
                <div
                  ref={statRef}
                  className="font-black text-forest text-[36px] tracking-[-0.03em] leading-none"
                >
                  0.0
                </div>
                <StarRow n={Math.round(averageRating)} />
                <div className="text-[11px] text-slate mt-1">{reviews.length} reviews</div>
              </div>
            </div>

            {/* Write a Review block */}
            <div className="mt-8">
              <button
                onClick={() => {
                  setShowForm(!showForm)
                  setSubmitError('')
                  setSubmitSuccess(false)
                }}
                className="bg-forest text-white text-[13px] font-bold py-3 px-6 rounded-full hover:bg-forest-light transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02]"
              >
                {showForm ? 'Close Form' : 'Write a Review'}
              </button>

              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-[20px] p-6 border border-bone shadow-sm mt-5 flex flex-col gap-4 transition-all duration-300"
                >
                  <h3 className="font-bold text-[16px] text-ink uppercase tracking-tight">
                    Share Your Feedback
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-lifted border border-bone rounded-[12px] py-2.5 px-4 text-sm text-ink outline-none focus:border-forest transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate uppercase tracking-wider mb-1">
                      Your Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Colombo (optional)"
                      value={loc}
                      onChange={(e) => setLoc(e.target.value)}
                      className="w-full bg-lifted border border-bone rounded-[12px] py-2.5 px-4 text-sm text-ink outline-none focus:border-forest transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate uppercase tracking-wider mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill={star <= rating ? '#E5A93B' : 'none'}
                            stroke="#E5A93B"
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate uppercase tracking-wider mb-1">
                      Review Comment
                    </label>
                    <textarea
                      placeholder="How was your experience renting from us?"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full bg-lifted border border-bone rounded-[12px] py-2.5 px-4 text-sm text-ink outline-none focus:border-forest transition-colors min-h-[80px] resize-y"
                      required
                    />
                  </div>

                  {submitError && (
                    <div className="text-[12px] text-red-500 font-semibold">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-forest text-white text-[13px] font-bold py-3 px-6 rounded-full hover:bg-forest-light transition-all disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {submitSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-4 rounded-[12px] border border-emerald-100 mt-5">
                  Thank you! Your review has been successfully submitted and added.
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div ref={reviewsRef} className="md:col-span-2 flex flex-col gap-5">
            {loading ? (
              <div className="text-center py-10 text-slate font-bold">Loading adventurer reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-[20px] p-10 border border-bone shadow-sm text-center">
                <div className="text-4xl mb-3">⭐</div>
                <div className="text-sm font-bold text-ink mb-1">No reviews yet</div>
                <div className="text-xs text-slate">Be the first to share your adventure experience!</div>
              </div>
            ) : (
              reviews.map((t) => (
                <div
                  key={t.id}
                  className="review-card bg-white rounded-[20px] p-7 border border-bone shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <StarRow n={t.rating} />
                  <p
                    className="text-[15px] text-ink leading-relaxed italic my-3.5"
                  >
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0 bg-gradient-to-br from-sage-light to-forest"
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-ink">{t.name}</div>
                      <div className="text-xs text-slate flex items-center gap-1">
                        <IconPin size={11} /> {t.loc}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

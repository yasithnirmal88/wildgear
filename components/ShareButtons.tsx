'use client'

import { useState } from 'react'

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const encoded = encodeURIComponent(`${title} — Read more at`)
  const shareUrl = encodeURIComponent(url)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }

  return (
    <div className="flex items-center gap-3 mb-12">
      <span className="text-xs font-bold text-slate uppercase tracking-wider mr-1">Share</span>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encoded}%20${shareUrl}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center hover:bg-[#25D366]/20 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encoded}&url=${shareUrl}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
        aria-label="Share on X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-ink"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors"
        aria-label="Share on Facebook"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center hover:bg-forest/20 transition-colors cursor-pointer"
        aria-label="Copy link"
      >
        {copied ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        )}
      </button>

      {copied && <span className="text-[11px] text-forest font-semibold">Copied!</span>}
    </div>
  )
}

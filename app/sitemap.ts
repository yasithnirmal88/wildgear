import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://wildtrailgear.lk'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/camping-gear-rental-sri-lanka`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/hiking-gear-rental-sri-lanka`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
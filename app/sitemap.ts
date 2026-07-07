import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://wildtrailgear.lk',
      lastModified: new Date(),
    },
    {
      url: 'https://wildtrailgear.lk/about',
      lastModified: new Date(),
    },
    {
      url: 'https://wildtrailgear.lk/catalog',
      lastModified: new Date(),
    },
    {
      url: 'https://wildtrailgear.lk/contact',
      lastModified: new Date(),
    },
  ]
}
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, type BlogPost } from '@/lib/blog-data'
import { IconCompass } from '@/components/Icons'
import ShareButtons from '@/components/ShareButtons'

interface Props {
  params: Promise<{ slug: string }>
}

function fetchPostBySlug(slug: string): BlogPost | null {
  return BLOG_POSTS.find((p) => p.slug === slug) || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = fetchPostBySlug(slug)
  if (!post) return {}

  const title = `${post.title} | Wild Trail Blog`
  const siteUrl = `https://www.wildtrailgear.lk/blog/${slug}`

  return {
    title,
    description: post.description,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description: post.description,
      url: siteUrl,
      type: 'article',
      publishedTime: new Date(post.publishedDate).toISOString(),
      authors: [post.author],
      images: [{ url: `https://www.wildtrailgear.lk${post.image.url}`, alt: post.image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.description,
      images: [`https://www.wildtrailgear.lk${post.image.url}`],
    },
  }
}

export default async function BlogPostDetailPage({ params }: Props) {
  const { slug } = await params
  const post = fetchPostBySlug(slug)
  if (!post) notFound()

  const siteUrl = `https://www.wildtrailgear.lk/blog/${slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `https://www.wildtrailgear.lk${post.image.url}`,
    datePublished: new Date(post.publishedDate).toISOString(),
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://www.wildtrailgear.lk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wild Trail Gear',
      logo: { '@type': 'ImageObject', url: 'https://www.wildtrailgear.lk/images/updated%20logo.jpg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': siteUrl },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Blog', item: 'https://www.wildtrailgear.lk/blog' },
      { '@type': 'ListItem', position: 2, name: post.title, item: siteUrl },
    ],
  }

  const related = BLOG_POSTS
    .filter((p) => p.slug !== post.slug)
    .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2)

  return (
    <article className="bg-canvas min-h-screen pt-24 pb-24 relative">
      <div className="absolute right-[-6%] top-[12%] opacity-[0.02] pointer-events-none">
        <IconCompass size={400} color="#1B4332" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sage hover:text-forest font-semibold text-sm mb-6 transition-colors no-underline"
        >
          <span>←</span> Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap gap-4 items-center text-xs font-bold text-sage uppercase tracking-wider mb-3">
            <span>{post.category}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            <span>{post.publishedDate}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            <span>{post.readTime}</span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-black text-ink tracking-tight leading-[1.1] mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            {post.title}
          </h1>
          <p className="text-sage text-sm font-bold">By {post.author}</p>
        </header>

        <div className="relative h-64 md:h-[400px] rounded-[32px] overflow-hidden mb-12 shadow-sm border border-bone">
          <Image
            src={post.image.url}
            alt={post.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 800px) 100vw, 800px"
            priority
          />
        </div>

        <section
          className="prose prose-slate max-w-none text-ink/90 leading-loose text-base md:text-[17px] mb-16 flex flex-col gap-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.references.length > 0 && (
          <div className="bg-white rounded-[28px] p-6 md:p-8 border border-bone mb-12">
            <h3 className="text-lg font-bold text-ink mb-4">Useful Resources</h3>
            <ul className="space-y-3">
              {post.references.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage hover:text-forest font-medium text-sm underline underline-offset-2 transition-colors"
                  >
                    {ref.title} <span className="inline-block ml-0.5">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ShareButtons title={post.title} url={siteUrl} />

        <div className="bg-[#F8F5F0] rounded-[28px] p-6 md:p-10 border border-[#EDE8E0] mb-16 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-ink mb-3">Planning a trip to these trails?</h3>
          <p className="text-sm text-slate mb-6 max-w-[500px] mx-auto leading-relaxed">
            Don&rsquo;t spend a fortune buying brand new gear. Rent clean, durable, trail-tested tents, anti-leech socks, and stoves from Wild Trail Gear in Panadura.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 bg-forest text-canvas rounded-btn px-6 py-3.5 text-sm font-semibold no-underline hover:opacity-85 transition-opacity"
            >
              Browse Rental Catalog
            </Link>
            <a
              href="https://wa.me/94776864908"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white rounded-btn px-6 py-3.5 text-sm font-semibold no-underline"
            >
              Ask Gear Advice on WhatsApp
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <footer className="pt-12 border-t border-bone">
            <h3 className="text-xl font-bold text-ink mb-6 uppercase tracking-tight">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-3 no-underline text-ink"
                >
                  <div className="relative h-32 rounded-2xl overflow-hidden border border-bone">
                    <Image
                      src={p.image.url}
                      alt={p.image.alt}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 400px) 100vw, 400px"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold leading-snug group-hover:text-forest transition-colors text-[15px]">
                      {p.title}
                    </h4>
                    <div className="text-[11px] text-slate mt-1">{p.publishedDate}</div>
                  </div>
                </Link>
              ))}
            </div>
          </footer>
        )}
      </div>
    </article>
  )
}

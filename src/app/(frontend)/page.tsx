import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArticleCard } from '@/components/ArticleCard'
import { PostCard } from '@/components/PostCard'
import { getBaseUrl } from '@/lib/media'

export const dynamic = 'force-dynamic'

export const metadata = {
  openGraph: {
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://thetruckersedge.com',
    type: 'website' as const,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SERVER_URL || 'https://thetruckersedge.com',
  },
}

const tools = [
  {
    href: '/practice-tests',
    icon: '📋',
    title: 'CDL Practice Tests',
    description: 'Free practice tests for every CDL endorsement — General Knowledge, Air Brakes, HazMat, and more.',
  },
  {
    href: '/guides',
    icon: '📖',
    title: 'Career Guides',
    description: 'CDL guides for all 50 states, plus OTR vs local, owner-operator tips, and more.',
  },
  {
    href: '/tools/ifta-calculator',
    icon: '⛽',
    title: 'IFTA Fuel Tax Calculator',
    description: 'Calculate your quarterly IFTA fuel tax report quickly and accurately.',
  },
  {
    href: '/tools/per-diem-calculator',
    icon: '💰',
    title: 'Per Diem Calculator',
    description: 'Find out how much you can deduct as a truck driver per day on the road.',
  },
  {
    href: '/tools/service-intervals',
    icon: '🔧',
    title: 'Service Intervals',
    description: 'Look up maintenance intervals for your truck or engine by make, model, or year.',
  },
]

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [{ docs: recentArticles }, { docs: recentPosts }] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
    }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 3,
      depth: 2,
    }),
  ])

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy text-white py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-brand-yellow text-brand-navy text-sm font-semibold px-3 py-1 rounded-full mb-6">
            Free CDL Resources for Every Driver
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your Edge on the Road
            <br />
            <span className="text-brand-yellow">Starts Here</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Free CDL practice tests, honest career guides, and tools built for truckers — by someone who&apos;s been there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/practice-tests" className="btn-primary text-lg px-8 py-4">
              Start a Practice Test
            </Link>
            <Link href="/guides" className="inline-flex items-center justify-center text-lg px-8 py-4 rounded-lg font-semibold bg-transparent text-white border-2 border-white hover:bg-white hover:text-brand-navy transition-colors duration-200">
              Browse Career Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-yellow py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-brand-navy">
          {[
            { value: '187', label: 'Practice Questions' },
            { value: 'Free', label: 'No Signup Required' },
            { value: '8', label: 'CDL Endorsements Covered' },
            { value: '11M+', label: 'US Trucking Jobs' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold">{stat.value}</div>
              <div className="text-sm font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Guides */}
      {recentArticles.length > 0 && (
        <section className="py-10 sm:py-16 px-4 bg-brand-gray">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">Career Guides</h2>
              <Link href="/guides" className="text-brand-yellow font-semibold hover:text-brand-yellowDark">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools section */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-3 text-center">Free Trucking Tools</h2>
          <p className="text-gray-500 text-center mb-10">Everything you need to pass your CDL and run a smarter operation.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card p-6 flex flex-col gap-3">
                <div className="text-4xl">{tool.icon}</div>
                <h3 className="text-lg font-bold text-brand-navy">{tool.title}</h3>
                <p className="text-gray-500 text-sm flex-1">{tool.description}</p>
                <span className="text-brand-yellow font-semibold text-sm">Get started →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 px-4 bg-brand-gray">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">From the Blog</h2>
            <Link href="/blog" className="text-brand-yellow font-semibold hover:text-brand-yellowDark">
              View all posts →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No posts yet — check back soon!</p>
              <Link href="/blog" className="text-brand-yellow font-semibold hover:text-brand-yellowDark">
                Go to Blog →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Email capture */}
      <section className="py-10 sm:py-16 px-4 bg-brand-navy text-white">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Get the Free CDL Study Checklist</h2>
          <p className="text-gray-300 mb-8">
            A one-page PDF covering every topic tested on the General Knowledge exam. Enter your email and we&apos;ll send it straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Send My Checklist
            </button>
          </form>
          <p className="text-gray-400 text-xs mt-4">No spam. Unsubscribe any time.</p>
        </div>
      </section>
    </>
  )
}

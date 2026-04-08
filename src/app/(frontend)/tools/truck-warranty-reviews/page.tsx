import type { Metadata } from 'next'
import Link from 'next/link'
import { getBaseUrl } from '@/lib/media'
import { WarrantyGuideLeadForm } from '@/components/WarrantyGuideLeadForm'
import {
  WARRANTY_GUIDE_FAQ,
  WARRANTY_GUIDE_LAST_REVIEWED_ISO,
  warrantyGuideFaqJsonLd,
} from '@/lib/warranty-guide-faq'

const base = getBaseUrl().replace(/\/$/, '')
const path = '/tools/truck-warranty-reviews'

const desc =
  'Independent buyer’s guide to commercial truck extended warranties: what to ask, common exclusions, red flags, and how to compare coverage before you buy.'

const reviewedLong = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${WARRANTY_GUIDE_LAST_REVIEWED_ISO}T12:00:00.000Z`))

export const metadata: Metadata = {
  title: 'Commercial Truck Extended Warranty Guide',
  description: desc,
  alternates: { canonical: `${base}${path}` },
  openGraph: {
    title: 'Commercial Truck Extended Warranty Guide | The Truckers Edge',
    description: desc,
    url: `${base}${path}`,
    type: 'article',
    publishedTime: `${WARRANTY_GUIDE_LAST_REVIEWED_ISO}T12:00:00.000Z`,
    modifiedTime: `${WARRANTY_GUIDE_LAST_REVIEWED_ISO}T12:00:00.000Z`,
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Truck Extended Warranty Guide' },
  robots: { index: true, follow: true },
}

export default function TruckWarrantyGuidePage() {
  const faqLd = warrantyGuideFaqJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <Link href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
        ← All Tools
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy mb-4">
          Commercial truck extended warranty: what to know before you buy
        </h1>
        <p className="text-lg text-gray-600">
          A practical checklist for owner-operators and fleets — not star ratings or hype. Use it to compare policies
          apples-to-apples and avoid expensive surprises.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          <span className="font-medium text-gray-600">Last reviewed:</span> {reviewedLong}
        </p>
      </header>

      <div className="rounded-lg border border-amber-200 bg-amber-50/80 text-amber-950 text-sm px-4 py-3 mb-8">
        <strong className="font-semibold">Important:</strong> This page is general information only, not insurance,
        legal, or financial advice. Coverage varies by contract and state. When you request a quote or submit the form
        below, we may contact you (or connect you with partners) about warranty options.
      </div>

      <div className="mb-10">
        <WarrantyGuideLeadForm />
      </div>

      <div className="mb-10 text-center">
        <Link
          href="/tools/warranty-quote"
          className="inline-flex items-center justify-center btn-primary px-8 py-3 text-base font-semibold"
        >
          Go to full warranty quote questionnaire
        </Link>
      </div>

      <article className="prose-truckers space-y-8">
        <section>
          <h2>Why a buyer’s guide instead of “reviews”?</h2>
          <p>
            Extended warranties for Class 8 and heavy trucks depend on your <strong>vin, mileage, usage, and contract
            fine print</strong>. A generic 5-star review rarely tells you whether <em>your</em> aftertreatment, turbo, or
            labor rate is covered. This guide focuses on <strong>questions and contract mechanics</strong> you can verify
            before you pay.
          </p>
        </section>

        <section>
          <h2>What coverage often includes (verify in writing)</h2>
          <ul>
            <li>Major powertrain components (engine, transmission, driveline) on listed plans — scope varies widely.</li>
            <li>
              Some plans add electrical, A/C, or emissions-related components; others exclude or cap them heavily.
            </li>
            <li>Roadside or rental benefits on higher tiers — check limits and waiting periods.</li>
          </ul>
        </section>

        <section>
          <h2>Common exclusions and caps</h2>
          <ul>
            <li>
              <strong>Wear items:</strong> clutch, brakes, tires, belts, hoses, and fluids are often excluded unless a
              specific rider says otherwise.
            </li>
            <li>
              <strong>Pre-existing conditions</strong> and issues that began before contract effective date.
            </li>
            <li>
              <strong>Maintenance neglect</strong> — missing documented oil changes or OEM intervals can void claims.
            </li>
            <li>
              <strong>Labor rates &amp; parts source:</strong> policies may cap hourly labor or require approved shops.
            </li>
          </ul>
        </section>

        <section>
          <h2>Questions to ask before you sign</h2>
          <ol>
            <li>
              <strong>Waiting period</strong> — How long until coverage starts? Any mileage minimum?
            </li>
            <li>
              <strong>Deductible</strong> — Per visit, per component, or per repair order?
            </li>
            <li>
              <strong>Claims process</strong> — Pre-authorization required? Photo/diagnostic rules?
            </li>
            <li>
              <strong>Transfer or cancel</strong> — If you sell the truck, can the contract transfer? Refund policy?
            </li>
            <li>
              <strong>Commercial use</strong> — Confirm the policy matches how you run (OO, lease, fleet, hotshot).
            </li>
          </ol>
        </section>

        <section>
          <h2>Red flags</h2>
          <ul>
            <li>Pressure to buy today with no sample contract or sample schedule of coverage.</li>
            <li>Vague language like “bumper-to-bumper” without a defined component list.</li>
            <li>Coverage that seems far cheaper than comparable plans with no clear underwriting explanation.</li>
          </ul>
        </section>

        <section>
          <h2>Owner-operator vs small fleet</h2>
          <p>
            Solo operators usually optimize for <strong>deductible vs premium</strong> and a clear claims path near
            their lanes. Fleets may need <strong>multi-unit billing</strong>, consistent labor caps across shops, and
            reporting for total cost of risk. Same questions apply — scale changes administration, not the need to read
            the contract.
          </p>
        </section>

        <section>
          <h2>How this ties to our quote tool</h2>
          <p>
            Our <Link href="/tools/warranty-quote">warranty quote flow</Link> collects truck and usage details so we can
            match you with appropriate providers. Use this guide to evaluate whatever offers you receive — especially
            exclusions, waiting periods, and labor limits.
          </p>
        </section>
      </article>

      <section id="faq" aria-labelledby="faq-heading" className="mt-10 space-y-4">
        <h2 id="faq-heading" className="text-2xl font-bold text-brand-navy">
          Frequently asked questions
        </h2>
        <p className="text-gray-600 text-base">
          Short answers to common search questions — always confirm details in your specific contract.
        </p>
        <dl className="space-y-6">
          {WARRANTY_GUIDE_FAQ.map((item) => (
            <div key={item.question} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <dt className="font-bold text-brand-navy text-lg mb-2">{item.question}</dt>
              <dd className="text-gray-700 leading-relaxed m-0">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200 text-center space-y-4">
        <Link href="/tools/warranty-quote" className="inline-flex btn-primary px-8 py-3 font-semibold">
          Start full warranty quote
        </Link>
        <p className="text-sm text-gray-600">
          <Link href="/tools/warranty-quote" className="font-semibold text-brand-navy underline">
            Full quote questionnaire
          </Link>
          {' · '}
          <Link href="/tools" className="font-semibold text-brand-navy underline">
            All tools
          </Link>
        </p>
      </div>
    </div>
    </>
  )
}

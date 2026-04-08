import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Trucking Tools',
  description:
    'Free tools for truck drivers: IFTA fuel tax calculator, per diem calculator, and more. Built for owner-operators and company drivers alike.',
}

const tools = [
  {
    href: '/command-center',
    icon: '📊',
    title: 'Owner-operator command center',
    description:
      'Save your truck, home base, lanes, and rough cost-per-mile assumptions — with one-tap access to IFTA, service intervals, warranty tools, and the diesel mechanic directory. Built to power a future mobile app.',
    tags: ['Owner-Operator', 'Planning'],
    cta: 'Open hub →',
  },
  {
    href: '/mechanics/signup',
    icon: '🔩',
    title: 'Hosted page for your diesel shop',
    description:
      'Get a professional one-page website on The Truckers Edge. Submit your shop for review, subscribe monthly when approved, and reach drivers looking for heavy-truck service.',
    tags: ['Mechanics', 'Marketing'],
    cta: 'Get started →',
  },
  {
    href: '/mechanics',
    icon: '📍',
    title: 'Diesel mechanic directory',
    description:
      'Find heavy-truck and diesel shops by state or search. Listings with hosted profiles on The Truckers Edge — contact shops or request a callback from their page.',
    tags: ['Drivers', 'Maintenance'],
    cta: 'Open directory →',
  },
  {
    href: '/tools/truck-warranty-reviews',
    icon: '📋',
    title: "Truck warranty buyer's guide",
    description:
      'What to ask, common exclusions, and red flags before you buy commercial truck extended warranty — plus a short form to get matched with options.',
    tags: ['Owner-Operator', 'Protection'],
    cta: 'Read guide →',
  },
  {
    href: '/tools/warranty-quote',
    icon: '🛡️',
    title: 'Truck Warranty Quote',
    description:
      'Get a free warranty quote matched to your truck. Answer a few questions and we\'ll search top providers to find the best coverage for your rig.',
    tags: ['Owner-Operator', 'Protection'],
    cta: 'Open tool →',
  },
  {
    href: '/tools/ifta-calculator',
    icon: '⛽',
    title: 'IFTA Fuel Tax Calculator',
    description:
      'Calculate your quarterly IFTA fuel tax filing quickly. Enter your miles by state and fuel purchases — we do the math.',
    tags: ['Owner-Operator', 'Taxes'],
    cta: 'Open calculator →',
  },
  {
    href: '/tools/per-diem-calculator',
    icon: '💰',
    title: 'Per Diem Deduction Calculator',
    description:
      'Find out how much you can deduct for meals and incidentals based on your days on the road. Saves most drivers $3,000–$7,000/year in taxes.',
    tags: ['Tax Savings', 'All Drivers'],
    cta: 'Open calculator →',
  },
  {
    href: '/tools/service-intervals',
    icon: '🔧',
    title: 'Truck Service Intervals',
    description:
      'Look up maintenance intervals for your truck or engine by make, model, or year. Volvo, Cummins, Detroit, PACCAR, and more.',
    tags: ['Maintenance', 'All Drivers'],
    cta: 'Open tool →',
  },
] as const

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-4">Free Trucking Tools</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Calculators and tools to help you run smarter — whether you&apos;re a company driver or running your own rig.
        </p>
        <p className="mt-4 text-base text-gray-600 max-w-2xl">
          Need a shop?{' '}
          <Link href="/mechanics" className="font-semibold text-brand-navy underline">
            Search the diesel mechanic directory
          </Link>
          . Running your own truck?{' '}
          <Link href="/command-center" className="font-semibold text-brand-navy underline">
            Open the owner-operator command center
          </Link>
          .
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="card p-6 sm:p-8 flex flex-col gap-4">
            <div className="text-5xl">{tool.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy mb-2">{tool.title}</h2>
              <p className="text-gray-500 leading-relaxed">{tool.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap mt-1">
              {tool.tags.map((tag) => (
                <span key={tag} className="text-xs bg-brand-gray text-brand-navy font-medium px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-brand-yellow font-semibold text-sm mt-auto">{tool.cta}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

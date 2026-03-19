import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Trucking Tools',
  description:
    'Free tools for truck drivers: IFTA fuel tax calculator, per diem calculator, and more. Built for owner-operators and company drivers alike.',
}

const tools = [
  {
    href: '/tools/warranty-quote',
    icon: '🛡️',
    title: 'Truck Warranty Quote',
    description:
      'Get a free warranty quote matched to your truck. Answer a few questions and we\'ll search top providers to find the best coverage for your rig.',
    tags: ['Owner-Operator', 'Protection'],
  },
  {
    href: '/tools/ifta-calculator',
    icon: '⛽',
    title: 'IFTA Fuel Tax Calculator',
    description:
      'Calculate your quarterly IFTA fuel tax filing quickly. Enter your miles by state and fuel purchases — we do the math.',
    tags: ['Owner-Operator', 'Taxes'],
  },
  {
    href: '/tools/per-diem-calculator',
    icon: '💰',
    title: 'Per Diem Deduction Calculator',
    description:
      'Find out how much you can deduct for meals and incidentals based on your days on the road. Saves most drivers $3,000–$7,000/year in taxes.',
    tags: ['Tax Savings', 'All Drivers'],
  },
  {
    href: '/tools/service-intervals',
    icon: '🔧',
    title: 'Truck Service Intervals',
    description:
      'Look up maintenance intervals for your truck or engine by make, model, or year. Volvo, Cummins, Detroit, PACCAR, and more.',
    tags: ['Maintenance', 'All Drivers'],
  },
]

export default function ToolsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-4">Free Trucking Tools</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Calculators and tools to help you run smarter — whether you&apos;re a company driver or running your own rig.
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
            <span className="text-brand-yellow font-semibold text-sm mt-auto">Open Calculator →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

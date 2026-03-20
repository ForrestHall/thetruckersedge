import Link from 'next/link'
import { LogoWordmark } from '@/components/LogoWordmark'

const links = {
  'CDL Test Prep': [
    { href: '/practice-tests', label: 'All Practice Tests' },
    { href: '/practice-tests/cdl-general-knowledge-practice-test', label: 'General Knowledge' },
    { href: '/practice-tests/cdl-air-brakes-practice-test', label: 'Air Brakes' },
    { href: '/practice-tests/cdl-hazmat-practice-test', label: 'HazMat' },
    { href: '/practice-tests/cdl-combination-vehicles-practice-test', label: 'Combination Vehicles' },
    { href: '/practice-tests/cdl-doubles-triples-practice-test', label: 'Doubles & Triples' },
    { href: '/practice-tests/cdl-passenger-practice-test', label: 'Passenger Transport' },
    { href: '/practice-tests/cdl-school-bus-practice-test', label: 'School Bus' },
    { href: '/practice-tests/cdl-tank-vehicles-practice-test', label: 'Tank Vehicles' },
  ],
  'Career Guides': [
    { href: '/guides', label: 'All Guides' },
    { href: '/guides#cdl-by-state', label: 'CDL by State (50 guides)' },
    { href: '/guides/otr-vs-local-trucking', label: 'OTR vs Local Trucking' },
    { href: '/guides/how-to-become-owner-operator', label: 'Become an Owner-Operator' },
  ],
  'Blog': [
    { href: '/blog', label: 'All Posts' },
  ],
  'Free Tools': [
    { href: '/tools', label: 'All Tools' },
    { href: '/tools/ifta-calculator', label: 'IFTA Calculator' },
    { href: '/tools/per-diem-calculator', label: 'Per Diem Calculator' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300 pt-10 sm:pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div>
            <LogoWordmark variant="footer" />
            <p className="text-sm mt-3 leading-relaxed text-gray-400">
              Free CDL practice tests, career guides, and tools for drivers at every stage — from first license to running your own rig.
            </p>
          </div>
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} The Truckers Edge. All rights reserved.</p>
          <p className="text-xs text-center md:text-right max-w-sm">
            Affiliate disclosure: Some links on this site are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}

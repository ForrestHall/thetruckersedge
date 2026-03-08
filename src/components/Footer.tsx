import Link from 'next/link'

const links = {
  'CDL Test Prep': [
    { href: '/practice-tests', label: 'All Practice Tests' },
    { href: '/practice-tests/cdl-general-knowledge', label: 'General Knowledge' },
    { href: '/practice-tests/cdl-air-brakes', label: 'Air Brakes' },
    { href: '/practice-tests/cdl-hazmat', label: 'HazMat' },
  ],
  'Career Guides': [
    { href: '/guides', label: 'All Guides' },
    { href: '/guides/how-to-get-cdl-georgia', label: 'Get Your CDL in Georgia' },
    { href: '/guides/otr-vs-local-trucking', label: 'OTR vs Local Trucking' },
    { href: '/guides/how-to-become-owner-operator', label: 'Become an Owner-Operator' },
  ],
  'Free Tools': [
    { href: '/tools', label: 'All Tools' },
    { href: '/tools/ifta-calculator', label: 'IFTA Calculator' },
    { href: '/tools/per-diem-calculator', label: 'Per Diem Calculator' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="text-xl font-extrabold text-white">
              The Truckers<span className="text-brand-yellow">Edge</span>
            </Link>
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

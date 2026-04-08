/**
 * FAQ copy for /tools/truck-warranty-reviews — keep in sync with visible FAQ on the page and FAQPage JSON-LD.
 * Update LAST_REVIEWED when you materially edit the guide.
 */
export const WARRANTY_GUIDE_LAST_REVIEWED_ISO = '2026-04-06'

export type WarrantyGuideFaqItem = { question: string; answer: string }

export const WARRANTY_GUIDE_FAQ: WarrantyGuideFaqItem[] = [
  {
    question: 'Is a commercial truck extended warranty worth it?',
    answer:
      'It depends on your risk tolerance, truck age and mileage, typical repair costs for your powertrain, and how well a specific contract matches your operation. Compare premium and deductible to realistic repair scenarios, and read exclusions and labor caps before deciding — not every plan is a good fit for every truck.',
  },
  {
    question: 'What does a Class 8 extended warranty often cover?',
    answer:
      'Many plans focus on major drivetrain components (engine, transmission, driveline) with limits that vary by tier. Some add electrical, HVAC, or emissions-related items; others cap or exclude them. Always verify coverage against the written schedule of coverage for the plan you are offered.',
  },
  {
    question: 'What is usually excluded from heavy truck warranty plans?',
    answer:
      'Common exclusions include wear items (clutch, brakes, tires, belts, hoses, fluids), pre-existing conditions, damage from neglect or missed maintenance, and sometimes certain high-cost emissions components unless explicitly listed. Policies may also restrict labor rates or approved repair facilities.',
  },
  {
    question: 'What is a waiting period on a truck extended warranty?',
    answer:
      'A waiting period is the time after purchase before certain coverages take effect; it reduces claims on problems that already existed. Length and rules differ by contract — confirm start date, mileage requirements, and any services that must be performed before coverage begins.',
  },
  {
    question: 'Can I transfer an extended warranty when I sell the truck?',
    answer:
      'Some contracts allow transfer to a new owner for a fee and paperwork; others do not. Transfer rules, timing, and fees should be stated in the contract — ask for the transfer section in writing before you buy if resale value matters to you.',
  },
  {
    question: 'How are deductibles applied on commercial truck warranty claims?',
    answer:
      'Deductibles may be per visit, per component, or per repair order depending on the policy. Ask exactly how multiple failures on one visit are billed, and whether diagnostic time counts toward the deductible or labor caps.',
  },
  {
    question: 'How is an extended warranty different from the manufacturer warranty?',
    answer:
      'A manufacturer warranty comes from the OEM for a limited term and covers defects under its terms. An extended or vehicle service contract is a separate agreement (often third-party) with its own exclusions, waiting periods, deductibles, and claims process — it does not automatically match factory coverage.',
  },
]

export function warrantyGuideFaqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: WARRANTY_GUIDE_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

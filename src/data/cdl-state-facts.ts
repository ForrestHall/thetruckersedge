/**
 * State-specific CDL metadata so "CDL by state" guides are not duplicate thin content.
 * Agency names are abbreviated public references — verify current names on official sites.
 */

export type CdlStateMeta = {
  capital: string
  /** Full phrase, e.g. "the Texas Department of Public Safety (DPS)" */
  agencyPhrase: string
  /** Short for excerpts */
  agencyShort: string
}

export const CDL_STATE_META: Record<string, CdlStateMeta> = {
  alabama: { capital: 'Montgomery', agencyPhrase: 'the Alabama Law Enforcement Agency (ALEA)', agencyShort: 'ALEA' },
  alaska: { capital: 'Juneau', agencyPhrase: 'the Alaska Division of Motor Vehicles', agencyShort: 'Alaska DMV' },
  arizona: { capital: 'Phoenix', agencyPhrase: 'the Arizona Department of Transportation Motor Vehicle Division', agencyShort: 'Arizona MVD' },
  arkansas: { capital: 'Little Rock', agencyPhrase: 'the Arkansas Department of Finance and Administration Office of Motor Vehicle', agencyShort: 'Arkansas OMV' },
  california: { capital: 'Sacramento', agencyPhrase: 'the California Department of Motor Vehicles', agencyShort: 'California DMV' },
  colorado: { capital: 'Denver', agencyPhrase: 'the Colorado Division of Motor Vehicles', agencyShort: 'Colorado DMV' },
  connecticut: { capital: 'Hartford', agencyPhrase: 'the Connecticut Department of Motor Vehicles', agencyShort: 'Connecticut DMV' },
  delaware: { capital: 'Dover', agencyPhrase: 'the Delaware Division of Motor Vehicles', agencyShort: 'Delaware DMV' },
  florida: { capital: 'Tallahassee', agencyPhrase: 'the Florida Department of Highway Safety and Motor Vehicles', agencyShort: 'Florida DHSMV' },
  georgia: { capital: 'Atlanta', agencyPhrase: 'the Georgia Department of Driver Services', agencyShort: 'Georgia DDS' },
  hawaii: { capital: 'Honolulu', agencyPhrase: 'the Hawaii Department of Transportation', agencyShort: 'Hawaii DOT' },
  idaho: { capital: 'Boise', agencyPhrase: 'the Idaho Transportation Department', agencyShort: 'Idaho ITD' },
  illinois: { capital: 'Springfield', agencyPhrase: 'the Illinois Secretary of State', agencyShort: 'Illinois SOS' },
  indiana: { capital: 'Indianapolis', agencyPhrase: 'the Indiana Bureau of Motor Vehicles', agencyShort: 'Indiana BMV' },
  iowa: { capital: 'Des Moines', agencyPhrase: 'the Iowa Department of Transportation', agencyShort: 'Iowa DOT' },
  kansas: { capital: 'Topeka', agencyPhrase: 'the Kansas Department of Revenue Division of Vehicles', agencyShort: 'Kansas DMV' },
  kentucky: { capital: 'Frankfort', agencyPhrase: 'the Kentucky Transportation Cabinet', agencyShort: 'Kentucky DMV' },
  louisiana: { capital: 'Baton Rouge', agencyPhrase: 'the Louisiana Office of Motor Vehicles', agencyShort: 'Louisiana OMV' },
  maine: { capital: 'Augusta', agencyPhrase: 'the Maine Bureau of Motor Vehicles', agencyShort: 'Maine BMV' },
  maryland: { capital: 'Annapolis', agencyPhrase: 'the Maryland Motor Vehicle Administration', agencyShort: 'Maryland MVA' },
  massachusetts: { capital: 'Boston', agencyPhrase: 'the Massachusetts Registry of Motor Vehicles', agencyShort: 'Massachusetts RMV' },
  michigan: { capital: 'Lansing', agencyPhrase: 'the Michigan Secretary of State', agencyShort: 'Michigan SOS' },
  minnesota: { capital: 'St. Paul', agencyPhrase: 'the Minnesota Department of Public Safety Driver and Vehicle Services', agencyShort: 'Minnesota DVS' },
  mississippi: { capital: 'Jackson', agencyPhrase: 'the Mississippi Department of Public Safety', agencyShort: 'Mississippi DPS' },
  missouri: { capital: 'Jefferson City', agencyPhrase: 'the Missouri Department of Revenue Motor Vehicle Bureau', agencyShort: 'Missouri DMV' },
  montana: { capital: 'Helena', agencyPhrase: 'the Montana Motor Vehicle Division', agencyShort: 'Montana MVD' },
  nebraska: { capital: 'Lincoln', agencyPhrase: 'the Nebraska Department of Motor Vehicles', agencyShort: 'Nebraska DMV' },
  nevada: { capital: 'Carson City', agencyPhrase: 'the Nevada Department of Motor Vehicles', agencyShort: 'Nevada DMV' },
  'new-hampshire': { capital: 'Concord', agencyPhrase: 'the New Hampshire Division of Motor Vehicles', agencyShort: 'New Hampshire DMV' },
  'new-jersey': { capital: 'Trenton', agencyPhrase: 'the New Jersey Motor Vehicle Commission', agencyShort: 'New Jersey MVC' },
  'new-mexico': { capital: 'Santa Fe', agencyPhrase: 'the New Mexico Motor Vehicle Division', agencyShort: 'New Mexico MVD' },
  'new-york': { capital: 'Albany', agencyPhrase: 'the New York State Department of Motor Vehicles', agencyShort: 'New York DMV' },
  'north-carolina': { capital: 'Raleigh', agencyPhrase: 'the North Carolina Division of Motor Vehicles', agencyShort: 'North Carolina DMV' },
  'north-dakota': { capital: 'Bismarck', agencyPhrase: 'the North Dakota Department of Transportation', agencyShort: 'North Dakota DOT' },
  ohio: { capital: 'Columbus', agencyPhrase: 'the Ohio Bureau of Motor Vehicles', agencyShort: 'Ohio BMV' },
  oklahoma: { capital: 'Oklahoma City', agencyPhrase: 'the Oklahoma Department of Public Safety', agencyShort: 'Oklahoma DPS' },
  oregon: { capital: 'Salem', agencyPhrase: 'the Oregon Driver and Motor Vehicle Services', agencyShort: 'Oregon DMV' },
  pennsylvania: { capital: 'Harrisburg', agencyPhrase: 'the Pennsylvania Department of Transportation', agencyShort: 'PennDOT' },
  'rhode-island': { capital: 'Providence', agencyPhrase: 'the Rhode Island Division of Motor Vehicles', agencyShort: 'Rhode Island DMV' },
  'south-carolina': { capital: 'Columbia', agencyPhrase: 'the South Carolina Department of Motor Vehicles', agencyShort: 'South Carolina DMV' },
  'south-dakota': { capital: 'Pierre', agencyPhrase: 'the South Dakota Department of Public Safety', agencyShort: 'South Dakota DPS' },
  tennessee: { capital: 'Nashville', agencyPhrase: 'the Tennessee Department of Safety and Homeland Security', agencyShort: 'Tennessee TDOS' },
  texas: { capital: 'Austin', agencyPhrase: 'the Texas Department of Public Safety', agencyShort: 'Texas DPS' },
  utah: { capital: 'Salt Lake City', agencyPhrase: 'the Utah Driver License Division', agencyShort: 'Utah DMV' },
  vermont: { capital: 'Montpelier', agencyPhrase: 'the Vermont Department of Motor Vehicles', agencyShort: 'Vermont DMV' },
  virginia: { capital: 'Richmond', agencyPhrase: 'the Virginia Department of Motor Vehicles', agencyShort: 'Virginia DMV' },
  washington: { capital: 'Olympia', agencyPhrase: 'the Washington State Department of Licensing', agencyShort: 'Washington DOL' },
  'west-virginia': { capital: 'Charleston', agencyPhrase: 'the West Virginia Division of Motor Vehicles', agencyShort: 'West Virginia DMV' },
  wisconsin: { capital: 'Madison', agencyPhrase: 'the Wisconsin Department of Transportation', agencyShort: 'Wisconsin DOT' },
  wyoming: { capital: 'Cheyenne', agencyPhrase: 'the Wyoming Department of Transportation', agencyShort: 'Wyoming DOT' },
}

export function getCdlStateMeta(slug: string): CdlStateMeta | null {
  return CDL_STATE_META[slug] ?? null
}

/** Stable 0..n-1 from slug */
function slot(slug: string, modulo: number): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h % modulo
}

export function buildUniqueExcerpt(stateName: string, meta: CdlStateMeta, slug: string): string {
  const v = slot(slug, 3)
  const a = meta.agencyShort
  const c = meta.capital
  if (v === 0) {
    return `${stateName} CDL: ${a} issues commercial licenses. Testing is available in ${c} and other locations — requirements, exams, and training options explained.`
  }
  if (v === 1) {
    return `How to get a CDL in ${stateName}: ${a} oversees licensing from ${c}. Intrastate vs interstate rules, knowledge and skills tests, and finding training.`
  }
  return `Commercial driver's license steps for ${stateName}. ${a} schedules written and skills tests; start in ${c} or a regional office. Endorsements and medical card covered.`
}

export function buildRegionalOpening(stateName: string, meta: CdlStateMeta, slug: string): string {
  const { capital, agencyPhrase } = meta
  const s = slot(slug, 4)
  if (s === 0) {
    return `Commercial licensing in ${stateName} is handled by ${agencyPhrase}. Most drivers begin by obtaining a Commercial Learner's Permit (CLP) after passing the required knowledge exams; skills tests are often scheduled at larger offices in or near ${capital}.`
  }
  if (s === 1) {
    return `If you're pursuing a CDL in ${stateName}, ${agencyPhrase} is your starting point for permits, testing, and endorsements. Rural residents sometimes travel to ${capital} or a regional testing site for the behind-the-wheel exam.`
  }
  if (s === 2) {
    return `${stateName} follows federal CDL standards while managing scheduling and fees through ${agencyPhrase}. Plan ahead: written tests and road tests may be booked separately, with peak seasons around ${capital} filling quickly.`
  }
  return `${agencyPhrase} administers CDL credentials statewide. Drivers in ${stateName} must meet age rules (18 intrastate / 21 interstate), pass a DOT medical exam, and complete knowledge and skills tests appropriate to vehicle class and endorsements.`
}

export function buildKnowledgeParagraph(stateName: string, meta: CdlStateMeta, slug: string): string {
  const s = slot(slug, 5)
  const { agencyShort } = meta
  if (s === 0) {
    return `${stateName} requires a passing score on the General Knowledge exam for most CDL applicants. ${agencyShort} may bundle endorsements (Air Brakes, HazMat, etc.) into the same visit—confirm which tests you need for your job before you schedule.`
  }
  if (s === 1) {
    return `Written exams are proctored per federal CDL standards. In ${stateName}, study materials align with FMCSA content; ${agencyShort} publishes handbooks and fee schedules. Retake policies vary—ask your local office.`
  }
  if (s === 2) {
    return `Beyond General Knowledge, ${stateName} applicants often add Air Brakes and Combination Vehicles depending on equipment. Tanker, doubles/triples, and passenger endorsements each need their own knowledge test through ${agencyShort}.`
  }
  if (s === 3) {
    return `Each knowledge test typically allows a limited number of mistakes; ${agencyShort} can tell you the exact pass threshold and whether translations or accommodations are available at your preferred ${stateName} location.`
  }
  return `Schedule knowledge tests through ${agencyShort} once you hold a valid medical certificate. ${stateName} may require a CLP holding period before skills testing—verify current wait times before you commit to a training school.`
}

export function buildSkillsParagraph(stateName: string, meta: CdlStateMeta, slug: string): string {
  const s = slot(slug, 5)
  const { capital } = meta
  if (s === 0) {
    return `The CDL skills test has three parts: vehicle inspection, basic control maneuvers, and on-road driving. In ${stateName}, you must supply an appropriate vehicle (or use a school truck). Skills tests near ${capital} may book out—reserve early.`
  }
  if (s === 1) {
    return `Third-party examiners or state employees may administer road tests depending on ${stateName} policy. Pre-trip inspection is graded in detail—practice naming components aloud the way your examiner expects.`
  }
  if (s === 2) {
    return `Backing, alley docking, and road driving are scored against FMCSA criteria. Weather and traffic around ${stateName} testing routes vary; if you're not confident with the vehicle class, complete more training hours before testing.`
  }
  if (s === 3) {
    return `Failing one segment often means retaking the full skills test in ${stateName}. Confirm whether your CLP remains valid if you need a second attempt—${meta.agencyShort} can clarify renewal rules.`
  }
  return `Some carriers sponsor training and provide trucks for testing. If you're testing privately, ensure registration, insurance, and vehicle class match the CDL you're pursuing—${stateName} examiners will turn away mismatched equipment.`
}

export function buildTrainingParagraph(stateName: string, meta: CdlStateMeta, slug: string): string {
  const s = slot(slug, 5)
  if (s === 0) {
    return `CDL schools in ${stateName} range from community colleges to private academies and carrier-sponsored programs. Compare total cost, equipment used, and job placement—not just price. ${meta.agencyShort} lists approved providers.`
  }
  if (s === 1) {
    return `Company-paid training can reduce upfront cost but may include employment contracts. Read terms carefully before signing. ${stateName} also has independent schools if you prefer to stay flexible on your first job.`
  }
  if (s === 2) {
    return `Ask schools about their pass rates for skills tests administered in ${stateName} and whether they schedule exams with ${meta.agencyShort} or a third party.`
  }
  if (s === 3) {
    return `Part-time and evening programs exist in larger ${stateName} metros; rural students may need lodging near training hubs. Budget for DOT physicals, permit fees, and testing fees separate from tuition.`
  }
  return `Veterans' benefits and workforce grants sometimes apply to CDL training—ask schools and ${meta.agencyShort} about eligibility.`
}

export function buildNextStepsParagraph(stateName: string, slug: string): string {
  const s = slot(slug, 4)
  if (s === 0) {
    return `Start with our free General Knowledge practice tests, then study ${stateName}'s CDL manual. Book knowledge tests only after you're consistently passing practice exams—retakes cost time and money.`
  }
  if (s === 1) {
    return `Earn your CLP, complete training if needed, then schedule skills testing before your permit expires. Track all fees and appointment confirmations; ${stateName} offices may require online scheduling.`
  }
  if (s === 2) {
    return `Join forums and talk to recent grads from your area—local nuances (test sites, examiners' expectations) matter. Pair book study with hands-on practice in the vehicle class you'll test in.`
  }
  return `After licensing, consider which endorsements your employer needs next. ${stateName} CDL holders often add HazMat or Tanker after their first year—plan study time between runs.`
}

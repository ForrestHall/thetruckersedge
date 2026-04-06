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

/** Stable 0..modulo-1 from slug; salt separates hash spaces so section picks decorrelate */
export function slot(slug: string, modulo: number, salt = ''): number {
  const s = slug + salt
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % modulo
}

/** Vary title tags across states (still keyword-rich) */
export function buildGuideTitle(stateName: string, slug: string): string {
  const v = slot(slug, 3, 'ti')
  if (v === 0) return `How to Get Your CDL in ${stateName} (2026 Guide)`
  if (v === 1) return `${stateName} CDL: Requirements, Tests & Training (2026)`
  return `Commercial Driver's License in ${stateName} — Full Guide (2026)`
}

export function buildUniqueExcerpt(stateName: string, meta: CdlStateMeta, slug: string): string {
  const v = slot(slug, 5, 'ex')
  const a = meta.agencyShort
  const c = meta.capital
  if (v === 0) {
    return `${stateName} CDL: ${a} issues commercial licenses. Testing is available in ${c} and other locations — requirements, exams, and training options explained.`
  }
  if (v === 1) {
    return `How to get a CDL in ${stateName}: ${a} oversees licensing from ${c}. Intrastate vs interstate rules, knowledge and skills tests, and finding training.`
  }
  if (v === 2) {
    return `Commercial driver's license steps for ${stateName}. ${a} schedules written and skills tests; start in ${c} or a regional office. Endorsements and medical card covered.`
  }
  if (v === 3) {
    return `${stateName} truckers: CLP, knowledge exams, and road test paths through ${a}. Medical card, fees, and CDL school tips—built for ${c} and statewide offices.`
  }
  return `Earn a CDL-A or CDL-B in ${stateName}: what ${a} requires before you haul freight. Covers skills test prep, endorsements, and first-job training choices.`
}

export function buildRegionalOpening(stateName: string, meta: CdlStateMeta, slug: string): string {
  const { capital, agencyPhrase } = meta
  const s = slot(slug, 4, 'ro')
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
  const s = slot(slug, 7, 'kn')
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
  if (s === 4) {
    return `If English isn't your first language, ask ${agencyShort} whether ${stateName} permits interpreters for knowledge exams or offers study guides in other languages—policies differ by office.`
  }
  if (s === 5) {
    return `Combination Vehicles and Air Brakes tests stack on top of General Knowledge for typical tractor-trailer applicants. ${agencyShort} can print a checklist so you don't pay for tests your employer will never use.`
  }
  return `Schedule knowledge tests through ${agencyShort} once you hold a valid medical certificate. ${stateName} may require a CLP holding period before skills testing—verify current wait times before you commit to a training school.`
}

export function buildSkillsParagraph(stateName: string, meta: CdlStateMeta, slug: string): string {
  const s = slot(slug, 7, 'sk')
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
  if (s === 4) {
    return `Automatic vs manual transmission restrictions appear on some CDLs if you test without certain equipment. ${stateName} examiners document what you tested in—ask employers whether that restriction blocks the trucks you'd drive day one.`
  }
  if (s === 5) {
    return `Pre-trip inspection scripts vary slightly by examiner; practice the same sequence every time so muscle memory carries you through nerves on test day in ${stateName}.`
  }
  return `Some carriers sponsor training and provide trucks for testing. If you're testing privately, ensure registration, insurance, and vehicle class match the CDL you're pursuing—${stateName} examiners will turn away mismatched equipment.`
}

export function buildTrainingParagraph(stateName: string, meta: CdlStateMeta, slug: string): string {
  const s = slot(slug, 7, 'tr')
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
  if (s === 4) {
    return `ELDT (Entry-Level Driver Training) rules apply to many first-time Class A or certain upgrade paths—confirm your school appears on FMCSA's registry and that ${meta.agencyShort} recognizes the completion certificate you receive.`
  }
  if (s === 5) {
    return `Refresher courses help if you let a CDL lapse or are returning after years away; ${stateName} schools sometimes tailor shorter programs than full beginner academies.`
  }
  return `Veterans' benefits and workforce grants sometimes apply to CDL training—ask schools and ${meta.agencyShort} about eligibility.`
}

export function buildNextStepsParagraph(stateName: string, slug: string): string {
  const s = slot(slug, 6, 'nx')
  if (s === 0) {
    return `Start with our free General Knowledge practice tests, then study ${stateName}'s CDL manual. Book knowledge tests only after you're consistently passing practice exams—retakes cost time and money.`
  }
  if (s === 1) {
    return `Earn your CLP, complete training if needed, then schedule skills testing before your permit expires. Track all fees and appointment confirmations; ${stateName} offices may require online scheduling.`
  }
  if (s === 2) {
    return `Join forums and talk to recent grads from your area—local nuances (test sites, examiners' expectations) matter. Pair book study with hands-on practice in the vehicle class you'll test in.`
  }
  if (s === 3) {
    return `Screenshot your CLP and appointment confirmations; ${stateName} offices occasionally reschedule weather or staffing. Keep copies of medical cards and endorsements in the truck once you're hired.`
  }
  if (s === 4) {
    return `If you're job-hunting while testing, ask recruiters which endorsements they reimburse—some pay for HazMat after hire, which changes your study order.`
  }
  return `After licensing, consider which endorsements your employer needs next. ${stateName} CDL holders often add HazMat or Tanker after their first year—plan study time between runs.`
}

/** Varied H2s so page outlines differ in HTML, not only body text */
export function headingsForGuide(stateName: string, slug: string) {
  const pick = (salt: string) => slot(slug, 3, salt)
  return {
    issuing: [
      `Who issues CDLs in ${stateName}?`,
      `${stateName} CDL authority: where to start`,
      `Commercial driver licensing in ${stateName}`,
    ][pick('h0')],
    context: [
      `Why ${stateName} CDL applicants plan ahead`,
      `${stateName} trucking context before you test`,
      `Local angle: getting licensed in ${stateName}`,
    ][pick('h1')],
    requirements: [
      `${stateName} CDL requirements (overview)`,
      `Age, medical card, and permits in ${stateName}`,
      `What you need before testing in ${stateName}`,
    ][pick('h2')],
    knowledge: [
      `CDL knowledge tests`,
      `Written exams and endorsements in ${stateName}`,
      `Passing ${stateName}'s CDL written tests`,
    ][pick('h3')],
    skills: [
      `Skills test (behind-the-wheel)`,
      `Road test and inspection in ${stateName}`,
      `Your ${stateName} CDL skills exam`,
    ][pick('h4')],
    training: [
      `CDL training options in ${stateName}`,
      `Schools and employer programs in ${stateName}`,
      `Where to train for your ${stateName} CDL`,
    ][pick('h5')],
    next: [
      `Next steps`,
      `Checklist: after you finish reading`,
      `Moving forward with your ${stateName} CDL`,
    ][pick('h6')],
  }
}

/** Requirements body — 8 variants; weaves uniqueAngle so overlap with other states drops */
export function buildRequirementsBody(
  stateName: string,
  meta: CdlStateMeta,
  uniqueAngle: string,
  slug: string
): string {
  const { agencyShort, capital } = meta
  const v = slot(slug, 8, 'rq')
  const hook = uniqueAngle

  if (v === 0) {
    return `${hook} Federally, you need to be 18 for intrastate CDL work in ${stateName} and 21 for interstate. Hold a valid ${stateName} operator license (or complete out-of-state transfer steps), carry a current Medical Examiner's Certificate, and pass knowledge and skills tests for your class. ${agencyShort} publishes current fee tables and ID checklists—download them before you visit ${capital}.`
  }
  if (v === 1) {
    return `Before you sit for exams, ${agencyShort} will expect proof of identity, lawful presence, and ${stateName} residency where applicable. ${hook} The DOT physical is non-negotiable for non-excepted interstate operation; intrastate drivers follow ${stateName} medical rules tied to federal standards.`
  }
  if (v === 2) {
    return `${hook} Once eligible, you'll apply for a CLP, pass applicable knowledge tests, wait any required holding period, then schedule a skills test in a vehicle matching the CDL class. ${agencyShort} offices in and around ${capital} often handle the highest volume—rural sites may offer shorter waits but fewer weekly slots.`
  }
  if (v === 3) {
    return `Endorsements (tank, HazMat, passenger, etc.) add knowledge tests—and HazMat adds TSA background steps. ${hook} Map every endorsement to your target job before you pay fees at ${agencyShort}, since retakes add up.`
  }
  if (v === 4) {
    return `If you're upgrading from Class B to A, or adding/removing restrictions, ${agencyShort} treats that as a new testing sequence for the pieces that changed. ${hook} Bring registration and insurance for any vehicle you supply for the skills test.`
  }
  if (v === 5) {
    return `${hook} Military CDL skills-test waiver programs sometimes apply in ${stateName} for qualifying veterans—ask ${agencyShort} whether your MOS and discharge status fit current rules before skipping training you might still want for insurance or employers.`
  }
  if (v === 6) {
    return `Out-of-state CDL holders moving to ${stateName} typically surrender the old credential and pass any ${stateName}-specific tests not covered by reciprocity. ${hook} Start online if ${agencyShort} offers appointment scheduling—it saves a wasted trip to ${capital}.`
  }
  return `${hook} New entrants to trucking should budget for CLP fees, each knowledge attempt, skills test fees, and third-party tester charges if used. ${agencyShort} can itemize what's due at each step so you don't stall mid-process.`
}

/** Checklist-style requirements (different HTML shape than paragraph-only guides) */
export function buildRequirementsChecklist(stateName: string, meta: CdlStateMeta, capital: string): string[] {
  return [
    `Meet age rules: 18+ intrastate / 21+ interstate CDL work originating in ${stateName}`,
    `Hold a valid ${stateName} driver license or complete transfer if new to the state`,
    `DOT medical certificate on file before non-excepted operation`,
    `Pass knowledge tests for class and endorsements through ${meta.agencyShort}`,
    `Obtain a CLP and complete any required waiting period before skills testing`,
    `Schedule skills test in ${capital} or another authorized ${meta.agencyShort} location with the correct vehicle class`,
  ]
}

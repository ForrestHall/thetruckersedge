import {
  buildContent,
  heading,
  paragraph,
} from '@/lib/lexical-blocks'
import {
  buildKnowledgeParagraph,
  buildNextStepsParagraph,
  buildRegionalOpening,
  buildSkillsParagraph,
  buildTrainingParagraph,
  buildUniqueExcerpt,
  getCdlStateMeta,
} from '@/data/cdl-state-facts'

export type StateCdlGuidePayload = {
  slug: string
  title: string
  excerpt: string
  relatedEndorsements: string[]
  content: ReturnType<typeof buildContent>
}

/**
 * Rich, state-specific CDL guide body (reduces duplicate/thin SEO content vs one global template).
 */
export function buildStateCdlGuidePayload(stateName: string, slug: string): StateCdlGuidePayload | null {
  const meta = getCdlStateMeta(slug)
  if (!meta) return null

  const slugFull = `how-to-get-cdl-${slug}`

  const blocks = [
    heading('h2', `Who issues CDLs in ${stateName}?`),
    paragraph(buildRegionalOpening(stateName, meta, slug)),
    heading('h2', `${stateName} CDL requirements (overview)`),
    paragraph(
      `To get a Commercial Driver's License in ${stateName}, you must meet federal age rules: at least 18 for intrastate operation and 21 for interstate. You need a valid ${stateName} driver's license (or transfer process if new to the state), a current DOT medical certificate, and passing scores on the knowledge and skills tests for your class and endorsements. ${meta.agencyShort} publishes fee schedules and ID requirements.`
    ),
    heading('h2', 'CDL knowledge tests'),
    paragraph(buildKnowledgeParagraph(stateName, meta, slug)),
    heading('h2', 'Skills test (behind-the-wheel)'),
    paragraph(buildSkillsParagraph(stateName, meta, slug)),
    heading('h2', `CDL training options in ${stateName}`),
    paragraph(buildTrainingParagraph(stateName, meta, slug)),
    heading('h2', 'Next steps'),
    paragraph(buildNextStepsParagraph(stateName, slug)),
  ]

  return {
    slug: slugFull,
    title: `How to Get Your CDL in ${stateName} (2026 Guide)`,
    excerpt: buildUniqueExcerpt(stateName, meta, slug),
    relatedEndorsements: ['general-knowledge', 'air-brakes'],
    content: buildContent(blocks),
  }
}

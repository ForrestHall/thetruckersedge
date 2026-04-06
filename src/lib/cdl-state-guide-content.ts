import {
  buildContent,
  bulletList,
  heading,
  paragraph,
} from '@/lib/lexical-blocks'
import {
  buildGuideTitle,
  buildKnowledgeParagraph,
  buildNextStepsParagraph,
  buildRegionalOpening,
  buildRequirementsBody,
  buildRequirementsChecklist,
  buildSkillsParagraph,
  buildTrainingParagraph,
  buildUniqueExcerpt,
  getCdlStateMeta,
  headingsForGuide,
  slot,
} from '@/data/cdl-state-facts'
import { getCdlUniqueAngle } from '@/data/cdl-state-unique-angles'

export type StateCdlGuidePayload = {
  slug: string
  title: string
  excerpt: string
  relatedEndorsements: string[]
  content: ReturnType<typeof buildContent>
}

/**
 * State CDL guides: unique angle + varied headings, section order, checklist vs prose.
 * Re-run `npm run enrich:cdl-guides` after changing generators to refresh Payload.
 */
export function buildStateCdlGuidePayload(stateName: string, slug: string): StateCdlGuidePayload | null {
  const meta = getCdlStateMeta(slug)
  const uniqueAngle = getCdlUniqueAngle(slug)
  if (!meta || !uniqueAngle) return null

  const h = headingsForGuide(stateName, slug)
  const slugFull = `how-to-get-cdl-${slug}`

  const blocks: object[] = [
    heading('h2', h.issuing),
    paragraph(buildRegionalOpening(stateName, meta, slug)),
    heading('h2', h.context),
    paragraph(uniqueAngle),
    heading('h2', h.requirements),
  ]

  const useChecklist = slot(slug, 2, 'bl') === 0
  if (useChecklist) {
    blocks.push(bulletList(buildRequirementsChecklist(stateName, meta, meta.capital)))
    blocks.push(
      paragraph(
        `Policies and fees change—confirm every line item with ${meta.agencyShort} before you pay. Waivers, endorsements, and out-of-state transfers have extra steps not shown in a short list.`
      )
    )
  } else {
    blocks.push(paragraph(buildRequirementsBody(stateName, meta, uniqueAngle, slug)))
  }

  const knowledgeBlocks = [heading('h2', h.knowledge), paragraph(buildKnowledgeParagraph(stateName, meta, slug))]
  const skillsBlocks = [heading('h2', h.skills), paragraph(buildSkillsParagraph(stateName, meta, slug))]
  const trainingBlocks = [heading('h2', h.training), paragraph(buildTrainingParagraph(stateName, meta, slug))]

  const order = slot(slug, 3, 'ord')
  if (order === 0) {
    blocks.push(...knowledgeBlocks, ...skillsBlocks, ...trainingBlocks)
  } else if (order === 1) {
    blocks.push(...trainingBlocks, ...knowledgeBlocks, ...skillsBlocks)
  } else {
    blocks.push(...skillsBlocks, ...trainingBlocks, ...knowledgeBlocks)
  }

  blocks.push(heading('h2', h.next), paragraph(buildNextStepsParagraph(stateName, slug)))

  return {
    slug: slugFull,
    title: buildGuideTitle(stateName, slug),
    excerpt: buildUniqueExcerpt(stateName, meta, slug),
    relatedEndorsements: ['general-knowledge', 'air-brakes'],
    content: buildContent(blocks),
  }
}

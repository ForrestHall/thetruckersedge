import { generateText } from 'ai'
import { createXai } from '@ai-sdk/xai'
import { z } from 'zod'

const schema = z.object({
  score: z.number().min(1).max(10),
  rewritten: z.string().max(100),
  /** Search result title (~50–60 chars); may match rewritten or be tighter for SERP */
  metaTitle: z.string().max(65),
  /** SERP snippet: 150–160 characters, factual, include trucking context when natural */
  metaDescription: z.string().max(165),
})

export type NewsScoreResult = z.infer<typeof schema>

const xai = createXai({ apiKey: process.env.XAI_API_KEY })

export async function scoreAndRewriteHeadline(
  originalTitle: string,
  source: string
): Promise<NewsScoreResult | null> {
  try {
    const { text } = await generateText({
      model: xai('grok-3-mini-latest'),
      prompt: `You are a trucking news editor. For this headline, return JSON only with no extra text:
{"score": <1-10>, "rewritten": "<catchy headline max 70 chars>", "metaTitle": "<SEO page title ~50-60 chars for search results>", "metaDescription": "<SERP snippet 150-160 chars: summarize what the story covers; factual; optional trucking keywords if natural>"}

Score 1-10 for viral potential among truck drivers. BE STRICT. Most items should score 3-5. Reserve 7+ only for stories that would genuinely get truckers talking or sharing.

Low (1-3): Routine corporate news, minor product updates, annual reports, generic "Company X announces...", press-release filler.
Mid (4-6): Industry updates, equipment news, operational tips—useful but not highly engaging.
High (7-10): Regulations affecting drivers (ELD, HOS, drug testing), pay/rates, safety incidents, driver shortage, controversy, funny slice-of-life stories (relatable trucker humor, road stories, lighthearted content drivers would share).

Keep rewritten factual. No clickbait. Punchy for truckers.

metaTitle: Optimized for Google (primary keywords front-loaded when possible). Do not exceed 60 characters if you can help it.
metaDescription: One or two sentences; no HTML; end with a period.

Headline: "${originalTitle}"
Source: ${source}`,
    })

    const raw = JSON.parse(text.trim()) as Record<string, unknown>
    const score = z.number().min(1).max(10).parse(raw.score)
    const rewritten = z.string().max(100).parse(raw.rewritten)

    let metaTitle =
      typeof raw.metaTitle === 'string' && raw.metaTitle.trim().length > 0
        ? raw.metaTitle.trim().slice(0, 65)
        : rewritten.slice(0, 60)

    let metaDescription =
      typeof raw.metaDescription === 'string' && raw.metaDescription.trim().length > 0
        ? raw.metaDescription.trim().slice(0, 165)
        : `${rewritten}. Trucking industry news from ${source}.`.slice(0, 165)

    if (metaDescription.length < 100) {
      metaDescription = `${metaDescription} Updates for CDL holders and fleet operators.`.slice(0, 165)
    }

    return schema.parse({ score, rewritten, metaTitle, metaDescription })
  } catch {
    return null
  }
}

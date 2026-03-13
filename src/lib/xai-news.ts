import { generateText } from 'ai'
import { createXai } from '@ai-sdk/xai'
import { z } from 'zod'

const schema = z.object({
  score: z.number().min(1).max(10),
  rewritten: z.string().max(100),
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
{"score": <1-10>, "rewritten": "<catchy headline max 70 chars>"}

Score 1-10 for viral potential among truck drivers. Consider: regulatory impact, safety, pay/rates, controversy, driver-interest. 10 = highly viral.
Keep rewritten factual. No clickbait. Punchy for truckers.

Headline: "${originalTitle}"
Source: ${source}`,
    })

    const parsed = JSON.parse(text.trim()) as unknown
    return schema.parse(parsed)
  } catch {
    return null
  }
}

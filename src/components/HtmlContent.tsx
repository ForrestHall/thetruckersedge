'use client'

import { processHtmlMediaUrls } from '@/lib/media'

interface HtmlContentProps {
  html: string
  className?: string
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html || typeof html !== 'string') return null

  const processedHtml = processHtmlMediaUrls(html)

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}

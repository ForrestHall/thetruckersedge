'use client'

interface HtmlContentProps {
  html: string
  className?: string
}

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html || typeof html !== 'string') return null

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

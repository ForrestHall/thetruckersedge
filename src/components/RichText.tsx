import React from 'react'

interface RichTextNode {
  type?: string
  tag?: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  children?: RichTextNode[]
  url?: string
  fields?: { url?: string; newTab?: boolean }
  listType?: string
  value?: { url?: string; alt?: string; width?: number; height?: number }
  relationTo?: string
}

function renderNode(node: RichTextNode, index: number): React.ReactNode {
  if (node.text !== undefined) {
    let content: React.ReactNode = node.text
    if (node.bold) content = <strong key={index}>{content}</strong>
    if (node.italic) content = <em key={index}>{content}</em>
    if (node.underline) content = <u key={index}>{content}</u>
    return content
  }

  const children = node.children?.map((child, i) => renderNode(child, i)) ?? null

  switch (node.type) {
    case 'h1': return <h1 key={index}>{children}</h1>
    case 'h2': return <h2 key={index}>{children}</h2>
    case 'h3': return <h3 key={index}>{children}</h3>
    case 'h4': return <h4 key={index} className="text-lg font-semibold text-brand-navy mt-5 mb-2">{children}</h4>
    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof JSX.IntrinsicElements
      return React.createElement(Tag, { key: index }, children)
    }
    case 'ul': return <ul key={index}>{children}</ul>
    case 'ol': return <ol key={index}>{children}</ol>
    case 'li': return <li key={index}>{children}</li>
    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return React.createElement(ListTag, { key: index }, children)
    }
    case 'listitem': return <li key={index}>{children}</li>
    case 'link': {
      const url = node.fields?.url || node.url || '#'
      return (
        <a key={index} href={url} target={node.fields?.newTab ? '_blank' : undefined} rel="noopener noreferrer">
          {children}
        </a>
      )
    }
    case 'upload': {
      if (node.value?.url) {
        return (
          <img
            key={index}
            src={node.value.url}
            alt={node.value.alt || ''}
            width={node.value.width}
            height={node.value.height}
            className="rounded-lg my-6 w-full"
          />
        )
      }
      return null
    }
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-brand-yellow pl-4 italic text-gray-600 my-6">
          {children}
        </blockquote>
      )
    default:
      return <p key={index}>{children}</p>
  }
}

export function RichText({ content }: { content: unknown }) {
  if (!content) return null

  const data = content as { root?: { children?: RichTextNode[] }; children?: RichTextNode[] }
  const nodes = data?.root?.children || data?.children || []

  return <>{nodes.map((node, i) => renderNode(node, i))}</>
}

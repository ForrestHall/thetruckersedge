/**
 * Shared Lexical (Payload richText) block builders for seed scripts and CDL guide content.
 */

export function paragraph(text: string) {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }],
  }
}

export function heading(tag: 'h1' | 'h2' | 'h3' | 'h4', text: string) {
  return {
    type: 'heading',
    tag,
    version: 1,
    children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }],
  }
}

export function listItem(text: string) {
  return {
    type: 'listitem',
    version: 1,
    value: 1,
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }],
      },
    ],
  }
}

export function bulletList(items: string[]) {
  return {
    type: 'list',
    listType: 'bullet',
    version: 1,
    tag: 'ul',
    children: items.map((t) => listItem(t)),
  }
}

export function buildContent(blocks: object[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      children: blocks,
      direction: 'ltr' as const,
      format: '',
      indent: 0,
    },
  }
}

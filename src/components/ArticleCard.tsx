import Link from 'next/link'

interface ArticleCardProps {
  article: {
    id: string | number
    title: string
    slug: string
    excerpt?: string | null
    publishedAt?: string | null
    category?: { name?: string } | string | number | null
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const categoryName =
    typeof article.category === 'object' && article.category !== null
      ? article.category.name
      : null

  return (
    <Link href={`/guides/${article.slug}`} className="card p-6 flex flex-col gap-3">
      {categoryName && (
        <span className="text-xs font-semibold text-brand-yellow uppercase tracking-wide">{categoryName}</span>
      )}
      <h3 className="text-lg font-bold text-brand-navy leading-snug">{article.title}</h3>
      {article.excerpt && (
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between mt-1">
        {article.publishedAt && (
          <span className="text-xs text-gray-400">
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        )}
        <span className="text-brand-yellow text-sm font-semibold ml-auto">Read more →</span>
      </div>
    </Link>
  )
}

'use client'

import { useState } from 'react'

export function ProcessNewsButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ processed?: number; error?: string } | null>(null)

  async function handleClick() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/process-news', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setResult({ error: data.error ?? 'Request failed' })
        return
      }
      setResult({ processed: data.processed, error: data.error })
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        AI News Processing
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Fetch RSS feeds, score headlines with xAI, and update Processed News Items.
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing…' : 'Process News Now'}
      </button>
      {result && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {result.error ? (
            <span className="text-red-600 dark:text-red-400">Error: {result.error}</span>
          ) : (
            <span>Processed {result.processed ?? 0} items.</span>
          )}
        </p>
      )}
    </div>
  )
}

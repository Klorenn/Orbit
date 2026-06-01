// src/hooks/useFilecoinBlog.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFilecoinBlog } from './useFilecoinBlog'
import { supabase } from '../lib/supabase'

const mockArticles = [
  {
    title: 'Filecoin Foundation Update',
    description: 'Latest news from the Filecoin Foundation.',
    image: 'https://filecoin.io/img/article.jpg',
    url: 'https://filecoin.io/blog/update',
    published_at: '2026-06-01T00:00:00Z',
  },
]

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  },
}))

function setupFreshCache() {
  supabase.functions.invoke.mockResolvedValue({ data: { count: 1 }, error: null })
  supabase.from.mockReturnValue({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        maybeSingle: vi.fn().mockResolvedValue({
          data: { articles: mockArticles, fetched_at: new Date().toISOString() },
          error: null,
        }),
      })),
    })),
  })
}

describe('useFilecoinBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupFreshCache()
  })

  it('starts in loading state with empty articles', () => {
    const { result } = renderHook(() => useFilecoinBlog())
    expect(result.current.loading).toBe(true)
    expect(result.current.articles).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('loads articles from blog_cache after mount', async () => {
    const { result } = renderHook(() => useFilecoinBlog())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.articles).toEqual(mockArticles)
    expect(result.current.error).toBeNull()
  })

  it('does not invoke edge function when cache is fresh (fetched_at is now)', async () => {
    const { result } = renderHook(() => useFilecoinBlog())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(supabase.functions.invoke).not.toHaveBeenCalled()
  })
})

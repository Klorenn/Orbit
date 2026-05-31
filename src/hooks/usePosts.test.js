import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePosts } from './usePosts'

const mockPosts = [{ id: 'p1', title: 'Test Post', cat: 'reports', body: ['hello'], author: 'olga.fil', upvotes: 5, created_at: new Date().toISOString() }]

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: mockPosts, error: null }),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: 'p99', title: 'New Post' }, error: null }),
        })),
      })),
    })),
  },
}))

describe('usePosts', () => {
  it('starts with SEED_POSTS (non-empty)', async () => {
    const { result } = renderHook(() => usePosts())
    expect(result.current.posts.length).toBeGreaterThan(0)
  })

  it('fetchPosts replaces posts with supabase data when data returned', async () => {
    const { result } = renderHook(() => usePosts())
    await act(async () => { await result.current.fetchPosts() })
    expect(result.current.posts).toEqual(mockPosts)
  })

  it('createPost calls supabase insert and adds post to state', async () => {
    const { result } = renderHook(() => usePosts())
    let newPost
    await act(async () => {
      newPost = await result.current.createPost({ cat: 'reports', type: 'Report', title: 'New Post', body: ['body'], evidence: [], author: '0xABC', cidStr: 'bafyxyz' })
    })
    expect(newPost.id).toBe('p99')
  })
})

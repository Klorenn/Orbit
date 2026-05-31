import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth } from './useAuth'

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}))

import { useAccount } from 'wagmi'

describe('useAuth', () => {
  beforeEach(() => {
    useAccount.mockReturnValue({ isConnected: false, address: undefined })
  })

  it('returns connected=false when no wallet and no session', async () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.connected).toBe(false)
  })

  it('returns connected=true when wallet is connected', () => {
    useAccount.mockReturnValue({ isConnected: true, address: '0xABC' })
    const { result } = renderHook(() => useAuth())
    expect(result.current.connected).toBe(true)
  })

  it('identity is wallet address when wallet connected', () => {
    useAccount.mockReturnValue({ isConnected: true, address: '0xABC123' })
    const { result } = renderHook(() => useAuth())
    expect(result.current.identity).toBe('0xABC123')
  })
})

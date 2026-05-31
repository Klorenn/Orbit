import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLighthouse } from './useLighthouse'

vi.mock('@lighthouse-web3/sdk', () => ({
  default: {
    upload: vi.fn().mockResolvedValue({ data: { Hash: 'bafy_test_hash_abc123' } }),
  },
}))

describe('useLighthouse', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_LIGHTHOUSE_API_KEY', 'test-api-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns uploadFiles function', () => {
    const { result } = renderHook(() => useLighthouse())
    expect(typeof result.current.uploadFiles).toBe('function')
  })

  it('uploadFiles returns CID string from lighthouse', async () => {
    const { result } = renderHook(() => useLighthouse())
    const file = new File(['hello world'], 'test.txt', { type: 'text/plain' })
    const cidResult = await result.current.uploadFiles([file])
    expect(cidResult).toBe('bafy_test_hash_abc123')
  })

  it('uploadFiles throws if no API key', async () => {
    vi.stubEnv('VITE_LIGHTHOUSE_API_KEY', '')
    const { result } = renderHook(() => useLighthouse())
    await expect(result.current.uploadFiles([new File(['x'], 'x.txt')])).rejects.toThrow('VITE_LIGHTHOUSE_API_KEY not set')
  })
})

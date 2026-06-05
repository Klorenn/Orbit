import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const LS_PROFILE = 'orbit-profile'
const LS_AVATAR  = 'orbit-avatar'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_PROFILE) || '{}') } catch { return {} }
}

async function upsertPublicProfile(identity, fields) {
  if (!identity) return
  const { error } = await supabase.from('public_profiles').upsert(
    { identity, ...fields, updated_at: new Date().toISOString() },
    { onConflict: 'identity' }
  )
  if (error) console.error('[useProfile] upsert failed:', error.message)
}

export function useProfile(identity) {
  const [profile, setProfileRaw] = useState(loadLocal)
  const [avatar, setAvatarState] = useState(() => localStorage.getItem(LS_AVATAR) || 'blue')

  // Sync from Supabase on mount (prefer DB over stale localStorage)
  useEffect(() => {
    if (!identity) return
    async function syncFromDB() {
      const { data } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('identity', identity)
        .maybeSingle()
      if (!data) return
      const { avatar: remoteAvatar, identity: _i, created_at: _c, updated_at: _d, ...rest } = data
      const merged = { ...rest }
      setProfileRaw(merged)
      localStorage.setItem(LS_PROFILE, JSON.stringify(merged))
      if (remoteAvatar) {
        setAvatarState(remoteAvatar)
        localStorage.setItem(LS_AVATAR, remoteAvatar)
      }
    }
    syncFromDB()
  }, [identity])

  const saveProfile = useCallback(async (updates) => {
    const next = { ...loadLocal(), ...updates }
    localStorage.setItem(LS_PROFILE, JSON.stringify(next))
    setProfileRaw(next)
    await upsertPublicProfile(identity, next)
  }, [identity])

  const saveAvatar = useCallback(async (col) => {
    localStorage.setItem(LS_AVATAR, col)
    setAvatarState(col)
    await upsertPublicProfile(identity, { avatar: col })
  }, [identity])

  return { profile, avatar, saveProfile, saveAvatar }
}

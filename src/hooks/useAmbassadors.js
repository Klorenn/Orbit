import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { AMBASSADORS } from '../data/constants'

export function useAmbassadors() {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase
        .from('public_profiles')
        .select('*')
        .order('karma', { ascending: false })
      if (!data || data.length === 0) return
      data.forEach(p => {
        AMBASSADORS[p.identity] = {
          ...(AMBASSADORS[p.identity] || {}),
          name: p.handle || p.identity,
          color: p.avatar || 'blue',
          bio: p.bio || '',
          city: p.city || '',
          socials: typeof p.socials === 'object' ? p.socials : {},
          banner: p.banner || 'green',
          addr: p.identity,
          karma: p.karma || 0,
          role: AMBASSADORS[p.identity]?.role || 'Ambassador',
        }
      })
      setProfiles(data)
    }
    fetchProfiles()
  }, [])

  // Only DB profiles — no static mock ambassadors
  const merged = profiles
    .filter(p => p.identity !== 'you.fil')
    .map(p => ({
      name: p.handle || p.identity,
      color: p.avatar || 'blue',
      bio: p.bio || '',
      city: p.city || '',
      socials: typeof p.socials === 'object' ? p.socials : {},
      banner: p.banner || 'green',
      addr: p.identity,
      karma: p.karma || 0,
      role: AMBASSADORS[p.identity]?.role || 'Ambassador',
    }))

  return { profiles, ambassadors: merged }
}

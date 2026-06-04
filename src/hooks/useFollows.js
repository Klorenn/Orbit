import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFollows(identity) {
  const [following, setFollowing] = useState([])

  useEffect(() => {
    if (!identity) { setFollowing([]); return }
    supabase
      .from('follows')
      .select('following')
      .eq('follower', identity)
      .then(({ data }) => setFollowing(data ? data.map(r => r.following) : []))
  }, [identity])

  const toggleFollow = async (target) => {
    if (!identity || !target || target === identity) return
    const isFollowing = following.includes(target)
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower', identity).eq('following', target)
      setFollowing(f => f.filter(x => x !== target))
    } else {
      await supabase.from('follows').insert({ follower: identity, following: target })
      setFollowing(f => [...f, target])
    }
  }

  return { following, toggleFollow }
}

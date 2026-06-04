import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { RANKS } from '../data/constants'

const DEFAULT_ROLE_COLORS = {
  Admin: '#FF3B30',
  Moderator: '#A855F7',
  Core: '#0090FF',
}
const DEFAULT_RANK_COLORS = Object.fromEntries(RANKS.map(r => [r.label, r.color]))
export const DEFAULT_TAG_COLORS = { ...DEFAULT_RANK_COLORS, ...DEFAULT_ROLE_COLORS }

export function useForumConfig() {
  const [tagColors, setTagColors] = useState(DEFAULT_TAG_COLORS)

  useEffect(() => {
    supabase.from('forum_config').select('value').eq('key', 'tag_colors').maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          try { setTagColors({ ...DEFAULT_TAG_COLORS, ...JSON.parse(data.value) }) } catch (_) {}
        }
      })
  }, [])

  const saveTagColors = async (colors) => {
    const merged = { ...tagColors, ...colors }
    setTagColors(merged)
    await supabase.from('forum_config')
      .upsert({ key: 'tag_colors', value: JSON.stringify(merged), updated_at: new Date().toISOString() })
  }

  return { tagColors, saveTagColors }
}

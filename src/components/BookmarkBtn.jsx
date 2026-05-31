import { useState, useEffect } from 'react'
import { I } from './Icons'

const SAVED_KEY = 'orbit-saved'
export function getSaved() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]') } catch { return [] } }
function toggleSaved(id) { const s = getSaved(); const i = s.indexOf(id); if (i < 0) s.push(id); else s.splice(i, 1); localStorage.setItem(SAVED_KEY, JSON.stringify(s)); window.dispatchEvent(new CustomEvent('orbit-saved')); return i < 0; }
export function useSaved() {
  const [saved, setSaved] = useState(getSaved)
  useEffect(() => {
    const h = () => setSaved(getSaved())
    window.addEventListener('orbit-saved', h)
    return () => window.removeEventListener('orbit-saved', h)
  }, [])
  return saved
}

export function BookmarkBtn({ id, compact }) {
  const saved = useSaved()
  const on = saved.includes(id)
  return (
    <button
      className={'icon-btn bookmark-btn' + (on ? ' on' : '') + (compact ? ' compact' : '')}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSaved(id) }}
      title={on ? 'Remove bookmark' : 'Bookmark'}
    >
      {I.bookmark ? I.bookmark({ width: 15, height: 15 }) : '🔖'}
      {!compact && <span>{on ? 'Saved' : 'Save'}</span>}
    </button>
  )
}

export function ShareBtn({ path, title, compact }) {
  const share = async (e) => {
    e.preventDefault(); e.stopPropagation()
    const url = window.location.origin + window.location.pathname + (path || window.location.hash)
    if (navigator.share) { try { await navigator.share({ title: title || 'Orbit Forum', url }) } catch {} }
    else { await navigator.clipboard.writeText(url); window.dispatchEvent(new CustomEvent('orbit-toast', { detail: 'Link copied' })) }
  }
  return (
    <button className={'icon-btn share-btn' + (compact ? ' compact' : '')} onClick={share} title="Share">
      {I.link ? I.link({ width: 15, height: 15 }) : '🔗'}
      {!compact && <span>Share</span>}
    </button>
  )
}

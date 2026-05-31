import { useBookmarks } from '../contexts/BookmarksContext'
import { I } from './Icons'
import { useT } from '../hooks/useT'

export function useSaved() { return useBookmarks().saved }

export function BookmarkBtn({ id, compact }) {
  const { saved, toggle } = useBookmarks()
  const { t } = useT()
  const on = saved.includes(id)
  return (
    <button
      className={'icon-btn bookmark-btn' + (on ? ' on' : '') + (compact ? ' compact' : '')}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(id) }}
      title={on ? t('savedBookmark') : t('saveBookmark')}
    >
      {I.bookmark ? I.bookmark({ width: 15, height: 15 }) : '🔖'}
      {!compact && <span>{on ? t('savedBookmark') : t('saveBookmark')}</span>}
    </button>
  )
}

export function ShareBtn({ path, title, compact }) {
  const { t } = useT()
  const share = async (e) => {
    e.preventDefault(); e.stopPropagation()
    const url = window.location.origin + window.location.pathname + (path || window.location.hash)
    if (navigator.share) { try { await navigator.share({ title: title || 'Orbit Forum', url }) } catch {} }
    else { await navigator.clipboard.writeText(url); window.dispatchEvent(new CustomEvent('orbit-toast', { detail: t('savedBookmark') })) }
  }
  return (
    <button className={'icon-btn share-btn' + (compact ? ' compact' : '')} onClick={share} title={t('shareLabel')}>
      {I.link ? I.link({ width: 15, height: 15 }) : '🔗'}
      {!compact && <span>{t('shareLabel')}</span>}
    </button>
  )
}

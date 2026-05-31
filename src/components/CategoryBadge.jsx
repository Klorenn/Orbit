// src/components/CategoryBadge.jsx
import { catOf } from '../data/constants'

export function CategoryBadge({ cat, soft }) {
  const c = catOf(cat)
  return <span className={'tag ' + (soft ? 'soft' : '')}><span className="dot" style={{ background: c.color }}></span>{c.name}</span>
}

// src/components/Vote.jsx
import { I } from './Icons'

export function Vote({ count, voted, onToggle, row }) {
  return (
    <div className="vote" style={row ? { flexDirection: 'row', gap: 8 } : null}>
      <button className={voted ? 'voted' : ''} onClick={(e) => {e.stopPropagation();e.preventDefault();onToggle();}} aria-label="Upvote"><I.up /></button>
      <span className="n">{count}</span>
    </div>
  )
}

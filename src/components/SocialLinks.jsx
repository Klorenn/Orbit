// src/components/SocialLinks.jsx
import { SOCIALS } from '../data/constants'
import { I } from './Icons'

export function socialIcon(key, props) {
  return ({ github: I.gh, x: I.x, instagram: I.instagram, discord: I.discord, slack: I.slack, telegram: I.telegram, website: I.globe }[key] || I.globe)(props)
}

function socialURL(key, val) {
  if (!val) return null
  const p = { github: 'https://github.com/', x: 'https://x.com/', instagram: 'https://instagram.com/', telegram: 'https://t.me/', website: val.startsWith('http') ? '' : 'https://' }[key]
  if (p === undefined) return null
  return p + val.replace(/^@/, '')
}

export function SocialLinks({ socials, size = 'md' }) {
  if (!socials) return null
  const items = SOCIALS.filter((s) => socials[s.key])
  if (items.length === 0) return null
  return (
    <div className={'socials-row ' + size}>
      {items.map((s) => {
        const val = socials[s.key]
        const url = socialURL(s.key, val)
        const handle = s.key === 'website' ? val : (s.prefix ? '@' : '') + val
        const inner = <><span className={'sc-ic sc-' + s.key}>{socialIcon(s.key)}</span><span className="sl-val">{handle}</span></>
        return url ?
          <a key={s.key} className="social-chip" href={url} target="_blank" rel="noopener" title={s.label}>{inner}</a> :
          <span key={s.key} className="social-chip" title={s.label}>{inner}</span>
      })}
    </div>
  )
}

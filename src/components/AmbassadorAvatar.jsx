// src/components/AmbassadorAvatar.jsx
import { AMBASSADORS, AV, COLORHEX } from '../data/constants'
import { I } from './Icons'

export function AmbassadorAvatar({ user, size = 40, link = true, nft }) {
  const u = AMBASSADORS[user] || { name: user, color: 'blue' }
  const color = COLORHEX[u.color] || '#0090FF'
  const src = AV[u.color]
  const img = src
    ? <img src={src} alt={u.name} width={size} height={size} style={{ borderRadius: '50%', objectFit: 'cover' }} />
    : <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, color: '#fff', fontWeight: 700 }}>
        {u.name[0].toUpperCase()}
      </div>
  const inner = (
    <span className="avatar-wrap" style={{ position: 'relative', display: 'inline-flex' }}>
      {img}
      {nft && <span className="nft-dot" style={{ position:'absolute', bottom:0, right:0, width:size*0.3, height:size*0.3, background:'#0090FF', borderRadius:'50%', border:'2px solid var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>{I.check({width:size*0.16,height:size*0.16,color:'#fff'})}</span>}
    </span>
  )
  if (!link) return inner
  return <a href={'#/profile/' + u.name}>{inner}</a>
}

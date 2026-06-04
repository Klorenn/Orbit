// src/components/AmbassadorAvatar.jsx
import { AMBASSADORS, AV, COLORHEX } from '../data/constants'
import { I } from './Icons'

function hexToHue(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  if (max === min) return 0
  const d = max - min
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0)
           : max === g ? (b - r) / d + 2
           : (r - g) / d + 4
  return h * 60
}

const BASE_HUE = 206 // hue of the blue astronaut base image (#0090FF)

export function AmbassadorAvatar({ user, size = 40, link = true, nft, color: colorOverride }) {
  const u = AMBASSADORS[user] || { name: user, color: 'blue' }
  const resolvedColor = colorOverride || u.color || 'blue'
  const isHex = resolvedColor.startsWith('#')
  const color = isHex ? resolvedColor : (COLORHEX[resolvedColor] || '#0090FF')
  const src = isHex ? AV['blue'] : AV[resolvedColor]
  const imgStyle = { borderRadius: '50%', objectFit: 'cover' }
  if (isHex) {
    const rotation = Math.round(hexToHue(resolvedColor) - BASE_HUE)
    imgStyle.filter = `hue-rotate(${rotation}deg) saturate(1.4)`
  }
  const img = src
    ? <img src={src} alt={u.name} width={size} height={size} style={imgStyle} />
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
  return <a href={'/profile/' + u.name}>{inner}</a>
}

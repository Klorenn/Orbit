// src/components/Stars.jsx
export function Stars({ n = 14 }) {
  const pts = [[30,30],[90,60],[150,25],[220,50],[270,35],[60,120],[130,150],[200,130],[260,160],[40,170],[110,90],[180,75],[240,110],[290,140]]
  return (
    <svg className="pc-stars" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {pts.slice(0, n).map((s, i) => <circle key={i} cx={s[0]} cy={s[1]} r={i % 3 === 0 ? 1.4 : 0.9} fill="#fff" opacity={0.45 + i % 3 * 0.16} />)}
    </svg>
  )
}

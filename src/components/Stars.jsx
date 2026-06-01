export function Stars({ n = 14, seed = 1 }) {
  const pts = Array.from({ length: n }, (_, i) => {
    const s = Math.sin(i * 127.1 + seed) * 43758.5453
    const t = Math.sin(i * 311.7 + seed) * 43758.5453
    return [((s - Math.floor(s)) * 300), ((t - Math.floor(t)) * 200)]
  })
  return (
    <svg className="pc-stars" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {pts.map((s, i) => <circle key={i} cx={s[0]} cy={s[1]} r={i % 4 === 0 ? 1.5 : i % 3 === 0 ? 1.1 : 0.7} fill="#fff" opacity={0.3 + (i % 5) * 0.12} />)}
    </svg>
  )
}

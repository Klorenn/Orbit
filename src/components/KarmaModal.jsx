import { RANKS, rankOf, karmaBreakdown } from '../data/constants'

export function KarmaModal({ karma, onClose }) {
  const breakdown = karmaBreakdown({ karma })
  const rank = rankOf(karma)
  const nextRank = RANKS.find(r => r.min > karma)

  return (
    <div className="modal-scrim open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 'min(440px, 100%)' }}>
        <div className="modal-head">
          <h2>Karma</h2>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-.04em' }}>{karma}</div>
            <div>
              <div style={{ fontWeight: 600, color: rank.color, fontSize: 14 }}>{rank.label}</div>
              {nextRank && (
                <div style={{ fontSize: 12, color: 'rgba(var(--ink-rgb),.5)', marginTop: 2 }}>
                  {nextRank.min - karma} karma para {nextRank.label}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink-rgb),.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
              Cómo se distribuye
            </div>
            {breakdown.map(s => (
              <div key={s.label} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{s.label}</span>
                  <span style={{ color: s.tone, fontWeight: 600 }}>{s.value}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'rgba(var(--ink-rgb),.08)' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: s.tone, width: karma > 0 ? s.pct + '%' : '0%', transition: 'width .4s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(var(--ink-rgb),.04)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Cómo ganar karma</div>
            <div style={{ fontSize: 12.5, color: 'rgba(var(--ink-rgb),.65)', lineHeight: 1.55 }}>
              Cada upvote que recibe uno de tus posts suma 1 karma. Publicá reportes de eventos, propuestas de gobernanza y contribuciones técnicas — el contenido útil atrae más votos.
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink-rgb),.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
              Rangos
            </div>
            {RANKS.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', opacity: karma >= r.min ? 1 : 0.35 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                <div style={{ fontSize: 13, fontWeight: karma >= r.min ? 600 : 400 }}>{r.label}</div>
                <div style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(var(--ink-rgb),.45)' }}>{r.min}+</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

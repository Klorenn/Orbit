import { useState, useEffect } from 'react'
import { PROP_STATUS, who } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { CategoryBadge } from '../components/CategoryBadge'
import { useT } from '../hooks/useT'

export function ProposalsView({ proposals = [] }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const [filter, setFilter] = useState('All')
  const statuses = ['All', 'Draft', 'Discussion', 'Voting', 'Approved']
  const list = proposals.filter(p => filter === 'All' || p.status === filter)
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{I.gov({ width: 26, height: 26 })} {t('proposalsTitle')}</h1>
      <p className="page-sub">{t('proposalsSub')}</p>
      <div className="sortbar" style={{ marginBottom: 20, width: 'fit-content' }}>
        {statuses.map(s => <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>{s}</button>)}
      </div>
      <div className="prop-list">
        {list.map(p => {
          const h = who(p.author)
          const inner = (
            <>
              <div className="pl-top">
                <span className="status-pill" style={{ background: PROP_STATUS[p.status] + '22', color: PROP_STATUS[p.status] }}>● {p.status}</span>
                <CategoryBadge cat={p.cat} soft />
              </div>
              <div className="pl-title">{p.title}</div>
              <p className="pl-sum">{p.summary}</p>
              <div className="pl-meta">
                <AmbassadorAvatar user={p.author} size={22} link={false} /> <span className="nm">{h.name}</span>
                <span className="dotsep"></span><span>{I.up({ width: 13, height: 13 })} {p.forVotes}</span>
                <span className="dotsep"></span><span>{I.cmt()} {p.comments}</span>
              </div>
            </>
          )
          return p.threadId
            ? <a key={p.id} className="prop-row" href={'#/forum/' + p.cat + '/' + p.threadId}>{inner}</a>
            : <div key={p.id} className="prop-row">{inner}</div>
        })}
      </div>
    </div>
  )
}

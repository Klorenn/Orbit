import { useEffect } from 'react'
import { PROP_STATUS, who } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { CategoryBadge } from '../components/CategoryBadge'

const FLOW = ['Draft', 'Discussion', 'Voting', 'Approved']

export function ProposalDetailView({ id, proposals = [], posts }) {
  useEffect(() => { window.scrollTo(0, 0) }, [id])
  const pr = proposals.find(p => p.id === id)
  if (!pr) return <div className="page-wrap"><p className="empty">Proposal not found. <a href="#/proposals">All proposals</a></p></div>
  const author = who(pr.author)
  const stageIdx = FLOW.indexOf(pr.status)
  const thread = pr.threadId ? posts.find(p => p.id === pr.threadId) : null
  const pct = Math.min(100, Math.round(pr.forVotes / 2))
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/proposals">{I.back()} All proposals</a>
      <div className="pl-top" style={{ marginTop: 14, marginBottom: 12 }}>
        <span className="status-pill" style={{ background: PROP_STATUS[pr.status] + '22', color: PROP_STATUS[pr.status] }}>● {pr.status}</span>
        <CategoryBadge cat={pr.cat} soft />
      </div>
      <h1 className="dt">{pr.title}</h1>
      <div className="detail-author">
        <AmbassadorAvatar user={pr.author} size={44} nft />
        <div><div className="nm"><a href={'#/profile/' + author.name}>{author.name}</a> <span className="role">{author.role}</span></div><div className="sub">{author.city}</div></div>
      </div>

      <div className="prop-flow">
        {FLOW.map((s, i) => (
          <div key={s} className={'pf-step' + (i <= stageIdx ? ' done' : '') + (i === stageIdx ? ' current' : '')}>
            <span className="pf-dot">{i < stageIdx ? I.check() : i + 1}</span>
            <span className="pf-label">{s}</span>
            {i < FLOW.length - 1 && <span className="pf-line"></span>}
          </div>
        ))}
      </div>

      <p className="prose" style={{ marginTop: 10 }}>{pr.summary} This proposal is currently in the <strong>{pr.status}</strong> stage. Rough consensus reached here can be promoted to Metropolis for formal FIP signaling.</p>

      <div className="vote-bar-card">
        <div className="vbc-top"><span>In favor</span><span><strong>{pr.forVotes}</strong> signals</span></div>
        <div className="vote-bar"><span style={{ width: pct + '%' }}></span></div>
        <div className="vbc-actions">
          <button className="pill pill-blue">{I.up({ width: 15, height: 15 })} Signal support</button>
          {thread
            ? <a className="pill pill-line" href={'#/forum/' + thread.cat + '/' + thread.id}>{I.cmt()} Open discussion ({pr.comments})</a>
            : <button className="pill pill-line">{I.cmt()} {pr.comments} comments</button>}
        </div>
      </div>
    </div>
  )
}

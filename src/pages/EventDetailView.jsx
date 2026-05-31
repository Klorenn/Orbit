import { useEffect } from 'react'
import { EVENTS, who } from '../data/constants'
import { I } from '../components/Icons'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { PostCard } from '../components/PostCard'

export function EventDetailView({ id, posts }) {
  useEffect(() => { window.scrollTo(0, 0) }, [id])
  const ev = EVENTS.find(e => e.id === id)
  if (!ev) return <div className="page-wrap"><p className="empty">Event not found. <a href="#/events">All events</a></p></div>
  const host = who(ev.host)
  const recap = posts.find(p => p.cat === 'reports' && p.author === ev.host)
  const agenda = ['Doors open + welcome', 'Filecoin storage 101', 'Live storage-deal demo', 'Project lightning talks', 'Open networking']
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/events">{I.back()} All events</a>
      <div className="ev-detail-hero">
        <div className="evd-date"><span className="ev-mon">{ev.month}</span><span className="ev-day">{ev.day}</span></div>
        <div>
          <span className="status-pill" style={{ background: ev.status === 'upcoming' ? 'rgba(16,185,129,.14)' : 'rgba(10,10,10,.06)', color: ev.status === 'upcoming' ? '#0a7a55' : 'rgba(10,10,10,.5)' }}>● {ev.status === 'upcoming' ? 'Upcoming' : 'Past'}</span>
          <h1 className="dt" style={{ marginTop: 10 }}>{ev.title}</h1>
          <div className="evd-meta">{I.cal({ width: 15, height: 15 })} {ev.when} · {ev.city}</div>
        </div>
      </div>
      <div className="evd-cols">
        <div>
          <p className="prose"><span>{ev.spots}. Join fellow ambassadors for a hands-on session — bring a laptop and curiosity. Reading the forum is open to all; connect your wallet to RSVP and post your own recap afterward.</span></p>
          <h3 className="section-h">Agenda</h3>
          <ol className="agenda">{agenda.map((a, i) => <li key={i}><span>{i + 1}</span>{a}</li>)}</ol>
          {recap && ev.status === 'past' && <>
            <h3 className="section-h">Recap report</h3>
            <PostCard post={recap} onVote={() => {}} />
          </>}
        </div>
        <aside className="evd-side">
          <div className="rail-card">
            <h4>Host</h4>
            <a className="evd-host" href={'#/profile/' + host.name}>
              <AmbassadorAvatar user={ev.host} size={44} link={false} nft />
              <div><div className="amb-name">{host.name}</div><div className="amb-city">{host.city}</div></div>
            </a>
            <button className="pill pill-blue" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>{ev.status === 'upcoming' ? "I'll be there" : 'View recap'}</button>
          </div>
        </aside>
      </div>
    </div>
  )
}

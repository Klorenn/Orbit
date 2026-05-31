import { useEffect } from 'react'
import { EVENTS, who } from '../data/constants'
import { I } from '../components/Icons'

export function EventsView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const upcoming = EVENTS.filter(e => e.status === 'upcoming')
  const past = EVENTS.filter(e => e.status === 'past')
  const Card = ({ e }) => {
    const h = who(e.host)
    return (
      <div className="event-card">
        <div className="ev-date"><span className="ev-mon">{e.month}</span><span className="ev-day">{e.day}</span></div>
        <div className="ev-body">
          <div className="ev-title">{e.title}</div>
          <div className="ev-meta">{e.city} · hosted by <a href={'#/profile/' + h.name}>{h.name}</a></div>
          <div className="ev-spots">{e.spots}</div>
        </div>
        <a className="pill pill-line" href={'#/events/' + e.id}>{e.status === 'upcoming' ? 'Details' : 'Recap'}</a>
      </div>
    )
  }
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">{I.cal({ width: 26, height: 26 })} Events</h1>
      <p className="page-sub">Ambassador meetups, workshops, and recaps across the constellation.</p>
      <h3 className="section-h">Upcoming</h3>
      <div className="event-list">{upcoming.map(e => <Card key={e.id} e={e} />)}</div>
      <h3 className="section-h">Past</h3>
      <div className="event-list">{past.map(e => <Card key={e.id} e={e} />)}</div>
    </div>
  )
}

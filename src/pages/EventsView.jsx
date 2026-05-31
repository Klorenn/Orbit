import { useEffect } from 'react'
import { who } from '../data/constants'
import { I } from '../components/Icons'
import { useT } from '../hooks/useT'

export function EventsView({ events = [], myRsvps = [], connected, onRsvp, onCancel }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const upcoming = events.filter(e => e.status === 'upcoming')
  const past = events.filter(e => e.status === 'past')
  const Card = ({ e }) => {
    const h = who(e.host)
    const rsvped = myRsvps.includes(e.id)
    return (
      <div className="event-card">
        <div className="ev-date"><span className="ev-mon">{e.month}</span><span className="ev-day">{e.day}</span></div>
        <div className="ev-body">
          <div className="ev-title">{e.title}</div>
          <div className="ev-meta">{e.city} · hosted by <a href={'#/profile/' + h.name}>{h.name}</a></div>
          <div className="ev-spots">{e.spots}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {e.status === 'upcoming' && connected && (
            <button className={'pill ' + (rsvped ? 'pill-line' : 'pill-blue')} onClick={() => rsvped ? onCancel(e.id) : onRsvp(e.id)}>
              {rsvped ? '✓ Going' : 'RSVP'}
            </button>
          )}
          <a className="pill pill-line" href={'#/events/' + e.id}>{e.status === 'upcoming' ? 'Details' : 'Recap'}</a>
        </div>
      </div>
    )
  }
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{I.cal({ width: 26, height: 26 })} {t('eventsTitle')}</h1>
      <p className="page-sub">Ambassador meetups, workshops, and recaps across the constellation.</p>
      <h3 className="section-h">{t('upcomingEvents')}</h3>
      <div className="event-list">{upcoming.map(e => <Card key={e.id} e={e} />)}</div>
      <h3 className="section-h">{t('pastEvents')}</h3>
      <div className="event-list">{past.map(e => <Card key={e.id} e={e} />)}</div>
    </div>
  )
}

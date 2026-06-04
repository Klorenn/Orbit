/* ============================================================
   ORBIT FORUM — Meetings (list, live room, propose) + Onboarding
   ============================================================ */
import { useState, useEffect, useRef } from 'react'
import { MEETINGS, MEETING_KIND, AMBASSADORS, BANNERS, AVATAR_OPTIONS, AV, ME, who, navTo } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'
import { useT } from '../hooks/useT'

const meetingHost = (m) => who(m.host)

/* download an .ics calendar invite for a meeting */
function addToCalendar(m, t) {
  const now = new Date();
  const start = new Date(now.getTime() + 24 * 3600 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(start.getTime() + (m.durationMin || 50) * 60000);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Orbit//Meetings//EN', 'BEGIN:VEVENT',
    'UID:' + m.id + '@orbit.gov', 'DTSTAMP:' + fmt(now), 'DTSTART:' + fmt(start), 'DTEND:' + fmt(end),
    'SUMMARY:' + (m.title || 'Orbit meeting').replace(/,/g, '\\,'),
    'DESCRIPTION:' + (m.desc || '').replace(/,/g, '\\,'), 'LOCATION:Orbit Room', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orbit-' + m.id + '.ics';
  document.body.appendChild(a); a.click(); a.remove();
  window.dispatchEvent(new CustomEvent('orbit-toast', { detail: t('flashCalendarDownloaded') }));
}

/* ---------- attendee avatar stack ---------- */
function AvatarStack({ names, max = 5, size = 30 }) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <div className="av-stack">
      {shown.map((n, i) => <span className="av-stack-item" key={n} style={{ zIndex: max - i, marginLeft: i ? -10 : 0 }}><AmbassadorAvatar user={n} size={size} link={false} /></span>)}
      {extra > 0 && <span className="av-stack-more" style={{ marginLeft: -10 }}>+{extra}</span>}
    </div>
  );
}

/* ============================================================
   MEETINGS LIST
   ============================================================ */
export function MeetingsView({ meetings, onJoin }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { t } = useT()
  const live = meetings.filter(m => m.status === 'live');
  const upcoming = meetings.filter(m => m.status === 'upcoming');
  const past = meetings.filter(m => m.status === 'ended');

  const Card = ({ m }) => {
    const h = meetingHost(m);
    const color = MEETING_KIND[m.kind] || '#0090FF';
    const joined = m.attendees.includes('you.fil');
    return (
      <div className={'meet-card' + (m.status === 'live' ? ' is-live' : '')}>
        <div className="mc-top">
          <span className="kind-chip" style={{ background: color + '1f', color }}>{m.kind}</span>
          {m.status === 'live' && <span className="live-badge"><span className="live-dot"></span>{t('liveNow')}</span>}
          {m.status === 'upcoming' && <span className="meet-when">{I.cal({ width: 14, height: 14 })} {m.when}</span>}
          {m.status === 'ended' && <span className="meet-when ended">{t('endedLabel')} · {m.when}</span>}
        </div>
        <a className="mc-title" href={'/meetings/' + m.id}>{m.title}</a>
        <p className="mc-desc">{m.desc}</p>
        <div className="mc-foot">
          <div className="mc-host">
            <AmbassadorAvatar user={m.host} size={26} />
            <span>{t('hostedBy')} <b>{h.name}</b></span>
          </div>
          <AvatarStack names={m.attendees} />
        </div>
        <div className="mc-actions">
          <span className="mc-count">{I.users({ width: 14, height: 14 })} {m.attendees.length}{m.capacity ? (' / ' + m.capacity) : ''}</span>
          {m.status === 'live' && <a className="pill pill-live" href={'/meetings/' + m.id} onClick={() => onJoin(m.id)}>{I.video({ width: 15, height: 15 })} {t('joinNow')}</a>}
          {m.status === 'upcoming' && <button className="mc-cal" onClick={() => addToCalendar(m, t)} title={t('agendaLabel')}>{I.cal({ width: 14, height: 14 })}</button>}
          {m.status === 'upcoming' && <a className={'pill ' + (joined ? 'pill-line' : 'pill-blue')} href={'/meetings/' + m.id} onClick={(e) => { if (!joined) { e.preventDefault(); onJoin(m.id); } }}>{joined ? ('✓ ' + t('going')) : t('rsvp')}</a>}
          {m.status === 'ended' && <a className="pill pill-line" href={'/meetings/' + m.id}>{t('viewRecap')}</a>}
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrap">
      <a className="back-link" href="/forum">{I.back()} {t('backToForum')}</a>
      <div className="meet-head">
        <div>
          <h1 className="page-title">{I.video({ width: 26, height: 26 })} {t('meetingsTitle')}</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>{t('meetingsSub')}</p>
        </div>
        <a className="pill pill-solid" href="/meetings/new">{I.plus()} {t('proposeMeetingTitle')}</a>
      </div>

      {live.length > 0 && <>
        <h3 className="section-h"><span className="live-dot" style={{ marginRight: 8 }}></span>{t('liveNowSection')} · {live.length}</h3>
        <div className="meet-grid">{live.map(m => <Card key={m.id} m={m} />)}</div>
      </>}
      <h3 className="section-h">{t('upcomingSection')} · {upcoming.length}</h3>
      <div className="meet-grid">{upcoming.map(m => <Card key={m.id} m={m} />)}</div>
      {past.length > 0 && <>
        <h3 className="section-h">{t('pastSection')}</h3>
        <div className="meet-grid">{past.map(m => <Card key={m.id} m={m} />)}</div>
      </>}
    </div>
  );
}

/* ============================================================
   MEETING ROOM — powered by Jitsi Meet
   ============================================================ */
export function MeetingRoomView({ id, meetings, onJoin, onLeave }) {
  const { t } = useT()
  const m = meetings.find(x => x.id === id)
  const containerRef = useRef(null)
  const apiRef = useRef(null)

  useEffect(() => {
    if (!m || m.status === 'ended') return

    function initJitsi() {
      if (!window.JitsiMeetExternalAPI || !containerRef.current || apiRef.current) return
      apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName: 'orbit-forum-' + id,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: true,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
        },
        userInfo: { displayName: ME.name },
      })
      apiRef.current.addEventListener('readyToClose', () => {
        if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
        onLeave && onLeave(id)
        navTo('/meetings')
      })
    }

    const existing = document.getElementById('jitsi-api-script')
    if (existing && window.JitsiMeetExternalAPI) {
      initJitsi()
    } else if (!existing) {
      const script = document.createElement('script')
      script.id = 'jitsi-api-script'
      script.src = 'https://meet.jit.si/external_api.js'
      script.onload = initJitsi
      document.head.appendChild(script)
    }

    return () => {
      if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
    }
  }, [id, m?.status])

  if (!m) return (
    <div className="page-wrap">
      <p className="empty">{t('meetingNotFound')} <a href="/meetings">{t('allMeetings')}</a></p>
    </div>
  )

  if (m.status === 'ended') {
    const h = meetingHost(m)
    const notes = ['Kicked off the LatAm regional hub with intros from 6 ambassadors.', 'Agreed on a shared monthly cadence and a rotating host.', 'Action items: Olga drafts the hub charter; Tunde maps overlapping timezones.']
    return (
      <div className="page-wrap">
        <a className="back-link" href="/meetings">{I.back()} {t('allMeetings')}</a>
        <div className="recap-hero">
          <span className="meet-when ended">{t('endedLabel')} · {m.when}</span>
          <h1 className="dt" style={{ marginTop: 8 }}>{m.title}</h1>
          <div className="recap-meta"><AmbassadorAvatar user={m.host} size={26} /> {t('hostedBy')} <b>{h.name}</b> · {m.attendees.length} {t('attendees')} · {m.durationMin} min</div>
        </div>
        <div className="recap-video"><span className="rv-play">{I.video({ width: 30, height: 30 })}</span><span className="rv-label">{t('recordingPinned')}</span></div>
        <h3 className="section-h">{t('notesLabel')}</h3>
        <ul className="recap-notes">{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
        <h3 className="section-h">{t('whoCame')}</h3>
        <div className="recap-people">{m.attendees.map(n => { const u = who(n); return <a key={n} className="rp-chip" href={'/profile/' + u.name}><AmbassadorAvatar user={n} size={24} link={false} />{u.name}</a>; })}</div>
      </div>
    )
  }

  const handleLeave = () => {
    if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
    onLeave && onLeave(id)
    navTo('/meetings')
  }

  return (
    <div className="room-jitsi">
      <div className="rj-header">
        <button className="rj-back" onClick={handleLeave}>{I.back()} {t('leaveLobby')}</button>
        <div className="rj-title">
          {m.status === 'live' && <span className="live-badge"><span className="live-dot"></span>{t('liveLabel')}</span>}
          <span>{m.title}</span>
        </div>
        <span className="rj-count">{I.users({ width: 14, height: 14 })} {m.attendees.length}</span>
      </div>
      <div ref={containerRef} className="rj-container" />
    </div>
  )
}

/* ============================================================
   PROPOSE A MEETING
   ============================================================ */
const MEET_KINDS = ['Community', 'Proposal', 'Workshop', 'Admin'];
export function ProposeMeetingView({ connected, onConnect, onPublish }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const { t } = useT()
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('Community');
  const [when, setWhen] = useState('');
  const [cap, setCap] = useState('30');
  const [desc, setDesc] = useState('');
  const [startNow, setStartNow] = useState(false);
  const canPost = title.trim() && (startNow || when.trim());
  const submit = () => {
    if (!canPost) return;
    if (!connected) { onConnect(); return; }
    onPublish({
      id: 'm' + Date.now(), title: title.trim(), kind,
      when: startNow ? t('nowJustStarted') : when.trim(),
      capacity: Number(cap) || 30,
      desc: desc.trim() || 'An open Orbit meeting.',
      status: startNow ? 'live' : 'upcoming',
      host: ME.name, attendees: [ME.name], speaking: null,
      durationMin: 50,
    });
  };
  return (
    <div className="page-wrap compose">
      <a className="back-link" href="/meetings">{I.back()} {t('proposeMeetingBack')}</a>
      <h1 className="page-title">{t('proposeMeetingTitle')}</h1>
      <p className="page-sub">{t('meetingsHostSub')}</p>

      <div className="field">
        <label>{t('titleLabel')}</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('meetingTitlePlaceholder')} />
      </div>
      <div className="field">
        <label>{t('typeLabel')}</label>
        <div className="type-row">{MEET_KINDS.map(k => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>)}</div>
      </div>
      <div className="field">
        <label>{t('meetingWhenLabel')}</label>
        <div className="when-row">
          <label className={'now-toggle' + (startNow ? ' on' : '')}><input type="checkbox" checked={startNow} onChange={e => setStartNow(e.target.checked)} /><span className="live-dot"></span>{t('startLiveNow')}</label>
          {!startNow && <input type="text" value={when} onChange={e => setWhen(e.target.value)} placeholder={t('meetingWhenPlaceholder')} />}
        </div>
      </div>
      <div className="field">
        <label>{t('meetingCapacityLabel')}</label>
        <input type="number" value={cap} onChange={e => setCap(e.target.value)} min="2" max="500" style={{ maxWidth: 140 }} />
      </div>
      <div className="field">
        <label>{t('meetingDescLabel')}</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t('meetingDescPlaceholder')} style={{ minHeight: 110 }} />
      </div>
      <div className="compose-foot">
        <span className="note">{I.shield()} {t('hostedAs')} {ME.name} · {t('visibleToAll')}</span>
        <button className="pill pill-blue" onClick={submit} style={{ opacity: canPost ? 1 : .5, padding: '11px 24px' }}>{startNow ? t('startMeeting') : t('scheduleMeeting')}</button>
      </div>
    </div>
  );
}

/* ============================================================
   ONBOARDING — first wallet connection
   ============================================================ */
export function OnboardingView({ onFinish }) {
  const [step, setStep] = useState(0);
  const [verifyDone, setVerifyDone] = useState(false);
  const [avatar, setAvatar] = useState('blue');
  const [banner, setBanner] = useState('green');
  const [handle, setHandle] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const { t } = useT()
  const STEPS = [t('onbStepWelcome'), t('onbStepVerify'), t('onbStepAvatar'), t('onbStepBanner'), t('onbStepProfile'), t('onbStepDone')];

  useEffect(() => { window.scrollTo(0, 0); }, [step]);
  useEffect(() => {
    if (step === 1 && !verifyDone) { const timer = setTimeout(() => setVerifyDone(true), 1900); return () => clearTimeout(timer); }
  }, [step]);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const finish = () => {
    if (onFinish) onFinish({ avatar, banner, profile: { handle: handle.trim(), banner, city: city.trim() || 'Your node', bio: bio.trim() || 'New Filecoin Orbit ambassador.' } });
    else navTo('/forum');
  };

  return (
    <div className="onb">
      <div className="onb-stars"><Stars n={16} /></div>
      <div className="onb-shell">
        <div className="onb-rail">
          <a className="onb-brand" href="/forum">
            <svg className="logo" viewBox="0 0 256 256" fill="none" aria-hidden="true"><ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="currentColor" strokeWidth="15" /><circle cx="128" cy="128" r="33" fill="currentColor" /><circle cx="173" cy="69" r="17" fill="currentColor" /></svg>
            <span>Orbit</span>
          </a>
          <div className="onb-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={'onb-step' + (i === step ? ' on' : '') + (i < step ? ' done' : '')}>
                <span className="os-dot">{i < step ? I.check() : i + 1}</span><span className="os-label">{s}</span>
              </div>
            ))}
          </div>
          <div className="onb-foot-note">{I.shield()} {t('onbWalletNote')}</div>
        </div>

        <div className="onb-main">
          {step === 0 && (
            <div className="onb-pane onb-welcome">
              <span className="onb-eyebrow"><span className="live-dot" style={{ background: '#0090FF' }}></span>{t('onbWalletConnected')}</span>
              <h1>{t('onbWelcomeTitle')}</h1>
              <p>{t('onbWelcomeBody')}</p>
              <div className="onb-wallet"><AmbassadorAvatar user="you.fil" size={40} link={false} /><div><div className="ow-addr">{ME.fulladdr ? ME.fulladdr.slice(0, 6) + '…' + ME.fulladdr.slice(-4) : ME.addr}</div><div className="ow-net">{t('onbWalletNet')}</div></div><span className="ow-check">{I.check()}</span></div>
              <button className="pill pill-blue onb-cta" onClick={next}>{t('onbLetsGo')} {I.back({ style: { transform: 'rotate(180deg)' }, width: 15, height: 15 })}</button>
            </div>
          )}

          {step === 1 && (
            <div className="onb-pane onb-center">
              <div className={'verify-orb' + (verifyDone ? ' ok' : '')}>
                {verifyDone ? I.check({ width: 46, height: 46 }) : <span className="verify-spin"></span>}
              </div>
              <h1>{verifyDone ? t('onbCredFound') : t('onbCheckingWallet')}</h1>
              <p>{verifyDone ? t('onbCredBody') : t('onbCheckingBody')}</p>
              <button className="pill pill-blue onb-cta" onClick={next} disabled={!verifyDone} style={{ opacity: verifyDone ? 1 : .5 }}>{t('onbContinue')}</button>
            </div>
          )}

          {step === 2 && (
            <div className="onb-pane">
              <h1>{t('onbPickAvatar')}</h1>
              <p>{t('onbPickAvatarBody')}</p>
              <div className="onb-avatars">
                {AVATAR_OPTIONS.map(col => (
                  <button key={col} className={'ap-opt' + (avatar === col ? ' on' : '')} onClick={() => setAvatar(col)} aria-label={col}>
                    <img src={AV[col]} alt={col} />{avatar === col && <span className="ap-check">{I.check()}</span>}
                  </button>
                ))}
              </div>
              <div className="onb-nav"><button className="pill pill-ghost" onClick={back}>{t('onbBack')}</button><button className="pill pill-blue" onClick={next}>{t('onbContinue')}</button></div>
            </div>
          )}

          {step === 3 && (
            <div className="onb-pane">
              <h1>{t('onbPickBanner')}</h1>
              <p>{t('onbPickBannerBody')}</p>
              <div className="onb-banners">
                {BANNERS.map(b => (
                  <button key={b.id} className={'bn-opt' + (banner === b.id ? ' on' : '')} onClick={() => setBanner(b.id)} style={{ backgroundImage: 'url(' + b.src + ')' }}>
                    <span className="bn-label">{b.label}</span>{banner === b.id && <span className="bn-check">{I.check()}</span>}
                  </button>
                ))}
              </div>
              <div className="onb-nav"><button className="pill pill-ghost" onClick={back}>{t('onbBack')}</button><button className="pill pill-blue" onClick={next}>{t('onbContinue')}</button></div>
            </div>
          )}

          {step === 4 && (
            <div className="onb-pane">
              <h1>{t('onbIntroTitle')}</h1>
              <p>{t('onbIntroBody')}</p>
              <div className="onb-form">
                <div className="field"><label>{t('onbHandleLabel')}</label><input type="text" value={handle} onChange={e => setHandle(e.target.value)} placeholder={ME.addr} maxLength={32} /></div>
                <div className="field"><label>{t('onbCityLabel')}</label><input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder={t('onbCityPlaceholder')} /></div>
                <div className="field"><label>{t('onbBioLabel')}</label><textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t('onbBioPlaceholder')} style={{ minHeight: 84 }} /></div>
              </div>
              <div className="onb-nav"><button className="pill pill-ghost" onClick={back}>{t('onbBack')}</button><button className="pill pill-blue" onClick={next}>{t('onbContinue')}</button></div>
            </div>
          )}

          {step === 5 && (
            <div className="onb-pane onb-center">
              <div className="onb-preview" style={{ backgroundImage: 'url(' + ((BANNERS.find(b => b.id === banner) || {}).src || '') + ')' }}>
                <div className="op-scrim"></div>
                <img className="op-av" src={AV[avatar]} alt="" />
                <div className="op-name">{ME.name}</div>
                <div className="op-city">{city.trim() || 'Your node'}</div>
              </div>
              <h1>{t('onbAllSet')}</h1>
              <p>{t('onbAllSetBody')}</p>
              <button className="pill pill-blue onb-cta" onClick={finish}>{I.spark({ width: 16, height: 16 })} {t('onbEnterOrbit')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

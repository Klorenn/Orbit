/* ============================================================
   ORBIT FORUM — Meetings (list, live room, propose) + Onboarding
   ============================================================ */
import { useState, useEffect, useRef } from 'react'
import { MEETINGS, MEETING_KIND, AMBASSADORS, BANNERS, AVATAR_OPTIONS, AV, ME, who, navTo } from '../data/constants'
import { I } from '../components/Icons'
import { Stars } from '../components/Stars'
import { AmbassadorAvatar } from '../components/AmbassadorAvatar'

const meetingHost = (m) => who(m.host)

/* download an .ics calendar invite for a meeting */
function addToCalendar(m) {
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
  window.dispatchEvent(new CustomEvent('orbit-toast', { detail: 'Calendar invite downloaded' }));
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
          {m.status === 'live' && <span className="live-badge"><span className="live-dot"></span>Live now</span>}
          {m.status === 'upcoming' && <span className="meet-when">{I.cal({ width: 14, height: 14 })} {m.when}</span>}
          {m.status === 'ended' && <span className="meet-when ended">Ended · {m.when}</span>}
        </div>
        <a className="mc-title" href={'#/meetings/' + m.id}>{m.title}</a>
        <p className="mc-desc">{m.desc}</p>
        <div className="mc-foot">
          <div className="mc-host">
            <AmbassadorAvatar user={m.host} size={26} />
            <span>Hosted by <b>{h.name}</b></span>
          </div>
          <AvatarStack names={m.attendees} />
        </div>
        <div className="mc-actions">
          <span className="mc-count">{I.users({ width: 14, height: 14 })} {m.attendees.length}{m.capacity ? (' / ' + m.capacity) : ''}</span>
          {m.status === 'live' && <a className="pill pill-live" href={'#/meetings/' + m.id} onClick={() => onJoin(m.id)}>{I.video({ width: 15, height: 15 })} Join now</a>}
          {m.status === 'upcoming' && <button className="mc-cal" onClick={() => addToCalendar(m)} title="Add to calendar">{I.cal({ width: 14, height: 14 })}</button>}
          {m.status === 'upcoming' && <a className={'pill ' + (joined ? 'pill-line' : 'pill-blue')} href={'#/meetings/' + m.id} onClick={(e) => { if (!joined) { e.preventDefault(); onJoin(m.id); } }}>{joined ? '✓ Going' : 'RSVP'}</a>}
          {m.status === 'ended' && <a className="pill pill-line" href={'#/meetings/' + m.id}>View recap</a>}
        </div>
      </div>
    );
  };

  return (
    <div className="page-wrap">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <div className="meet-head">
        <div>
          <h1 className="page-title">{I.video({ width: 26, height: 26 })} Meetings</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>Live calls and scheduled sessions — proposed by ambassadors and admins. Drop in, raise your hand, and be seen.</p>
        </div>
        <a className="pill pill-solid" href="#/meetings/new">{I.plus()} Propose a meeting</a>
      </div>

      {live.length > 0 && <>
        <h3 className="section-h"><span className="live-dot" style={{ marginRight: 8 }}></span>Live now · {live.length}</h3>
        <div className="meet-grid">{live.map(m => <Card key={m.id} m={m} />)}</div>
      </>}
      <h3 className="section-h">Upcoming · {upcoming.length}</h3>
      <div className="meet-grid">{upcoming.map(m => <Card key={m.id} m={m} />)}</div>
      {past.length > 0 && <>
        <h3 className="section-h">Past</h3>
        <div className="meet-grid">{past.map(m => <Card key={m.id} m={m} />)}</div>
      </>}
    </div>
  );
}

/* ============================================================
   MEETING ROOM (live video-call style)
   ============================================================ */
export function MeetingRoomView({ id, meetings, onJoin, onLeave }) {
  const m = meetings.find(x => x.id === id);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(false);
  const [hand, setHand] = useState(false);
  const [chat, setChat] = useState([
    { who: 'mira.fil', text: 'Audio is great on my end 👍' },
    { who: 'devi.fil', text: 'Can you share the deck link?' },
  ]);
  const [msg, setMsg] = useState('');
  const [hands, setHands] = useState(['kwame.fil']);
  const endRef = useRef(null);
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [chat]);
  if (!m) return <div className="page-wrap"><p className="empty">Meeting not found. <a href="#/meetings">All meetings</a></p></div>;

  // ended meetings show a recap instead of the live room
  if (m.status === 'ended') {
    const h = meetingHost(m);
    const notes = ['Kicked off the LatAm regional hub with intros from 6 ambassadors.', 'Agreed on a shared monthly cadence and a rotating host.', 'Action items: Olga drafts the hub charter; Tunde maps overlapping timezones.'];
    return (
      <div className="page-wrap">
        <a className="back-link" href="#/meetings">{I.back()} All meetings</a>
        <div className="recap-hero">
          <span className="meet-when ended">Ended · {m.when}</span>
          <h1 className="dt" style={{ marginTop: 8 }}>{m.title}</h1>
          <div className="recap-meta"><AmbassadorAvatar user={m.host} size={26} /> Hosted by <b>{h.name}</b> · {m.attendees.length} attended · {m.durationMin} min</div>
        </div>
        <div className="recap-video"><span className="rv-play">{I.video({ width: 30, height: 30 })}</span><span className="rv-label">Recording · pinned to Filecoin</span></div>
        <h3 className="section-h">Notes</h3>
        <ul className="recap-notes">{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
        <h3 className="section-h">Who came</h3>
        <div className="recap-people">{m.attendees.map(n => { const u = who(n); return <a key={n} className="rp-chip" href={'#/profile/' + u.name}><AmbassadorAvatar user={n} size={24} link={false} />{u.name}</a>; })}</div>
      </div>
    );
  }

  const joined = m.attendees.includes('you.fil');
  const tiles = m.attendees;
  const handUp = hands.includes('you.fil');
  const send = () => { if (!msg.trim()) return; setChat(c => [...c, { who: 'you.fil', text: msg.trim() }]); setMsg(''); };
  const toggleHand = () => {
    setHands(h => h.includes('you.fil') ? h.filter(x => x !== 'you.fil') : [...h, 'you.fil']);
    window.dispatchEvent(new CustomEvent('orbit-toast', { detail: handUp ? 'Hand lowered' : 'Hand raised — the host will see you' }));
  };

  return (
    <div className="room">
      <div className="room-main">
        <div className="room-bar">
          <a className="back-link" href="#/meetings" style={{ margin: 0 }}>{I.back()} Leave lobby</a>
          <div className="room-title">
            {m.status === 'live' && <span className="live-badge"><span className="live-dot"></span>Live</span>}
            <span>{m.title}</span>
          </div>
          <span className="room-count">{I.users({ width: 15, height: 15 })} {tiles.length}</span>
        </div>

        <div className={'tiles tiles-' + Math.min(tiles.length, 6)}>
          {tiles.map(n => {
            const u = who(n); const speaking = m.speaking === n;
            const isYou = n === 'you.fil';
            return (
              <div className={'tile' + (speaking ? ' speaking' : '')} key={n}>
                <div className="tile-av"><AmbassadorAvatar user={n} size={84} link={false} /></div>
                <div className="tile-name">{isYou ? 'You' : u.name}{u.role === 'Core' && <span className="tile-host">Host</span>}{m.host === n && u.role !== 'Core' && <span className="tile-host">Host</span>}</div>
                <span className={'tile-mic' + ((isYou && !mic) ? ' off' : '')}>{(isYou && !mic) ? I.micoff({ width: 13, height: 13 }) : I.mic({ width: 13, height: 13 })}</span>
                {hands.includes(n) && <span className="tile-hand">{I.hand({ width: 13, height: 13 })}</span>}
                {speaking && <span className="tile-ring"></span>}
              </div>
            );
          })}
          {!joined && <div className="tile tile-join" onClick={() => onJoin(m.id)}>
            <span className="tj-ic">{I.video()}</span>
            <span className="tj-label">Tap to join</span>
          </div>}
        </div>

        <div className="room-controls">
          <button className={'rc-btn' + (mic ? '' : ' rc-off')} onClick={() => setMic(v => !v)} title="Mic">{mic ? I.mic() : I.micoff()}</button>
          <button className={'rc-btn' + (cam ? ' rc-on' : '')} onClick={() => setCam(v => !v)} title="Camera">{I.video()}</button>
          <button className={'rc-btn' + (handUp ? ' rc-hand' : '')} onClick={toggleHand} title="Raise hand">{I.hand()}</button>
          {joined
            ? <a className="rc-btn rc-leave" href="#/meetings" onClick={() => onLeave(m.id)} title="Leave">{I.phone()}</a>
            : <button className="rc-join" onClick={() => onJoin(m.id)}>{I.video({ width: 16, height: 16 })} Join meeting</button>}
        </div>
      </div>

      <aside className="room-side">
        {hands.length > 0 && <div className="rs-hands">
          <div className="rs-hands-head">{I.hand({ width: 14, height: 14 })} Raised hands · {hands.length}</div>
          {hands.map(n => { const u = who(n); return <div className="rs-hand-row" key={n}><AmbassadorAvatar user={n} size={26} link={false} /><span>{n === 'you.fil' ? 'You' : u.name}</span></div>; })}
        </div>}
        <div className="rs-head">
          <span>In this room</span><span className="rs-num">{tiles.length}</span>
        </div>
        <div className="rs-people">
          {tiles.map(n => { const u = who(n); return (
            <a className="rs-person" key={n} href={'#/profile/' + u.name}>
              <AmbassadorAvatar user={n} size={32} link={false} />
              <div className="rs-pi"><span className="rs-name">{n === 'you.fil' ? 'You' : u.name}</span><span className="rs-city">{u.city}</span></div>
              {m.speaking === n && <span className="rs-speaking">{I.mic({ width: 13, height: 13 })}</span>}
            </a>
          ); })}
        </div>
        <div className="rs-chat-head">Chat</div>
        <div className="rs-chat" ref={endRef}>
          {chat.map((c, i) => { const u = who(c.who); return (
            <div className="rs-msg" key={i}><AmbassadorAvatar user={c.who} size={26} link={false} /><div><span className="rs-msg-who">{c.who === 'you.fil' ? 'You' : u.name}</span><span className="rs-msg-text">{c.text}</span></div></div>
          ); })}
        </div>
        <div className="rs-compose">
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Message the room…" />
          <button onClick={send} className="rs-send">{I.reply({ width: 15, height: 15 })}</button>
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   PROPOSE A MEETING
   ============================================================ */
const MEET_KINDS = ['Community', 'Proposal', 'Workshop', 'Admin'];
export function ProposeMeetingView({ connected, onConnect, onPublish }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
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
      when: startNow ? 'Now · just started' : when.trim(),
      capacity: Number(cap) || 30,
      desc: desc.trim() || 'An open Orbit meeting.',
      status: startNow ? 'live' : 'upcoming',
      host: ME.name, attendees: [ME.name], speaking: null,
      durationMin: 50,
    });
  };
  return (
    <div className="page-wrap compose">
      <a className="back-link" href="#/meetings">{I.back()} Back to meetings</a>
      <h1 className="page-title">Propose a meeting</h1>
      <p className="page-sub">Ambassadors and admins can host. Schedule it, or start a live room right now.</p>

      <div className="field">
        <label>Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What is this call about?" />
      </div>
      <div className="field">
        <label>Type</label>
        <div className="type-row">{MEET_KINDS.map(k => <button key={k} className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k}</button>)}</div>
      </div>
      <div className="field">
        <label>When</label>
        <div className="when-row">
          <label className={'now-toggle' + (startNow ? ' on' : '')}><input type="checkbox" checked={startNow} onChange={e => setStartNow(e.target.checked)} /><span className="live-dot"></span>Start live now</label>
          {!startNow && <input type="text" value={when} onChange={e => setWhen(e.target.value)} placeholder="e.g. Tomorrow, 16:00 UTC" />}
        </div>
      </div>
      <div className="field">
        <label>Capacity</label>
        <input type="number" value={cap} onChange={e => setCap(e.target.value)} min="2" max="500" style={{ maxWidth: 140 }} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What should people expect? What to bring?" style={{ minHeight: 110 }} />
      </div>
      <div className="compose-foot">
        <span className="note">{I.shield()} Hosted as {ME.name} · visible to all ambassadors</span>
        <button className="pill pill-blue" onClick={submit} style={{ opacity: canPost ? 1 : .5, padding: '11px 24px' }}>{startNow ? 'Start meeting' : 'Schedule meeting'}</button>
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
  const STEPS = ['Welcome', 'Verify', 'Avatar', 'Banner', 'Profile', 'Done'];

  useEffect(() => { window.scrollTo(0, 0); }, [step]);
  // simulate NFT verification on entering step 1
  useEffect(() => {
    if (step === 1 && !verifyDone) { const t = setTimeout(() => setVerifyDone(true), 1900); return () => clearTimeout(t); }
  }, [step]);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const finish = () => {
    if (onFinish) onFinish({ avatar, banner, profile: { banner, city: city.trim() || 'Your node', bio: bio.trim() || 'New Filecoin Orbit ambassador.' } });
    else navTo('#/forum');
  };

  return (
    <div className="onb">
      <div className="onb-stars"><Stars n={16} /></div>
      <div className="onb-shell">
        <div className="onb-rail">
          <a className="onb-brand" href="#/forum">
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
          <div className="onb-foot-note">{I.shield()} Your wallet is your identity. No emails, no passwords.</div>
        </div>

        <div className="onb-main">
          {step === 0 && (
            <div className="onb-pane onb-welcome">
              <span className="onb-eyebrow"><span className="live-dot" style={{ background: '#0090FF' }}></span>Wallet connected</span>
              <h1>Welcome to the constellation.</h1>
              <p>You're in. Orbit is the wallet-gated forum where Filecoin ambassadors publish reports, propose projects, and meet live. Let's set up your identity — it takes about a minute.</p>
              <div className="onb-wallet"><AmbassadorAvatar user="you.fil" size={40} link={false} /><div><div className="ow-addr">{ME.fulladdr ? ME.fulladdr.slice(0, 6) + '…' + ME.fulladdr.slice(-4) : ME.addr}</div><div className="ow-net">Filecoin · verified on-chain</div></div><span className="ow-check">{I.check()}</span></div>
              <button className="pill pill-blue onb-cta" onClick={next}>Let's go {I.back({ style: { transform: 'rotate(180deg)' }, width: 15, height: 15 })}</button>
            </div>
          )}

          {step === 1 && (
            <div className="onb-pane onb-center">
              <div className={'verify-orb' + (verifyDone ? ' ok' : '')}>
                {verifyDone ? I.check({ width: 46, height: 46 }) : <span className="verify-spin"></span>}
              </div>
              <h1>{verifyDone ? 'Orbit Ambassador NFT found' : 'Checking your wallet…'}</h1>
              <p>{verifyDone ? 'You hold the Orbit Ambassador NFT, so you can post, comment, vote, and host meetings. Reading is open to everyone.' : 'Looking for the Orbit Ambassador NFT in your wallet. This proves your membership without any paperwork.'}</p>
              <button className="pill pill-blue onb-cta" onClick={next} disabled={!verifyDone} style={{ opacity: verifyDone ? 1 : .5 }}>Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="onb-pane">
              <h1>Pick your astronaut.</h1>
              <p>This avatar shows on every post, comment, vote, and in meeting rooms. You can change it later in settings.</p>
              <div className="onb-avatars">
                {AVATAR_OPTIONS.map(col => (
                  <button key={col} className={'ap-opt' + (avatar === col ? ' on' : '')} onClick={() => setAvatar(col)} aria-label={col}>
                    <img src={AV[col]} alt={col} />{avatar === col && <span className="ap-check">{I.check()}</span>}
                  </button>
                ))}
              </div>
              <div className="onb-nav"><button className="pill pill-ghost" onClick={back}>Back</button><button className="pill pill-blue" onClick={next}>Continue</button></div>
            </div>
          )}

          {step === 3 && (
            <div className="onb-pane">
              <h1>Choose a banner.</h1>
              <p>Set the backdrop for your profile. Six cosmic scenes to pick from.</p>
              <div className="onb-banners">
                {BANNERS.map(b => (
                  <button key={b.id} className={'bn-opt' + (banner === b.id ? ' on' : '')} onClick={() => setBanner(b.id)} style={{ backgroundImage: 'url(' + b.src + ')' }}>
                    <span className="bn-label">{b.label}</span>{banner === b.id && <span className="bn-check">{I.check()}</span>}
                  </button>
                ))}
              </div>
              <div className="onb-nav"><button className="pill pill-ghost" onClick={back}>Back</button><button className="pill pill-blue" onClick={next}>Continue</button></div>
            </div>
          )}

          {step === 4 && (
            <div className="onb-pane">
              <h1>Introduce yourself.</h1>
              <p>Optional, but it helps the constellation know who you are. You can edit all of this later.</p>
              <div className="onb-form">
                <div className="field"><label>Display handle</label><div className="locked-field">{ME.name} <span className="lock">{I.shield()} wallet-bound</span></div></div>
                <div className="field"><label>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City, Country" /></div>
                <div className="field"><label>Short bio</label><textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="What are you building or organizing?" style={{ minHeight: 84 }} /></div>
              </div>
              <div className="onb-nav"><button className="pill pill-ghost" onClick={back}>Back</button><button className="pill pill-blue" onClick={next}>Continue</button></div>
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
              <h1>You're all set.</h1>
              <p>Welcome aboard. Your profile is live, pinned to your wallet. Time to read, post, and join a meeting.</p>
              <button className="pill pill-blue onb-cta" onClick={finish}>{I.spark({ width: 16, height: 16 })} Enter Orbit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

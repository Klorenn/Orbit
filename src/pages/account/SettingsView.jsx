import { useState, useEffect } from 'react'
import { ME, BANNERS, AVATAR_OPTIONS, AV, SOCIALS } from '../../data/constants'
import { I } from '../../components/Icons'
import { socialIcon } from '../../components/SocialLinks'
import { ProfileTabs } from './MyPostsView'

export function SettingsView({ profile, myAvatar, setMyAvatar, onSave }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [bio, setBio] = useState(profile.bio || '')
  const [city, setCity] = useState(profile.city || '')
  const [socials, setSocials] = useState({ ...(profile.socials || {}) })
  const [banner, setBanner] = useState(profile.banner || 'green')
  const setS = (k, v) => setSocials(s => ({ ...s, [k]: v }))
  const save = () => onSave({ bio, city, socials, banner })
  const pickBanner = (id) => { setBanner(id); onSave({ banner: id }) }
  return (
    <div className="page-wrap">
      <a className="back-link" href="#/profile/me">{I.back()} My profile</a>
      <h1 className="page-title">Settings</h1>
      <ProfileTabs active="settings" />

      <section className="set-card" style={{ marginTop: 18 }}>
        <h3>Profile banner</h3>
        <p className="set-sub">Choose a cosmic backdrop for your profile. It shows behind your name and avatar.</p>
        <div className="banner-grid">
          {BANNERS.map(b => (
            <button key={b.id} className={'banner-opt' + (banner === b.id ? ' on' : '')} onClick={() => pickBanner(b.id)} aria-label={b.label}>
              <img src={b.src} alt={b.label} />
              <span className="bn-label">{b.label}</span>
              {banner === b.id && <span className="bn-check">{I.check()}</span>}
            </button>
          ))}
        </div>
      </section>

      <div className="settings-grid" style={{ marginTop: 16 }}>
        <section className="set-card">
          <h3>Avatar</h3>
          <p className="set-sub">Your astronaut shows on every post, comment, and vote.</p>
          <div className="ap-grid">
            {AVATAR_OPTIONS.map(col => (
              <button key={col} className={'ap-opt' + (myAvatar === col ? ' on' : '')} onClick={() => setMyAvatar(col)} aria-label={col}>
                <img src={AV[col]} alt={col} />{myAvatar === col && <span className="ap-check">{I.check()}</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="set-card">
          <h3>Identity</h3>
          <div className="field"><label>Wallet handle</label>
            <div className="locked-field">{ME.name} <span className="lock">{I.shield()} wallet-bound</span></div>
          </div>
          <div className="field"><label>City</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City, Country" />
          </div>
          <div className="field"><label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the constellation who you are." style={{ minHeight: 90 }} />
          </div>
        </section>

        <section className="set-card">
          <h3>Social links</h3>
          <p className="set-sub">Add your GitHub, X, Discord, Slack, Telegram and website — shown on your public profile.</p>
          <div className="social-fields">
            {SOCIALS.map(s => (
              <div className="social-field" key={s.key}>
                <span className="sf-ic">{socialIcon(s.key)}</span>
                <span className="sf-prefix">{s.prefix || s.label + ':'}</span>
                <input type="text" value={socials[s.key] || ''} placeholder={s.ph} onChange={e => setS(s.key, e.target.value)} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="settings-foot">
        <span className="note">{I.shield()} Changes are saved locally and signed by {ME.name}</span>
        <button className="pill pill-blue" onClick={save} style={{ padding: '11px 26px' }}>Save changes</button>
      </div>
    </div>
  )
}

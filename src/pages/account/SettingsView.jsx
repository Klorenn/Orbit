import { useState, useEffect } from 'react'
import { ME, BANNERS, AVATAR_OPTIONS, AV, SOCIALS, SKILLS, SPECIALTIES } from '../../data/constants'
import { I } from '../../components/Icons'
import { socialIcon } from '../../components/SocialLinks'
import { ProfileTabs } from './MyPostsView'
import { useT } from '../../hooks/useT'

function parseRepos(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}

export function SettingsView({ profile, myAvatar, setMyAvatar, onSave }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const [handle, setHandle] = useState(profile.handle || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [city, setCity] = useState(profile.city || '')
  const [socials, setSocials] = useState({ ...(profile.socials || {}) })
  const [banner, setBanner] = useState(profile.banner || 'green')
  const [skills, setSkills] = useState(() => profile.skills || [])
  const [repos, setRepos] = useState(() => parseRepos(profile.repos))
  const [repoName, setRepoName] = useState('')
  const [repoUrl, setRepoUrl] = useState('')

  useEffect(() => {
    setHandle(profile.handle || '')
    setBio(profile.bio || '')
    setCity(profile.city || '')
    setSocials({ ...(profile.socials || {}) })
    setBanner(profile.banner || 'green')
    setSkills(profile.skills || [])
    setRepos(parseRepos(profile.repos))
  }, [profile.handle, profile.bio, profile.city, profile.banner, profile.skills, profile.repos])

  const setS = (k, v) => setSocials(s => ({ ...s, [k]: v }))
  const toggleSkill = (id) => setSkills(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const addRepo = () => {
    const url = repoUrl.trim()
    if (!url) return
    const name = repoName.trim() || url.split('/').filter(Boolean).pop() || url
    setRepos(r => [...r, { name, url }])
    setRepoName('')
    setRepoUrl('')
  }
  const removeRepo = (idx) => setRepos(r => r.filter((_, i) => i !== idx))
  const save = () => onSave({ handle, bio, city, socials, banner, skills, repos })
  const pickBanner = (id) => { setBanner(id); onSave({ banner: id }) }
  return (
    <div className="page-wrap">
      <a className="back-link" href="/profile/me">{I.back()} {t('backToProfile')}</a>
      <h1 className="page-title">{t('settingsTitle')}</h1>
      <ProfileTabs active="settings" />

      <section className="set-card" style={{ marginTop: 18 }}>
        <h3>{t('settingsBannerTitle')}</h3>
        <p className="set-sub">{t('settingsBannerSub')}</p>
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
          <h3>{t('settingsAvatarTitle')}</h3>
          <p className="set-sub">{t('settingsAvatarSub')}</p>
          <div className="ap-grid">
            {AVATAR_OPTIONS.map(col => (
              <button key={col} className={'ap-opt' + (myAvatar === col ? ' on' : '')} onClick={() => setMyAvatar(col)} aria-label={col}>
                <img src={AV[col]} alt={col} />{myAvatar === col && <span className="ap-check">{I.check()}</span>}
              </button>
            ))}
            <label className={'ap-opt ap-custom' + (myAvatar?.startsWith('#') ? ' on' : '')} title="Custom color">
              <input
                type="color"
                value={myAvatar?.startsWith('#') ? myAvatar : '#0090ff'}
                onChange={e => setMyAvatar(e.target.value)}
                className="ap-color-input"
              />
              {myAvatar?.startsWith('#')
                ? <div className="ap-color-swatch" style={{ background: myAvatar }} />
                : <span className="ap-custom-plus">+</span>
              }
              {myAvatar?.startsWith('#') && <span className="ap-check">{I.check()}</span>}
            </label>
          </div>
        </section>

        <section className="set-card">
          <h3>{t('settingsIdentityTitle')}</h3>
          <div className="field"><label>{t('handleLabel')}</label>
            <input type="text" value={handle} onChange={e => setHandle(e.target.value)} placeholder={ME.addr} maxLength={32} />
            <p className="field-hint">{t('handleHintShort')}</p>
          </div>
          <div className="field"><label>{t('walletLabel')}</label>
            <div className="locked-field">{ME.addr} <span className="lock">{I.shield()} {t('walletBound')}</span></div>
          </div>
          <div className="field"><label>{t('cityLabel')}</label>
            <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder={t('cityPlaceholder')} />
          </div>
          <div className="field"><label>{t('bioLabel')}</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t('bioPlaceholderShort')} style={{ minHeight: 90 }} />
          </div>
        </section>

        <section className="set-card">
          <h3>{t('settingsSocialsTitle')}</h3>
          <p className="set-sub">{t('settingsSocialsSub')}</p>
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

      <section className="set-card" style={{ marginTop: 16 }}>
        <h3>{t('settingsSpecialtiesTitle')}</h3>
        <p className="set-sub">{t('settingsSpecialtiesSub')}</p>
        <div className="skill-picker">
          {SPECIALTIES.map(s => (
            <button
              key={s.id}
              className={'spec-toggle' + (skills.includes(s.id) ? ' on' : '')}
              style={skills.includes(s.id) ? { background: s.color + '18', borderColor: s.color, color: s.color } : {}}
              onClick={() => toggleSkill(s.id)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="set-card" style={{ marginTop: 16 }}>
        <h3>{t('settingsSkillsTitle')}</h3>
        <p className="set-sub">{t('settingsSkillsSub')}</p>
        <div className="skill-picker">
          {SKILLS.map(s => (
            <button
              key={s.id}
              className={'skill-toggle' + (skills.includes(s.id) ? ' on' : '')}
              onClick={() => toggleSkill(s.id)}
              type="button"
            >
              <i className={s.icon} />
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="set-card" style={{ marginTop: 16 }}>
        <h3>{t('settingsReposTitle')}</h3>
        <p className="set-sub">{t('settingsReposSub')}</p>
        <div className="repo-list">
          {repos.map((r, i) => (
            <div className="repo-row" key={i}>
              <a className="repo-link" href={r.url} target="_blank" rel="noopener noreferrer">
                <i className="devicon-github-plain" /> {r.name}
              </a>
              <button className="repo-remove" onClick={() => removeRepo(i)} title="Remove">×</button>
            </div>
          ))}
          {repos.length === 0 && <p className="set-sub" style={{ margin: 0 }}>{t('noReposYet')}</p>}
        </div>
        <div className="repo-inputs">
          <input
            type="text"
            value={repoName}
            onChange={e => setRepoName(e.target.value)}
            placeholder={t('repoNamePlaceholder')}
            style={{ flex: '1 1 120px' }}
          />
          <input
            type="url"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            placeholder={t('repoUrlPlaceholder')}
            style={{ flex: '2 1 200px' }}
            onKeyDown={e => e.key === 'Enter' && addRepo()}
          />
          <button className="pill pill-blue" onClick={addRepo} type="button" style={{ padding: '9px 16px', flexShrink: 0 }}>
            {t('addRepo')}
          </button>
        </div>
      </section>

      <div className="settings-foot">
        <span className="note">{I.shield()} {t('settingsSignedNote')} {ME.name}</span>
        <button className="pill pill-blue" onClick={save} style={{ padding: '11px 26px' }}>{t('saveChanges')}</button>
      </div>
    </div>
  )
}

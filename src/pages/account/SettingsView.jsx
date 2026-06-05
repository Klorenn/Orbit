import { useState, useEffect, Children, useRef } from 'react'
import { ME, BANNERS, AVATAR_OPTIONS, AV, SOCIALS, SKILLS, SPECIALTIES } from '../../data/constants'
import { supabase } from '../../lib/supabase'

function useProfileStats(identity) {
  const [stats, setStats] = useState({ karma: 0, posts: 0, followers: 0 })
  useEffect(() => {
    if (!identity) return
    Promise.all([
      supabase.from('public_profiles').select('karma').eq('identity', identity).maybeSingle(),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author', identity),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following', identity),
    ]).then(([profileRes, postsRes, followersRes]) => {
      setStats({
        karma: profileRes.data?.karma ?? 0,
        posts: postsRes.count ?? 0,
        followers: followersRes.count ?? 0,
      })
    })
  }, [identity])
  return stats
}
import { I } from '../../components/Icons'
import { socialIcon } from '../../components/SocialLinks'
import { ProfileTabs } from './MyPostsView'
import { useT } from '../../hooks/useT'

function PickerCarousel({ children, perPage = 5, selectedIndex = 0 }) {
  const items = Children.toArray(children)
  const pages = Math.ceil(items.length / perPage)
  const [page, setPage] = useState(() => Math.floor(Math.max(0, selectedIndex) / perPage))
  const slice = items.slice(page * perPage, (page + 1) * perPage)
  return (
    <div className="picker-carousel">
      <button className="pc-nav" disabled={page === 0} onClick={() => setPage(p => p - 1)} aria-label="Anterior">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div className="pc-items">{slice}</div>
      <button className="pc-nav" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} aria-label="Siguiente">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  )
}

function parseRepos(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try { return JSON.parse(raw) } catch { return [] }
}

export function SettingsView({ profile, myAvatar, setMyAvatar, onSave, identity }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t } = useT()
  const stats = useProfileStats(identity)
  const [fullName, setFullName] = useState(profile.fullName || '')
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
    setFullName(profile.fullName || '')
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

  // Handle availability check
  const [handleStatus, setHandleStatus] = useState('idle') // idle | checking | available | taken
  const debounceRef = useRef(null)
  useEffect(() => {
    const val = handle.trim()
    if (!val || val === (profile.handle || '').trim()) { setHandleStatus('idle'); return }
    setHandleStatus('checking')
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('identity')
        .ilike('handle', val)
        .neq('identity', identity || '')
        .limit(1)
      setHandleStatus(data?.length ? 'taken' : 'available')
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [handle])

  const save = () => {
    if (handleStatus === 'taken') return
    onSave({ fullName, handle, bio, city, socials, banner, skills, repos })
  }
  const pickBanner = (id) => { setBanner(id); onSave({ banner: id }) }
  return (
    <div className="page-wrap">
      <a className="back-link" href="/profile/me">{I.back()} {t('backToProfile')}</a>
      <h1 className="page-title">{t('settingsTitle')}</h1>
      <ProfileTabs active="settings" />

      {/* Preview */}
      {(() => {
        const pb = BANNERS.find(b => b.id === banner) || BANNERS[0]
        return (
          <section className={'set-preview-card' + (pb.light ? ' banner-light' : '')} style={{ marginTop: 18 }}>
            <div className="set-preview-hero" style={{ backgroundImage: `url(${pb.src})` }}>
              <div className="set-preview-scrim" />
              <div className="set-preview-row">
                <img className="set-preview-av" src={AV[myAvatar] || AV.blue} alt="" />
                <div className="set-preview-info">
                  <div className="set-preview-name">{profile.handle || ME.name || 'you.fil'}</div>
                  <div className="set-preview-meta">{profile.city || 'Filecoin Ambassador'}</div>
                  {profile.bio && <div className="set-preview-bio">{profile.bio.slice(0, 80)}{profile.bio.length > 80 ? '…' : ''}</div>}
                </div>
              </div>
              <div className="set-preview-stats">
                <div><span className="spv">{stats.karma}</span><span className="spl">{t('karma') || 'Karma'}</span></div>
                <div><span className="spv">{stats.posts}</span><span className="spl">{t('posts') || 'Entradas'}</span></div>
                <div><span className="spv">{stats.followers}</span><span className="spl">{t('followers') || 'Seguidores'}</span></div>
              </div>
            </div>
          </section>
        )
      })()}

      <section className="set-card" style={{ marginTop: 16 }}>
        <h3>{t('settingsBannerTitle')}</h3>
        <p className="set-sub">{t('settingsBannerSub')}</p>
        <PickerCarousel perPage={3} selectedIndex={BANNERS.findIndex(b => b.id === banner)}>
          {BANNERS.map(b => (
            <button key={b.id} className={'banner-opt' + (banner === b.id ? ' on' : '')} onClick={() => pickBanner(b.id)} aria-label={b.label}>
              <img src={b.src} alt={b.label} />
              <span className="bn-label">{b.label}</span>
              {banner === b.id && <span className="bn-check">{I.check()}</span>}
            </button>
          ))}
        </PickerCarousel>
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
          </div>
        </section>

        <section className="set-card">
          <h3>{t('settingsIdentityTitle')}</h3>
          <div className="field">
            <label>Nombre real</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ej: Olga Ramos" maxLength={64} />
            <p className="field-hint">Tu nombre completo. Aparece en el OG y en tu perfil público.</p>
          </div>
          <div className="field">
            <label>{t('handleLabel')}</label>
            <div className="handle-input-wrap">
              <input
                type="text" value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder={ME.addr} maxLength={32}
                className={handleStatus === 'taken' ? 'input-error' : handleStatus === 'available' ? 'input-ok' : ''}
              />
              {handleStatus === 'checking' && <span className="handle-status checking">…</span>}
              {handleStatus === 'available' && <span className="handle-status ok">✓ Disponible</span>}
              {handleStatus === 'taken' && <span className="handle-status taken">✗ Ya está en uso</span>}
            </div>
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
          {repos.map((r, i) => {
            const isGitLab = r.url?.includes('gitlab.com')
            return (
              <div className="repo-row" key={i}>
                <a className="repo-link" href={r.url} target="_blank" rel="noopener noreferrer">
                  <i className={isGitLab ? 'devicon-gitlab-plain' : 'devicon-github-plain'} /> {r.name}
                </a>
                <button className="repo-remove" onClick={() => removeRepo(i)} title="Remove">×</button>
              </div>
            )
          })}
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
        <button className="pill pill-blue" onClick={save} disabled={handleStatus === 'taken'} style={{ padding: '11px 26px', opacity: handleStatus === 'taken' ? .45 : 1, cursor: handleStatus === 'taken' ? 'not-allowed' : 'pointer' }}>{t('saveChanges')}</button>
      </div>
    </div>
  )
}

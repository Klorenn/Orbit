import { useState, useEffect } from 'react'
import { DOCS } from '../data/constants'
import { I } from '../components/Icons'
import { useT } from '../hooks/useT'

export function DocsView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const { t, lang } = useT()
  const [active, setActive] = useState(DOCS[0].id)
  const doc = DOCS.find(d => d.id === active)
  const docTitle = typeof doc.title === 'object' ? (doc.title[lang] || doc.title.en) : doc.title
  const docBody = typeof doc.body === 'object' && !Array.isArray(doc.body)
    ? (doc.body[lang] || doc.body.en)
    : doc.body
  return (
    <div className="page-wrap docs">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{t('docsTitle')}</h1>
      <p className="page-sub">{lang === 'es' ? 'Todo lo que necesitás para participar en Orbit.' : 'Everything you need to participate in Orbit.'}</p>
      <div className="docs-grid">
        <nav className="docs-nav">
          {DOCS.map(d => {
            const label = typeof d.title === 'object' ? (d.title[lang] || d.title.en) : d.title
            return <button key={d.id} className={active === d.id ? 'on' : ''} onClick={() => setActive(d.id)}>{label}</button>
          })}
          <a className="docs-cta" href="#/forum/new">{I.plus()} {t('newPost')}</a>
        </nav>
        <article className="docs-body prose">
          <h2>{docTitle}</h2>
          {docBody.map((p, i) => <p key={i}>{p}</p>)}
        </article>
      </div>
    </div>
  )
}

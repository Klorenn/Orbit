import { useState, useEffect } from 'react'
import { DOCS } from '../data/constants'
import { I } from '../components/Icons'

export function DocsView() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [active, setActive] = useState(DOCS[0].id)
  const doc = DOCS.find(d => d.id === active)
  return (
    <div className="page-wrap docs">
      <a className="back-link" href="#/forum">{I.back()} Back to forum</a>
      <h1 className="page-title">Documentation</h1>
      <p className="page-sub">Everything you need to participate in Orbit.</p>
      <div className="docs-grid">
        <nav className="docs-nav">
          {DOCS.map(d => <button key={d.id} className={active === d.id ? 'on' : ''} onClick={() => setActive(d.id)}>{d.title}</button>)}
          <a className="docs-cta" href="#/forum/new">{I.plus()} Write a post</a>
        </nav>
        <article className="docs-body prose">
          <h2>{doc.title}</h2>
          {doc.body.map((p, i) => <p key={i}>{p}</p>)}
        </article>
      </div>
    </div>
  )
}

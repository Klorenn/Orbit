import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const URL_RE = /https?:\/\/[^\s<>"')\]]+/g

function extractFirstUrl(text) {
  const m = text.match(URL_RE)
  return m ? m[0].replace(/[.,;!?]+$/, '') : null
}

export function LinkPreview({ body }) {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(null)
  const timerRef = useRef(null)
  const lastUrl = useRef(null)

  useEffect(() => {
    const url = extractFirstUrl(body || '')
    if (!url || url === dismissed) {
      if (!url) { setPreview(null); setLoading(false) }
      return
    }
    if (url === lastUrl.current) return

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      lastUrl.current = url
      setLoading(true)
      setPreview(null)
      try {
        const { data, error } = await supabase.functions.invoke('fetch-og', { body: { url } })
        if (!error && data && !data.error) setPreview(data)
      } catch {}
      setLoading(false)
    }, 700)

    return () => clearTimeout(timerRef.current)
  }, [body, dismissed])

  const handleDismiss = () => {
    setDismissed(extractFirstUrl(body || ''))
    setPreview(null)
  }

  if (!loading && !preview) return null

  return (
    <div className="og-preview-wrap">
      {loading && <div className="og-preview og-preview--loading"><span className="og-domain">Cargando vista previa…</span></div>}
      {preview && (
        <div className="og-preview">
          <div className="og-icon-wrap">
            {preview.image
              ? <img className="og-favicon" src={preview.image} alt="" />
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
            }
          </div>
          <div className="og-body">
            <span className="og-domain">{(preview.site_name || preview.domain || '').toUpperCase()}</span>
            {preview.title && <span className="og-title">{preview.title}</span>}
            <span className="og-url">{preview.url}</span>
          </div>
          <a className="og-ext" href={preview.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          </a>
          <button className="og-dismiss" onClick={handleDismiss}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { T } from '../i18n'

export function useT() {
  const [lang, setLang] = useState(() => localStorage.getItem('orbit-lang') || 'en')
  useEffect(() => {
    const h = (e) => setLang(e.detail)
    window.addEventListener('orbit-lang', h)
    return () => window.removeEventListener('orbit-lang', h)
  }, [])
  const dict = T[lang] || T.es
  return { t: (key) => dict[key] ?? T.en[key] ?? key, lang }
}

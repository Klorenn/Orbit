import { useEffect, useState, useMemo } from 'react'
import { useFilecoinBlog } from '../hooks/useFilecoinBlog'
import { useT } from '../hooks/useT'
import { I } from '../components/Icons'

const PER_PAGE = 6

function computeTags(articles) {
  const freq = {}
  articles.forEach(a => (a.categories || []).forEach(c => {
    const key = c.trim()
    if (key) freq[key] = (freq[key] || 0) + 1
  }))
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k]) => k)
  return ['All', ...top]
}

function paginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pool = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total))
  const sorted = [...pool].sort((a, b) => a - b)
  const result = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) result.push('...')
    result.push(p)
    prev = p
  }
  return result
}

function Pagination({ page, total, onChange }) {
  if (total <= 1) return null
  const pages = paginationRange(page, total)
  return (
    <div className="blog-pagination">
      <button className="blog-pg-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`el-${i}`} className="blog-pg-ellipsis">…</span>
          : <button key={p} className={'blog-pg-btn' + (p === page ? ' on' : '')} onClick={() => onChange(p)}>{p}</button>
      )}
      <button className="blog-pg-btn" disabled={page === total} onClick={() => onChange(page + 1)}>Next →</button>
    </div>
  )
}

function ArticleSkeleton() {
  return (
    <div className="blog-card blog-card--skeleton">
      <div className="blog-card-img skeleton-box" />
      <div className="blog-card-body">
        <div className="skeleton-line skeleton-line--date" />
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line--short" />
      </div>
    </div>
  )
}

function ArticleCard({ article, t }) {
  const desc = article.description?.length > 120
    ? article.description.slice(0, 120) + '…'
    : article.description

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : null

  return (
    <a
      className="blog-card"
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="blog-card-img">
        {article.image
          ? <img src={article.image} alt="" loading="lazy" />
          : <div className="blog-card-img-fallback" />
        }
      </div>
      <div className="blog-card-body">
        {date && <span className="blog-card-date">{date}</span>}
        <h3 className="blog-card-title">{article.title}</h3>
        {desc && <p className="blog-card-desc">{desc}</p>}
        {article.categories?.length > 0 && (
          <div className="blog-card-tags">
            {article.categories.slice(0, 3).map(c => (
              <span key={c} className="blog-card-tag">{c}</span>
            ))}
          </div>
        )}
        <span className="blog-card-cta">{t('blogReadMore')}</span>
      </div>
    </a>
  )
}

export function BlogView() {
  const { articles, loading, error } = useFilecoinBlog()
  const { t } = useT()
  const [activeTag, setActiveTag] = useState('All')
  const [page, setPage] = useState(1)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const tags = useMemo(() => computeTags(articles), [articles])

  const filtered = activeTag === 'All'
    ? articles
    : articles.filter(a => a.categories?.some(c => c.trim().toLowerCase() === activeTag.toLowerCase()))

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleTag = (tag) => { setActiveTag(tag); setPage(1) }
  const handlePage = (p) => { setPage(p); window.scrollTo(0, 0) }

  return (
    <div className="page-wrap blog">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{t('blogTitle')}</h1>
      <p className="page-sub">{t('blogSub')}</p>

      <div className="blog-tags">
        {tags.map(tag => (
          <button
            key={tag}
            className={'blog-tag' + (activeTag === tag ? ' on' : '')}
            onClick={() => handleTag(tag)}
          >{tag}</button>
        ))}
      </div>

      {error && (
        <div className="blog-error">
          <p>{t('blogCouldNotLoad')}</p>
          <a href="https://filecoin.io/blog" target="_blank" rel="noopener noreferrer">
            {t('blogReadOnFilecoin')}
          </a>
        </div>
      )}

      <div className="blog-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)
          : paginated.map((a, i) => <ArticleCard key={a.url || i} article={a} t={t} />)
        }
      </div>

      {!loading && filtered.length > 0 && (
        <Pagination page={page} total={totalPages} onChange={handlePage} />
      )}

      {!loading && articles.length === 0 && !error && (
        <div className="blog-empty">
          <p>{t('blogEmpty')}</p>
          <a href="https://filecoin.io/blog" target="_blank" rel="noopener noreferrer">
            {t('blogReadOnFilecoin')}
          </a>
        </div>
      )}
    </div>
  )
}

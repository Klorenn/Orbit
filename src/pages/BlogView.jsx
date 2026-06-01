import { useEffect } from 'react'
import { useFilecoinBlog } from '../hooks/useFilecoinBlog'
import { useT } from '../hooks/useT'
import { I } from '../components/Icons'

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
        <span className="blog-card-cta">{t('blogReadMore')}</span>
      </div>
    </a>
  )
}

export function BlogView() {
  const { articles, loading, error } = useFilecoinBlog()
  const { t } = useT()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="page-wrap blog">
      <a className="back-link" href="#/forum">{I.back()} {t('backToForum')}</a>
      <h1 className="page-title">{t('blogTitle')}</h1>
      <p className="page-sub">{t('blogSub')}</p>

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
          : articles.map((a, i) => <ArticleCard key={a.url || i} article={a} t={t} />)
        }
      </div>

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

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RSS_URLS = [
  'https://filecoin.io/blog/feed.xml',
  'https://filecoin.io/blog/rss.xml',
  'https://filecoin.io/rss.xml',
  'https://filecoin.io/feed.xml',
]

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>`, 'i'))
  if (cdataMatch) return cdataMatch[1].trim()
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'))
  return match ? match[1].trim() : ''
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>\\s]*(?:\\s[^>]*)?\\s${attr}="([^"]*)"`, 'i'))
  return match ? match[1] : ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim()
}

function parseCategories(item: string): string[] {
  const cats: string[] = []
  const re = /<category[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/gi
  let m
  while ((m = re.exec(item)) !== null) {
    const val = m[1].trim()
    if (val) cats.push(val)
  }
  return cats
}

function parseRSS(xml: string) {
  const items: string[] = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []
  return items.slice(0, 30).map(item => {
    const title = stripHtml(extractTag(item, 'title'))
    const url = stripHtml(extractTag(item, 'link')) || extractAttr(item, 'link', 'href')
    const description = stripHtml(extractTag(item, 'description')).slice(0, 200)
    const published_at = extractTag(item, 'pubDate') || extractTag(item, 'published') || null
    const image =
      extractAttr(item, 'media:content', 'url') ||
      extractAttr(item, 'enclosure', 'url') ||
      extractAttr(item, 'media:thumbnail', 'url') ||
      null
    const categories = parseCategories(item)
    return { title, description, image, url, published_at, categories }
  }).filter(a => a.title && a.url)
}

async function fetchRSS(): Promise<string | null> {
  for (const url of RSS_URLS) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Orbit-Forum/1.0 (filecoin governance forum)' },
      })
      if (res.ok) {
        const text = await res.text()
        if (text.includes('<item')) return text
      }
    } catch {
      // try next URL
    }
  }
  return null
}

async function fetchOGImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Orbit-Forum/1.0' },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
      || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    return ogMatch ? ogMatch[1] : null
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const xml = await fetchRSS()
  if (!xml) {
    return new Response(JSON.stringify({ error: 'RSS unavailable — all URLs failed' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const rawArticles = parseRSS(xml)

  // Fetch OG images in parallel for articles missing one
  const articles = await Promise.all(rawArticles.map(async (a) => {
    if (a.image) return a
    const image = await fetchOGImage(a.url)
    return { ...a, image }
  }))

  const { error } = await supabase
    .from('blog_cache')
    .upsert({ id: 1, articles, fetched_at: new Date().toISOString() })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ count: articles.length, fetched_at: new Date().toISOString() }),
    { headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
})

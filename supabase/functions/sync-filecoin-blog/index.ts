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

function parseRSS(xml: string) {
  const items: string[] = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []
  return items.slice(0, 20).map(item => {
    const title = stripHtml(extractTag(item, 'title'))
    const url = stripHtml(extractTag(item, 'link')) || extractAttr(item, 'link', 'href')
    const description = stripHtml(extractTag(item, 'description')).slice(0, 200)
    const published_at = extractTag(item, 'pubDate') || extractTag(item, 'published') || null
    const image =
      extractAttr(item, 'media:content', 'url') ||
      extractAttr(item, 'enclosure', 'url') ||
      extractAttr(item, 'media:thumbnail', 'url') ||
      null
    return { title, description, image, url, published_at }
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

  const articles = parseRSS(xml)

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

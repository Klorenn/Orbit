const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getMeta(html: string, prop: string): string | null {
  const byProp = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i'))
  if (byProp) return byProp[1]
  const byName = html.match(new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, 'i'))
  return byName ? byName[1] : null
}

function getTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m ? m[1].trim() : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  let url: string
  try {
    const body = await req.json()
    url = body.url
  } catch {
    return new Response(JSON.stringify({ error: 'invalid body' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } })
  }

  if (!url || !url.startsWith('http')) {
    return new Response(JSON.stringify({ error: 'invalid url' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } })
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Orbit-Forum/1.0 (link preview)' },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()

    const parsed = new URL(url)
    const data = {
      url,
      domain: parsed.hostname,
      title: getMeta(html, 'og:title') || getMeta(html, 'twitter:title') || getTitle(html),
      description: getMeta(html, 'og:description') || getMeta(html, 'description'),
      image: getMeta(html, 'og:image') || getMeta(html, 'twitter:image'),
      site_name: getMeta(html, 'og:site_name'),
    }

    return new Response(JSON.stringify(data), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})

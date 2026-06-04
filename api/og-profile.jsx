import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

// Maps banner id → asset path (must match constants.js)
const BANNER_PATHS = {
  green: 'bn-green.png', purple: 'bn-purple.png', magenta: 'bn-magenta.png',
  asteroid: 'bn-asteroid.png', moon: 'bn-moon.png', gold: 'bn-gold.png',
  neptune: 'bn-neptune.png', blackhole: 'bn-blackhole.png', sun: 'bn-sun.png',
  galaxy: 'bn-galaxy.jpg', nebula: 'bn-nebula.png', 'deep-space': 'bn-deep-space.png',
  solar: 'bn-solar.png', 'ice-planet': 'bn-ice-planet.png', supernova: 'bn-supernova.png',
  comet: 'bn-comet.png', aurora: 'bn-aurora.png', redplanet: 'bn-redplanet.png',
  stormplanet: 'bn-stormplanet.png', galaxy2: 'bn-galaxy.png', filecoin: 'bn-filecoin.png',
  wormhole: 'bn-wormhole.png', pulsar: 'bn-pulsar.png', ringworld: 'bn-ringworld.png',
  'twin-stars': 'bn-twin-stars.png', 'ocean-world': 'bn-ocean-world.png',
  'lava-world': 'bn-lava-world.png', eclipse: 'bn-eclipse.png',
}

export default async function handler(req) {
  const { searchParams, host } = new URL(req.url)
  const proto = req.headers.get('x-forwarded-proto') || 'https'
  const base = `${proto}://${host}`

  const name    = searchParams.get('name')   || 'Filecoin Ambassador'
  const handle  = searchParams.get('handle') || ''
  const role    = searchParams.get('role')   || 'Ambassador'
  const city    = searchParams.get('city')   || ''
  const banner  = searchParams.get('banner') || 'galaxy2'
  const avatarKey = searchParams.get('avatar') || 'blue'
  const skills  = (searchParams.get('skills') || '').split(',').filter(Boolean).slice(0, 4)

  const bannerFile = BANNER_PATHS[banner] || 'bn-galaxy.png'
  const bannerUrl  = `${base}/assets/${bannerFile}`
  const avatarUrl  = `${base}/assets/avatar-${avatarKey}.png`

  // Load Inter Bold from Google Fonts
  const fontRes = await fetch('https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2')
  const fontData = await fontRes.arrayBuffer()

  // Orbit logo SVG as data URI
  const orbitLogo = `data:image/svg+xml,${encodeURIComponent('<svg width="44" height="44" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="128" cy="128" rx="98" ry="52" transform="rotate(-20 128 128)" stroke="white" stroke-width="15"/><circle cx="128" cy="128" r="33" fill="white"/><circle cx="173" cy="69" r="17" fill="white"/></svg>')}`

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px',
        display: 'flex', position: 'relative', overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* Banner background */}
        <img src={bannerUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Dark gradient scrim */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          background: 'linear-gradient(105deg, rgba(8,11,30,.93) 0%, rgba(8,11,30,.78) 45%, rgba(8,11,30,.45) 100%)',
        }} />

        {/* Bottom-to-top fade */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          background: 'linear-gradient(to top, rgba(8,11,30,.75) 0%, transparent 55%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          padding: '56px 64px', height: '100%', width: '100%',
        }}>
          {/* Top: Orbit logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={orbitLogo} width={44} height={44} />
            <span style={{ color: 'white', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>Orbit</span>
            <span style={{ color: 'rgba(255,255,255,.35)', fontSize: '18px', marginLeft: '8px' }}>· Filecoin Ambassador Forum</span>
          </div>

          {/* Center: Avatar + Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '44px', marginTop: 'auto', marginBottom: '44px' }}>
            <img
              src={avatarUrl}
              style={{ width: '130px', height: '130px', borderRadius: '50%', border: '3px solid rgba(255,255,255,.4)', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ color: 'white', fontSize: '68px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {name}
              </div>
              <div style={{ color: 'rgba(255,255,255,.55)', fontSize: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                {handle
                  ? <><span>{handle}</span><span style={{ color: 'rgba(255,255,255,.25)' }}>·</span><span>{role}</span></>
                  : <><span>{role}</span>{city && <><span style={{ color: 'rgba(255,255,255,.25)' }}>·</span><span>{city}</span></>}</>
                }
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {skills.map(s => (
                    <span key={s} style={{
                      background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)',
                      borderRadius: '999px', color: 'rgba(255,255,255,.88)',
                      padding: '5px 18px', fontSize: '19px', fontWeight: 600,
                    }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, style: 'normal', weight: 700 }],
    }
  )
}

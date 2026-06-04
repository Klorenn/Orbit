import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

const env = readFileSync(resolve(root, '.env'), 'utf8')
const API_KEY = env.match(/^NANO_BANANA_API_KEY=(.+)$/m)?.[1]?.trim()
if (!API_KEY) { console.error('NANO_BANANA_API_KEY not found'); process.exit(1) }

const REFERENCE_URL = 'https://raw.githubusercontent.com/Klorenn/Orbit/main/public/assets/bn-green.png'

const BANNERS = {
  nebula:      { label: 'Nébula Crimson',  prompt: 'same flat vector illustration style, space scene, deep dark background, vibrant crimson red and orange nebula gas clouds filling the sky, bright scattered stars, a distant ringed planet in the bottom right corner, cool and dramatic atmosphere' },
  'deep-space':{ label: 'Deep Space',       prompt: 'same flat vector illustration style, extremely deep dark navy black space background, dense field of tiny bright white and blue stars of varying sizes, a faint distant galaxy spiral in the corner, minimal and mysterious, no planets, pure starfield' },
  solar:       { label: 'Solar Flare',      prompt: 'same flat vector illustration style, dramatic solar scene, large bright orange and yellow sun with a massive solar flare erupting, deep black space background, warm orange and gold color palette, high contrast and energetic' },
  'ice-planet':{ label: 'Ice Giant',        prompt: 'same flat vector illustration style, cold icy space scene, large light blue and white icy planet with frozen surface textures, deep dark blue space background, white and pale blue stars, soft cool atmosphere, serene and cold' },
  supernova:   { label: 'Supernova',        prompt: 'same flat vector illustration style, dramatic supernova explosion, bright white core with purple violet and blue expanding shock wave rings, deep black space background, small stars scattered around, powerful and vivid' },
  blackhole:   { label: 'Event Horizon',    prompt: 'same flat vector illustration style, black hole with glowing orange and yellow accretion disk, gravitational lensing effect bending stars around it, deep black background, few distant stars, dramatic and mysterious, physics-accurate stylized' },
  comet:       { label: 'Comet Trail',      prompt: 'same flat vector illustration style, bright comet with a glowing white blue core and a long trailing tail of light blue and white streaks across the dark space background, scattered stars, sense of motion and speed, cool blues and whites' },
  aurora:      { label: 'Aurora Orbit',     prompt: 'same flat vector illustration style, view from low orbit above a planet, brilliant aurora borealis in greens blues and purples dancing across the atmosphere, dark space above, curvature of the planet visible at the bottom, magical atmosphere' },
  redplanet:   { label: 'Red Desert',       prompt: 'same flat vector illustration style, arid red orange desert planet surface in the foreground with rocky terrain, large rust red planet filling much of the scene, dark space with stars above, warm terracotta and burnt orange tones, similar composition' },
  stormplanet: { label: 'Storm World',      prompt: 'same flat vector illustration style, massive gas giant planet with dramatic horizontal storm bands in teal aqua and blue tones, dark space background, bright stars, a small moon visible, swirling patterns on the planet surface, majestic scale' },
  galaxy:      { label: 'Spiral Galaxy',    prompt: 'same flat vector illustration style, beautiful spiral galaxy viewed from a distance, purple pink and blue glowing arms, bright galactic core, deep black space background, scattered stars in foreground, vast and awe-inspiring' },
  filecoin:    { label: 'Circuit Orbit',    prompt: 'same flat vector illustration style, abstract technological space scene, electric blue and cyan circuit-like orbital paths and nodes floating in deep dark space, glowing connections, data visualization aesthetic, Filecoin and blockchain inspired, cool tech atmosphere' },
  wormhole:    { label: 'Wormhole',         prompt: 'same flat vector illustration style, dramatic Einstein-Rosen bridge wormhole portal open in deep space, swirling circular tunnel of glowing blue purple and white light rings leading into another universe, dark space background with stars being pulled inward, breathtaking cosmic gateway' },
  pulsar:      { label: 'Pulsar',           prompt: 'same flat vector illustration style, spinning neutron star pulsar with two dramatic blue white energy beams shooting outward in opposite directions, dark space background, small scattered stars, the star has a faint glow, powerful and precise cosmic lighthouse' },
  ringworld:   { label: 'Ring World',       prompt: 'same flat vector illustration style, massive orbital ring megastructure surrounding a distant star, the ring is thin metallic and enormous, viewed from space at an angle, clouds and terrain visible on the inner surface, dark space background with stars' },
  'twin-stars':{ label: 'Binary Stars',     prompt: 'same flat vector illustration style, two stars orbiting each other, one bright blue-white and one warm yellow-orange, connected by glowing streams of plasma flowing between them, dark space background, distant smaller stars, dramatic orbital dance' },
  'ocean-world':{ label:'Ocean World',      prompt: 'same flat vector illustration style, gorgeous deep ocean planet entirely covered in deep blue swirling seas, no land, white cloud swirls in the atmosphere, a small moon reflected in the ocean below, deep dark blue and turquoise color palette, serene and vast' },
  'lava-world': { label:'Lava World',       prompt: 'same flat vector illustration style, violent volcanic planet with glowing orange red lava seas and dramatic erupting volcanoes, dark red brown rocky terrain, dark smoky sky above with a faint sun, warm fiery color palette of reds oranges and yellows, intense and dramatic' },
  eclipse:     { label: 'Eclipse',          prompt: 'same flat vector illustration style, dramatic total solar eclipse, a dark planet perfectly blocking a blazing star with a stunning corona of white gold light rays radiating outward in all directions, deep black space background, a few distant stars visible, deeply atmospheric' },
  void:        { label: 'Dark Void',        prompt: 'same flat vector illustration style, mysterious dark matter void in deep space, almost completely dark background with only a handful of isolated tiny white stars, a faint subtle dark blue gradient hinting at invisible structure, minimalist and deeply unsettling, elegant emptiness' },
  prismatic:   { label: 'Prismatic Drift',  prompt: 'same flat vector illustration style, abstract cosmic scene with light being refracted through a massive crystalline structure floating in space, rainbow spectrum of colors splitting outward from a central prism, dark space background, dreamlike and colorful, geometric beauty' },
}

async function generate(id, banner) {
  const prompt = `Space profile banner in the exact same artistic style as the reference image: flat vector illustration, limited color palette, clean shapes, no text, no logos. Scene: ${banner.prompt}. Horizontal landscape format 16:9.`

  const submitRes = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      prompt,
      type: 'IMAGETOIAMGE',
      numImages: 1,
      image_size: '16:9',
      imageUrls: [REFERENCE_URL],
      callBackUrl: 'https://example.com/callback',
    }),
  })

  if (!submitRes.ok) throw new Error(`Submit ${id}: ${await submitRes.text()}`)
  const { data } = await submitRes.json()
  if (!data?.taskId) throw new Error(`No taskId for ${id}`)
  return data.taskId
}

async function poll(taskId, id) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const res = await fetch(
      `https://api.nanobananaapi.ai/api/v1/nanobanana/record-info?taskId=${taskId}`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` } }
    )
    const { data } = await res.json()
    if (data?.successFlag === 1) {
      const url = data.response?.resultImageUrl || data.response?.originImageUrl
      if (!url) throw new Error(`No URL for ${id}`)
      return url
    }
    if (data?.successFlag === 2 || data?.successFlag === 3)
      throw new Error(`Failed ${id}: ${data.errorMessage}`)
  }
  throw new Error(`Timeout ${id}`)
}

const target = process.argv[2]
const toGenerate = target ? { [target]: BANNERS[target] } : BANNERS

for (const [id, banner] of Object.entries(toGenerate)) {
  if (!banner) { console.error(`Unknown: ${id}`); continue }
  try {
    await new Promise(r => setTimeout(r, 3000))
    process.stdout.write(`${id} (${banner.label})... `)
    const taskId = await generate(id, banner)
    const url = await poll(taskId, id)
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    writeFileSync(resolve(root, `public/assets/bn-${id}.png`), buf)
    console.log('✓')
  } catch (e) {
    console.error(`✗ ${e.message}`)
  }
}

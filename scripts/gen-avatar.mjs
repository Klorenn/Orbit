import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

const env = readFileSync(resolve(root, '.env'), 'utf8')
const API_KEY = env.match(/^NANO_BANANA_API_KEY=(.+)$/m)?.[1]?.trim()
if (!API_KEY) { console.error('NANO_BANANA_API_KEY not found'); process.exit(1) }

const COLORS = {
  teal:     { hex: '#00BCD4', name: 'teal cyan' },
  coral:    { hex: '#FF6B6B', name: 'coral salmon' },
  indigo:   { hex: '#5C6BC0', name: 'indigo blue' },
  navy:     { hex: '#1A237E', name: 'dark navy blue' },
  lime:     { hex: '#AEEA00', name: 'bright lime green' },
  mint:     { hex: '#A8E6CF', name: 'soft mint green' },
  magenta:  { hex: '#E91E8C', name: 'vivid magenta' },
  lavender: { hex: '#CE93D8', name: 'soft lavender purple' },
  rose:     { hex: '#EC407A', name: 'deep rose pink' },
  amber:    { hex: '#FFB300', name: 'warm amber gold' },
  olive:    { hex: '#9E9D24', name: 'olive green' },
  slate:    { hex: '#546E7A', name: 'slate blue-gray' },
  cream:    { hex: '#FFF9C4', name: 'warm cream yellow' },
  black:    { hex: '#37474F', name: 'dark charcoal black' },
}

const REFERENCE_URL = 'https://raw.githubusercontent.com/Klorenn/Orbit/main/public/assets/avatar-blue.png'

async function generate(color, c) {
  const prompt = `Change the visor color from blue to ${c.name} (${c.hex}). Keep everything identical: same helmet shape, same white helmet body, same cartoon eyes with white sclera and black pupils, same eyebrows, same thick black outlines, same gloss reflections on visor. Remove the white background completely, make it a PNG with fully transparent background. No background at all, only the helmet character.`

  const submitRes = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      prompt,
      type: 'IMAGETOIAMGE',
      numImages: 1,
      image_size: '1:1',
      imageUrls: [REFERENCE_URL],
      callBackUrl: 'https://example.com/callback',
    }),
  })

  if (!submitRes.ok) throw new Error(`Submit ${color}: ${await submitRes.text()}`)
  const { data } = await submitRes.json()
  if (!data?.taskId) throw new Error(`No taskId for ${color}`)
  return data.taskId
}

async function poll(taskId, color) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const res = await fetch(
      `https://api.nanobananaapi.ai/api/v1/nanobanana/record-info?taskId=${taskId}`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` } }
    )
    const { data } = await res.json()
    if (data?.successFlag === 1) {
      const url = data.response?.resultImageUrl || data.response?.originImageUrl
      if (!url) throw new Error(`No URL for ${color}`)
      return url
    }
    if (data?.successFlag === 2 || data?.successFlag === 3)
      throw new Error(`Generation failed for ${color}: ${data.errorMessage}`)
  }
  throw new Error(`Timeout for ${color}`)
}

const target = process.argv[2]
const toGenerate = target ? { [target]: COLORS[target] } : COLORS

for (const [color, c] of Object.entries(toGenerate)) {
  if (!c) { console.error(`Unknown: ${color}`); continue }
  try {
    await new Promise(r => setTimeout(r, 2000))
    process.stdout.write(`${color}... `)
    const taskId = await generate(color, c)
    const url = await poll(taskId, color)
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
    writeFileSync(resolve(root, `public/assets/avatar-${color}.png`), buf)
    console.log('✓')
  } catch (e) {
    console.error(`✗ ${e.message}`)
  }
}

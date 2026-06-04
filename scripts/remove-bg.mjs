import { removeBackground } from '@imgly/background-removal-node'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = resolve(root, 'public/assets')

const target = process.argv[2] // optional: specific file like "avatar-blue.png"

const files = target
  ? [target]
  : readdirSync(assetsDir).filter(f => f.startsWith('avatar-') && f.endsWith('.png'))

console.log(`Processing ${files.length} avatar(s)...\n`)

for (const file of files) {
  const path = resolve(assetsDir, file)
  try {
    process.stdout.write(`${file}... `)
    const blob = await removeBackground(path, {
      model: 'small',
      output: { format: 'image/png', quality: 1 },
    })
    const buffer = Buffer.from(await blob.arrayBuffer())
    writeFileSync(path, buffer)
    console.log('✓')
  } catch (e) {
    console.error(`✗ ${e.message}`)
  }
}

console.log('\nDone.')

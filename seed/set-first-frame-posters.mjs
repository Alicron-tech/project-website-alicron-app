// Sets every generated film's poster to the film's own first frame, so nothing jumps when playback starts (2026-10-13).
// Backs up the current poster references first. Usage: source ~/.config/sanity/alicron.env && node set-first-frame-posters.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
import {execFileSync} from 'node:child_process'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const tmp = '/tmp/alicron-posters'; fs.mkdirSync(tmp, {recursive: true})
const home = await client.getDocument('page-home')
const fc = home.sections.find((s) => s.ctaHref === '/applications/pipeline-inspection')
const targets = [   // [doc id, path to media object, name]
  ['page-training', 'heroMedia', 'training'],
  ['application-pipeline-inspection', 'media', 'pipeline'],
  ['application-agriculture', 'media', 'agriculture'],
  ['application-power-lines', 'media', 'power-lines'],
  ['application-emergency', 'media', 'emergency'],
  ['application-mapping', 'media', 'mapping'],
  ['page-home', `sections[_key=="${fc._key}"].media`, 'field-case'],
]
const backup = {}
for (const [id, path, name] of targets) {
  const doc = await client.getDocument(id)
  const media = path.startsWith('sections') ? doc.sections.find((s) => s._key === fc._key).media : doc[path]
  backup[`${id} ${path}`] = media.image
  const jpg = `${tmp}/${name}-first-frame.jpg`
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', media.videoUrl, '-frames:v', '1', '-q:v', '2', jpg])   // frame 0 of the published file
  const a = await client.assets.upload('image', fs.createReadStream(jpg), {filename: `${name}-first-frame.jpg`})
  await client.patch(id).set({[`${path}.image`]: {_type: 'image', asset: {_type: 'reference', _ref: a._id}}}).commit()
  console.log(name, a.url)
}
fs.writeFileSync(new URL('./backups/2026-10-13-posters.json', import.meta.url), JSON.stringify(backup, null, 1))

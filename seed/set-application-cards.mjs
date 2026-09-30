// Card images on /applications taken from the generated films (2026-09-30):
// pipeline = frame 78 of the Veo chase clip B2-chase-take2; crop monitoring = frame 197 of the crop-monitoring film.
// Backs up the previous image references first. Usage: source ~/.config/sanity/alicron.env && node set-application-cards.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const IMG = new URL('../generated/img/', import.meta.url)
const cards = {'application-pipeline-inspection': 'card-pipeline-film.jpg', 'application-agriculture': 'card-agriculture-film.jpg'}
const backup = {}
for (const id of Object.keys(cards)) backup[id] = (await client.getDocument(id)).image
fs.writeFileSync(new URL('./backups/2026-09-30-application-cards.json', import.meta.url), JSON.stringify(backup, null, 1))
for (const [id, file] of Object.entries(cards)) {
  const a = await client.assets.upload('image', fs.createReadStream(new URL(file, IMG)), {filename: file})
  await client.patch(id).set({image: {_type: 'image', asset: {_type: 'reference', _ref: a._id}}}).commit()
  console.log(id, a.url)
}

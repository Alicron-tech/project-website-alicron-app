// Undoes the shared-asset overreach of publish-2026-10-13b: platform galleries get their previous images back,
// offering-centre and offering-ground-robotics get the offering images meant for them.
// Usage: source ~/.config/sanity/alicron.env && node fix-2026-10-13b-shared.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const before = JSON.parse(fs.readFileSync(new URL('./backups/2026-10-13b-before-publish.json', import.meta.url)))
const keys = {'platform-multirotor-10': 'kiqq8', 'platform-multirotor-13': 'kwqq8', 'platform-multirotor-15-satellite': 'k1cqq8', 'platform-multirotor-17': 'k20qq8'}
for (const [id, k] of Object.entries(keys)) {
  const item = before[id].gallery.find((g) => g._key === k)
  await client.patch(id).set({[`gallery[_key=="${k}"].asset`]: item.asset}).commit(); console.log(id, 'restored', item.asset._ref)
}
const PUB = new URL('../web/public/', import.meta.url)
for (const [id, p] of Object.entries({'offering-centre': 'cards/offering-centre.jpg', 'offering-ground-robotics': 'cards/offering-ground-robotics.jpg'})) {
  const a = await client.assets.upload('image', fs.createReadStream(new URL(p, PUB)), {filename: p.split('/').pop()})
  await client.patch(id).set({'image.asset': {_type: 'reference', _ref: a._id}}).commit(); console.log(id, a.url)
}

// Publishes the page-image round prepared locally on 2026-10-13: offering images on software and engineering,
// the software, company and home dark bands, and the company map. Backs up every document it changes first.
// Training offerings show line drawings from the code (OFFER_SKETCH), so their Sanity images stay as they are.
// Usage: source ~/.config/sanity/alicron.env && node publish-2026-10-13b.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const PUB = new URL('../web/public/', import.meta.url)
const up = (p) => client.assets.upload('image', fs.createReadStream(new URL(p, PUB)), {filename: p.split('/').pop()})
const ref = (a) => ({_type: 'reference', _ref: a._id})

const offerings = {
  'offering-mission-software': 'cards/offering-mission-software.jpg',
  'offering-ground-robotics': 'cards/offering-ground-robotics.jpg',
  'offering-onboard-vision': 'cards/offering-onboard-vision.jpg',
  'offering-design': 'cards/offering-design.jpg',
  'offering-testing': 'cards/offering-testing-v3.jpg',
  'offering-integration': 'cards/offering-integration-v3.jpg',
  'offering-centre': 'cards/offering-centre.jpg',
}
// section media, found by the asset they show today
const media = {
  'image-933d20fd4abcb32dc3666ded33b868712011b683-1536x864-jpg': {file: 'cards/media-image-933d20fd4abcb32dc3666ded33b868712011b683-1536x86.jpg',
    alt: {en: 'A white hill town on a cliff turning into its 3D model', es: 'Un pueblo blanco sobre un acantilado convirtiéndose en su modelo 3D'}},
  'image-43d416415ee54efed930e5b85694f7d436aedf0f-1536x864-jpg': {file: 'cards/company-map-dark-v2.jpg',
    alt: {en: 'Relief map of the coast around Alicante with the base marked', es: 'Mapa en relieve de la costa de Alicante con la base marcada'}},
  'image-2d800a777e487a4fd12409d69fb43c2e0bab15a5-1536x864-jpg': {file: 'cards/company-exploded-black.jpg',
    alt: {en: 'Exploded view of a satellite-linked quadcopter', es: 'Vista explosionada de un cuadricóptero con enlace satelital'}},
  'image-5fc1017520555d8eb090a5ad8c426c71b3572bb0-1536x864-jpg': {file: 'cards/home-links-black.jpg',
    alt: {en: 'A quadcopter above its three link modules: satellite terminal, optical fibre spool, radio', es: 'Un cuadricóptero sobre sus tres módulos de enlace: terminal satelital, bobina de fibra óptica y radio'}},
}

const users = await client.fetch('*[references($refs)]._id', {refs: Object.keys(media)})
const ids = [...new Set([...Object.keys(offerings), ...users])]
const before = Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await client.getDocument(id)])))
fs.writeFileSync(new URL('./backups/2026-10-13b-before-publish.json', import.meta.url), JSON.stringify(before, null, 1))

for (const [id, p] of Object.entries(offerings)) {
  const a = await up(p); await client.patch(id).set({'image.asset': ref(a)}).commit(); console.log(id, a.url)
}
const uploaded = {}
for (const [old, m] of Object.entries(media)) uploaded[old] = await up(m.file)
// walk each document, build Sanity paths (arrays by _key) to every image that shows an old asset
const walk = (v, path, out) => {
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${x && x._key ? `_key=="${x._key}"` : i}]`, out))
  else if (v && typeof v === 'object') {
    if (v.asset?._ref && media[v.asset._ref]) out.push({path, old: v.asset._ref})
    for (const [k, x] of Object.entries(v)) if (!k.startsWith('_')) walk(x, path ? `${path}.${k}` : k, out)
  }
}
for (const id of users) {
  const hits = []; walk(before[id], '', hits)
  const set = {}
  for (const h of hits) {
    set[`${h.path}.asset`] = ref(uploaded[h.old])
    if (h.path.endsWith('.image')) set[`${h.path.slice(0, -'.image'.length)}.alt`] = media[h.old].alt
  }
  await client.patch(id).set(set).commit(); console.log(id, Object.keys(set))
}

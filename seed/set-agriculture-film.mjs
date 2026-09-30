// Puts the generated crop-monitoring film on the agriculture application (2026-09-30).
// Backs up the current media to backups/ first. Usage: source ~/.config/sanity/alicron.env && node set-agriculture-film.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const PUB = new URL('../web/public/agriculture/', import.meta.url)
const app = await client.getDocument('application-agriculture')
fs.writeFileSync(new URL('./backups/2026-09-30-agriculture-media.json', import.meta.url), JSON.stringify({_id: app._id, media: app.media}, null, 1))
const vid = await client.assets.upload('file', fs.createReadStream(new URL('alicron-crop-monitoring.mp4', PUB)), {filename: 'alicron-crop-monitoring.mp4', contentType: 'video/mp4'})
const poster = await client.assets.upload('image', fs.createReadStream(new URL('alicron-crop-monitoring-poster.jpg', PUB)), {filename: 'alicron-crop-monitoring-poster.jpg'})
await client.patch('application-agriculture').set({
  'media.videoUrl': vid.url,
  'media.image': {_type: 'image', asset: {_type: 'reference', _ref: poster._id}},
  'media.alt': {en: 'A drone flies an apple orchard showing canopy vigour, counts the apples on one tree by ripeness, and a coaxial multirotor flies over vineyards', es: 'Un dron recorre un huerto de manzanos mostrando el vigor de la copa, cuenta las manzanas de un árbol por madurez, y un multirrotor coaxial sobrevuela viñedos'},
  'media.caption': {en: 'An orchard pass: canopy vigour, then every apple in view counted and sorted by ripeness.', es: 'Un pase por el huerto: vigor de la copa y, después, cada manzana a la vista contada y clasificada por madurez.'},
}).commit()
fs.writeFileSync(new URL('./.agriculture-video.json', import.meta.url), JSON.stringify({url: vid.url}, null, 1) + '\n')
console.log('agriculture film', vid.url)

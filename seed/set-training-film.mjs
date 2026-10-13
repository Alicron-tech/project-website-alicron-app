// Puts the generated training film on the training page hero (2026-10-13). Backs up the current hero media first.
// Usage: source ~/.config/sanity/alicron.env && node set-training-film.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const PUB = new URL('../web/public/training/', import.meta.url)
const page = await client.getDocument('page-training')
fs.writeFileSync(new URL('./backups/2026-10-13-training-hero.json', import.meta.url), JSON.stringify({_id: page._id, heroMedia: page.heroMedia}, null, 1))
const vid = await client.assets.upload('file', fs.createReadStream(new URL('alicron-training.mp4', PUB)), {filename: 'alicron-training.mp4', contentType: 'video/mp4'})
const poster = await client.assets.upload('image', fs.createReadStream(new URL('alicron-training-poster.jpg', PUB)), {filename: 'alicron-training-poster.jpg'})
await client.patch('page-training').set({
  'heroMedia.videoUrl': vid.url,
  'heroMedia.image': {_type: 'image', asset: {_type: 'reference', _ref: poster._id}},
  'heroMedia.alt': {en: 'A training day at the airfield: a drone takes off, flies through arch gates, captures flags, plays streamer tag and lands on a mat', es: 'Un día de formación en el campo de vuelo: un dron despega, pasa por arcos, captura banderas, juega a la cinta y aterriza sobre una esterilla'},
  'heroMedia.caption': {en: 'A training day at the airfield: the airframe in parts, the arch gates, flag captures, streamer tag and a precision landing.', es: 'Un día de formación en el campo de vuelo: la aeronave por piezas, los arcos, la captura de banderas, el juego de la cinta y un aterrizaje de precisión.'},
}).commit()
fs.writeFileSync(new URL('./.training-video.json', import.meta.url), JSON.stringify({url: vid.url}, null, 1) + '\n')
console.log('training film', vid.url)

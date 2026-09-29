// Uploads a film and its poster to Sanity and sets them as the home page hero media.
// Usage: source ~/.config/sanity/alicron.env && node set-hero.mjs <video.mp4> <poster.jpg>
// Back up the current value first (see backups/); restore-hero.mjs puts a backup back.
import {createClient} from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'

const [video, poster] = process.argv.slice(2)
if (!video || !poster) throw new Error('Pass the video and the poster')
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const file = await client.assets.upload('file', fs.createReadStream(video), {filename: path.basename(video), contentType: 'video/mp4'})
const image = await client.assets.upload('image', fs.createReadStream(poster), {filename: path.basename(poster)})
await client.patch('page-home').set({
  'heroMedia.videoUrl': file.url,
  'heroMedia.image': {_type: 'image', asset: {_type: 'reference', _ref: image._id}},
  'heroMedia.alt': {
    en: 'A test day on the Costa Blanca: a quadcopter lifts off, first-person flights over a ridge and along a power line, a gate run, a flight-test crew on a clifftop and a white fixed-wing along the cliffs',
    es: 'Un día de pruebas en la Costa Blanca: un cuadricóptero despega, vuelos en primera persona sobre una cresta y a lo largo de una línea eléctrica, un circuito de puertas, un equipo de ensayos en un acantilado y un ala fija blanca junto a los acantilados',
  },
}).commit()
fs.writeFileSync(path.join(import.meta.dirname, '.hero-video.json'), JSON.stringify({url: file.url, poster: image.url}) + '\n')
console.log('hero video', file.url, '\nposter', image.url)

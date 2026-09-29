// Puts the generated pipeline films on the site (2026-09-30): the home "Field case" section and the
// pipeline-inspection application. Backs up the current media to backups/ first.
// Usage: source ~/.config/sanity/alicron.env && node set-pipeline-films.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const PUB = new URL('../web/public/pipeline/', import.meta.url)
const up = async (kind, name, type) => client.assets.upload(kind, fs.createReadStream(new URL(name, PUB)), {filename: name, contentType: type})

const home = await client.getDocument('page-home')
const fc = home.sections.find((s) => s.kind === 'split' && s.ctaHref === '/applications/pipeline-inspection')
const app = await client.getDocument('application-pipeline-inspection')
fs.writeFileSync(new URL('./backups/2026-09-30-pipeline-media.json', import.meta.url), JSON.stringify({homeFieldCase: {_key: fc._key, media: fc.media}, pipelineApplication: {_id: app._id, media: app.media}}, null, 1))

const [fcVid, fcPoster, apVid, apPoster] = await Promise.all([
  up('file', 'alicron-field-case.mp4', 'video/mp4'), up('image', 'alicron-field-case-poster.jpg'),
  up('file', 'alicron-pipeline-inspection.mp4', 'video/mp4'), up('image', 'alicron-pipeline-inspection-poster.jpg'),
])
const img = (a) => ({_type: 'image', asset: {_type: 'reference', _ref: a._id}})
await client.patch('page-home').set({
  [`sections[_key=="${fc._key}"].media.videoUrl`]: fcVid.url,
  [`sections[_key=="${fc._key}"].media.image`]: img(fcPoster),
  [`sections[_key=="${fc._key}"].media.alt`]: {en: 'A pickup on a pipeline track, a drone lifted from its case and flying the line, and the live feed on an office screen', es: 'Una camioneta en la pista de una tubería, un dron que sale de su maleta y vuela la línea, y la señal en directo en una pantalla de oficina'},
}).commit()
await client.patch('application-pipeline-inspection').set({
  'media.videoUrl': apVid.url, 'media.image': img(apPoster),
  'media.alt': {en: 'A pipeline corridor from the air in northern Spain, a valve station, a river crossing and a gas leak seen by the gas camera', es: 'Un corredor de tubería desde el aire en el norte de España, una estación de válvulas, un cruce de río y una fuga vista con la cámara de gas'},
  'media.caption': {en: 'The corridor from the air: valve station, river crossing, and a leak seen by the gas camera.', es: 'El corredor desde el aire: estación de válvulas, cruce de río y una fuga vista con la cámara de gas.'},
}).commit()
fs.writeFileSync(new URL('./.pipeline-videos.json', import.meta.url), JSON.stringify({fieldCase: fcVid.url, pipelineInspection: apVid.url}, null, 1) + '\n')
console.log('field case', fcVid.url, '\npipeline  ', apVid.url)

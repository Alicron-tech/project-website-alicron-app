// Publishes the batch prepared locally between 2026-09-30 and 2026-10-01: three application films, three application
// cards, the fixed-wing gallery photo, the engineering drawing. Backs up every value it replaces first.
// Usage: source ~/.config/sanity/alicron.env && node publish-2026-10-13.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const PUB = new URL('../web/public/', import.meta.url)
const up = (kind, p, type) => client.assets.upload(kind, fs.createReadStream(new URL(p, PUB)), {filename: p.split('/').pop(), ...(type ? {contentType: type} : {})})
const img = (a) => ({_type: 'image', asset: {_type: 'reference', _ref: a._id}})
const ids = ['application-power-lines', 'application-emergency', 'application-mapping', 'platform-fixed-wing-endurance', 'page-home']
const before = Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await client.getDocument(id)])))
fs.writeFileSync(new URL('./backups/2026-10-13-before-publish.json', import.meta.url), JSON.stringify(before, null, 1))
const films = {
  'application-power-lines': {dir: 'power-lines/alicron-power-lines', card: 'power-lines/card-power-lines-vulture.jpg',
    alt: {en: 'A drone inspects a high-voltage line in the Pyrenees: insulators, a hot clamp on thermal, bird diverters, the corridor in LiDAR', es: 'Un dron inspecciona una línea de alta tensión en el Pirineo: aisladores, una grapa caliente en térmico, salvapájaros y el corredor en LiDAR'},
    caption: {en: 'A line through the Pyrenees: insulators from three metres, a hot clamp on thermal, bird diverters fitted by drone, the corridor in LiDAR.', es: 'Una línea en el Pirineo: aisladores a tres metros, una grapa caliente en térmico, salvapájaros instalados con dron y el corredor en LiDAR.'}},
  'application-emergency': {dir: 'emergency/alicron-emergency', card: 'cards/card-emergency-film.jpg',
    alt: {en: 'Four drones launched beside a fire engine at dusk, a forest fire seen from above, and the command post around the map', es: 'Cuatro drones lanzados junto a una autobomba al anochecer, un incendio forestal visto desde arriba y el puesto de mando alrededor del mapa'},
    caption: {en: 'The first twenty minutes: drones launched from the fire engine, the fire front seen from above, the picture on the command post\'s table.', es: 'Los primeros veinte minutos: drones lanzados desde la autobomba, el frente visto desde arriba y la imagen sobre la mesa del puesto de mando.'}},
  'application-mapping': {dir: 'mapping/alicron-mapping', card: 'cards/card-mapping-film.jpg',
    alt: {en: 'A fixed-wing surveys a quarry; the photos tile into a map, the map becomes an elevation model and a stockpile is measured', es: 'Un ala fija levanta una cantera; las fotos forman un mapa, el mapa se convierte en modelo de elevación y se mide un acopio'},
    caption: {en: 'A quarry flown on a survey pattern: photos stitched into a map, the map turned into heights, the stockpile measured against last month.', es: 'Una cantera volada en pasadas: fotos unidas en un mapa, el mapa convertido en alturas y el acopio medido frente al mes anterior.'}},
}
const record = {}
for (const [id, f] of Object.entries(films)) {
  const [vid, poster, card] = await Promise.all([up('file', `${f.dir}.mp4`, 'video/mp4'), up('image', `${f.dir}-poster.jpg`), up('image', f.card)])
  await client.patch(id).set({image: img(card), media: {_type: 'media', isVideoPlaceholder: false, videoUrl: vid.url, image: img(poster), alt: f.alt, caption: f.caption}}).commit()
  record[id] = {video: vid.url, card: card.url}; console.log(id, vid.url)
}
// fixed-wing endurance: replace gallery image 02 (AI photo) with the studio render of the real airframe
const fw = before['platform-fixed-wing-endurance']; const g2 = fw.gallery[1]
const fwImg = await up('image', 'cards/fixedwing-long-studio-grey.jpg')
await client.patch(fw._id).set({[`gallery[_key=="${g2._key}"].asset`]: {_type: 'reference', _ref: fwImg._id}}).commit()
record['platform-fixed-wing-endurance gallery 02'] = fwImg.url
// home engineering section: the technical drawing
const eng = before['page-home'].sections.find((s) => s.ctaHref === '/company')
const draw = await up('image', 'cards/engineering-drawing.jpg')
await client.patch('page-home').set({[`sections[_key=="${eng._key}"].media.image`]: img(draw),
  [`sections[_key=="${eng._key}"].media.alt`]: {en: 'Technical drawing of the fixed-wing survey aircraft, top and side views', es: 'Plano técnico del avión de levantamiento de ala fija, vistas en planta y lateral'}}).commit()
record['page-home engineering'] = draw.url
fs.writeFileSync(new URL('./.published-2026-10-13.json', import.meta.url), JSON.stringify(record, null, 1) + '\n')
console.log('done')

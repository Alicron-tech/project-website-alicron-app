// Shortens the home "Field case" section so the copy is no taller than its film (2026-09-29).
// Backs up the previous section to backups/ first. Usage: source ~/.config/sanity/alicron.env && node set-field-case.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const page = await client.getDocument('page-home')
const s = page.sections.find((x) => x.kind === 'split' && x.ctaHref === '/applications/pipeline-inspection')
fs.writeFileSync(new URL('./backups/2026-09-29-home-field-case.json', import.meta.url), JSON.stringify(s, null, 1))
await client.patch('page-home')
  .set({[`sections[_key=="${s._key}"].title`]: {en: 'The pipeline, flown from the office.', es: 'La tubería, volada desde la oficina.'}})
  .set({[`sections[_key=="${s._key}"].body`]: {
    en: "A technician opens a case on the tailgate. A 15-inch multirotor with a satellite terminal lifts off and follows the line at a set height, pausing at valve stations and river crossings. Two provinces away, an engineer watches the thermal feed and the map. By evening the flight log, the video and the flagged frames are in the customer's system.",
    es: 'Un técnico abre una maleta en el portón. Un multirrotor de 15 pulgadas con terminal satelital despega y sigue la conducción a una altura fija, con paradas en las estaciones de válvulas y los cruces de ríos. A dos provincias, un ingeniero sigue la señal térmica y el mapa. Al anochecer, el registro de vuelo, el vídeo y los fotogramas marcados están en el sistema del cliente.',
  }}).commit()
console.log('field case shortened; backup in backups/2026-09-29-home-field-case.json')

// Shortens the "How the job runs" text on the mapping application by about 30 % (2026-10-01). Backs up the old text first.
// Usage: source ~/.config/sanity/alicron.env && node set-mapping-body.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const doc = await client.getDocument('application-mapping')
if (!fs.existsSync(new URL('./backups/2026-10-01-mapping-body.json', import.meta.url))) fs.writeFileSync(new URL('./backups/2026-10-01-mapping-body.json', import.meta.url), JSON.stringify(doc.body, null, 1))   // keep the original
export const body = {
  en: `Photogrammetry is mostly discipline: the right overlap, the right height, control points measured on the ground. Then the orthophoto lands within centimetres.

Small sites fly with a multirotor, large ones with the fixed-wing, with lidar where vegetation hides the ground. Processing runs the same night: orthomosaic, surface and terrain models, contours and stockpile volumes against the last flight.

For a site that changes every month, we fly the same plan again. The comparison is the value: what moved, what grew, what was removed.`,
  es: `La fotogrametría es sobre todo disciplina: el solape correcto, la altura correcta y puntos de control medidos en tierra. Así, la ortofoto cae en pocos centímetros.

Los sitios pequeños se vuelan con multirrotor y los grandes con el ala fija, con lidar donde la vegetación oculta el suelo. El procesado se hace esa noche: ortomosaico, modelos de superficie y terreno, curvas de nivel y volúmenes de acopio frente al vuelo anterior.

Si el sitio cambia cada mes, volamos el mismo plan otra vez. El valor está en la comparación: qué se movió, qué creció, qué se retiró.`,
}
await client.patch('application-mapping').set({body}).commit()
const w = (s) => s.split(/\s+/).length
console.log('EN', w(doc.body.en), '->', w(body.en), ' ES', w(doc.body.es), '->', w(body.es))

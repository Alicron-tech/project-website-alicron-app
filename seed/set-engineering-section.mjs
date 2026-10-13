// Home "Engineering" section (2026-10-01): text on the left with larger type, new title; backs up the section first.
// Usage: source ~/.config/sanity/alicron.env && node set-engineering-section.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const home = await client.getDocument('page-home')
const s = home.sections.find((x) => x.kind === 'split' && x.ctaHref === '/company')
fs.writeFileSync(new URL('./backups/2026-10-01-home-engineering.json', import.meta.url), JSON.stringify(s, null, 1))
const at = (f) => `sections[_key=="${s._key}"].${f}`
await client.patch('page-home').set({[at('reverse')]: false, [at('large')]: true,
  [at('title')]: {en: 'From the drawing to the flight test', es: 'Del plano a la prueba de vuelo'}}).commit()
console.log('engineering section updated', s._key)

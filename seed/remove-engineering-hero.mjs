// Removes the hero image from the Engineering page so it opens with text only, like Software (2026-10-13). Backs up first.
// Usage: source ~/.config/sanity/alicron.env && node remove-engineering-hero.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const d = await client.getDocument('page-engineering')
fs.writeFileSync(new URL('./backups/2026-10-13-engineering-hero.json', import.meta.url), JSON.stringify({_id: d._id, heroMedia: d.heroMedia}, null, 1))
await client.patch('page-engineering').unset(['heroMedia']).commit()
console.log('engineering hero removed')

// Restores the home page hero media from a backup file in seed/backups/.
// Usage: source ~/.config/sanity/alicron.env && node restore-hero.mjs backups/2026-09-29-home-hero-mallorca.json
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'

const file = process.argv[2]
if (!file) throw new Error('Pass the backup file, e.g. backups/2026-09-29-home-hero-mallorca.json')
const backup = JSON.parse(readFileSync(file, 'utf8'))
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_TOKEN, useCdn: false})
await client.patch(backup.sanity._id).set({heroMedia: backup.sanity.heroMedia}).commit()
console.log(`Restored heroMedia on ${backup.sanity._id} from ${file}`)

// Removes the trailing full stop from every heading (heroTitle and any field named "title", EN and ES) in Sanity.
// Question and exclamation marks stay. Backs up every changed value first. 2026-10-01.
// Usage: source ~/.config/sanity/alicron.env && node strip-title-dots.mjs [--dry]
import {createClient} from '@sanity/client'
import fs from 'node:fs'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const dry = process.argv.includes('--dry')
const docs = await client.fetch(`*[!(_id in path("drafts.**")) && _type in ["page","platform","application","offering","siteSettings"]]`)
const HEADINGS = new Set(['title', 'heroTitle'])
const backup = []; const tx = client.transaction()
const fix = (s) => s.replace(/(?<!\.)\.\s*$/, '')          // one trailing dot, not an ellipsis
for (const d of docs) {
  const sets = {}
  const walk = (o, path) => {
    if (Array.isArray(o)) return o.forEach((v, i) => walk(v, [...path, v && v._key ? `[_key=="${v._key}"]` : `[${i}]`]))
    if (!o || typeof o !== 'object') return
    for (const [k, v] of Object.entries(o)) {
      if (HEADINGS.has(k) && v && typeof v === 'object' && ('en' in v || 'es' in v)) {
        for (const lang of ['en', 'es']) {
          if (typeof v[lang] === 'string' && fix(v[lang]) !== v[lang]) {
            const p = [...path, k, lang].join('.').replace(/\.\[/g, '[')
            sets[p] = fix(v[lang]); backup.push({_id: d._id, path: p, before: v[lang]})
          }
        }
      } else walk(v, [...path, k])
    }
  }
  walk(d, [])
  if (Object.keys(sets).length) tx.patch(d._id, (p) => p.set(sets))
}
fs.writeFileSync(new URL('./backups/2026-10-01-title-dots.json', import.meta.url), JSON.stringify(backup, null, 1))
console.log(backup.length, 'headings'); backup.slice(0, 6).forEach((b) => console.log(' ', b._id, b.path, '|', b.before))
if (!dry && backup.length) { await tx.commit(); console.log('committed') }

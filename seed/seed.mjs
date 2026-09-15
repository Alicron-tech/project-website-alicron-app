// Pushes the website content (EN/ES) and images into the Sanity project. Idempotent: documents have stable ids.
// Run: source ~/.config/sanity/alicron.env && node seed.mjs
import {createClient} from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'
import {content, IMAGES} from './content.mjs'

const client = createClient({projectId: process.env.SANITY_PROJECT_ID ?? 'wividiap', dataset: process.env.SANITY_DATASET ?? 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
const GEN = path.resolve('../generated')
const cache = JSON.parse(fs.existsSync('.assets.json') ? fs.readFileSync('.assets.json', 'utf8') : '{}')

async function asset(key) {
  if (!key) return undefined
  if (cache[key]) return {_type: 'image', asset: {_type: 'reference', _ref: cache[key]}}
  const file = IMAGES[key]; const p = path.join(GEN, file)
  const doc = await client.assets.upload('image', fs.createReadStream(p), {filename: path.basename(p), title: key})
  cache[key] = doc._id; fs.writeFileSync('.assets.json', JSON.stringify(cache, null, 1))
  console.log('uploaded', key)
  return {_type: 'image', asset: {_type: 'reference', _ref: doc._id}}
}

let k = 0
const key = () => 'k' + (++k).toString(36) + Date.now().toString(36).slice(-3)
async function resolve(v) {
  if (Array.isArray(v)) return Promise.all(v.map(async (x) => (x && typeof x === 'object' && !x._key && !x._ref ? {_key: key(), ...(await resolve(x))} : resolve(x))))
  if (v && typeof v === 'object') {
    if (v.$img) return asset(v.$img)
    const out = {}
    for (const [kk, vv] of Object.entries(v)) out[kk] = await resolve(vv)
    return out
  }
  return v
}

const docs = await content()
const tx = client.transaction()
for (const d of docs) tx.createOrReplace(await resolve(d))
const res = await tx.commit()   // one transaction, so references between new documents resolve
console.log('done', docs.length, 'documents, transaction', res.transactionId)

// Marks the company page hero as wide (3:1) for the map (2026-10-13). Old code ignores the field.
import {createClient} from '@sanity/client'
const client = createClient({projectId: 'wividiap', dataset: 'production', apiVersion: '2025-06-01', token: process.env.SANITY_TOKEN, useCdn: false})
await client.patch('page-company').set({heroWide: true}).commit(); console.log('heroWide set')

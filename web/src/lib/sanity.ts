import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = 'wividiap'
export const dataset = 'production'

export const client = createClient({projectId, dataset, apiVersion: '2025-06-01', useCdn: true})
const builder = imageUrlBuilder(client)
export const urlFor = (source: unknown) => builder.image(source as never).auto('format')

export type Locale = 'en' | 'es'
export const locales: Locale[] = ['es', 'en']   // Spanish first
export const isLocale = (s: string): s is Locale => (locales as string[]).includes(s)

export type L<T = string> = {en?: T; es?: T} | null | undefined
// Locale number formatting (design system rule): ES uses a decimal comma and a thin space for thousands,
// EN a decimal point and a comma. Shared values are authored as "3 000 m" / "1.8 kg" and converted here.
export const fmt = (s: string, locale: Locale): string =>
  locale === 'en'
    ? s.replace(/(\d) (?=\d{3}(?!\d))/g, '$1,')
    : s.replace(/(\d)\.(?=\d)/g, '$1,').replace(/(\d),(?=\d{3}(?!\d))/g, '$1\u202f')
export const t = (v: L, locale: Locale): string => fmt((v?.[locale] ?? v?.en ?? '') as string, locale)
export const paras = (v: L, locale: Locale): string[] => t(v, locale).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)

export const fetchOpts = {next: {revalidate: 120}}

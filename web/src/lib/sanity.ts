import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const projectId = 'wividiap'
export const dataset = 'production'

export const client = createClient({projectId, dataset, apiVersion: '2025-06-01', useCdn: true})
const builder = imageUrlBuilder(client)
export const urlFor = (source: unknown) => builder.image(source as never).auto('format')

export type Locale = 'en' | 'es'
export const locales: Locale[] = ['en', 'es']
export const isLocale = (s: string): s is Locale => (locales as string[]).includes(s)

export type L<T = string> = {en?: T; es?: T} | null | undefined
export const t = (v: L, locale: Locale): string => (v?.[locale] ?? v?.en ?? '') as string
export const paras = (v: L, locale: Locale): string[] => t(v, locale).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)

export const fetchOpts = {next: {revalidate: 120}}

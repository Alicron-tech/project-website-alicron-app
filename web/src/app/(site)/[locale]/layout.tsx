import type {Metadata, Viewport} from 'next'
import {notFound} from 'next/navigation'
import '@/app/globals.css'
import {inter, mono} from '@/app/fonts'
import {Header} from '@/components/Header'
import {Footer} from '@/components/Footer'
import {getSettings} from '@/lib/queries'
import {isLocale, locales, t, type Locale} from '@/lib/sanity'

export const generateStaticParams = () => locales.map((locale) => ({locale}))
export const viewport: Viewport = {width: 'device-width', initialScale: 1, themeColor: '#FFFFFF'}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params
  const s = await getSettings()
  const l = (isLocale(locale) ? locale : 'en') as Locale
  return {
    title: {default: `ALICRON · ${t(s?.tagline, l)}`, template: '%s · ALICRON'},
    description: t(s?.description, l),
    robots: {index: false, follow: false, nocache: true},
    icons: {icon: '/icon.svg'},
  }
}

export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params
  if (!isLocale(locale)) notFound()
  const s = await getSettings()
  const nav = (s?.nav ?? []).map((n: {label: never; href: string}) => ({label: t(n.label, locale), href: n.href}))
  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable}`}>
      <body>
        <Header locale={locale} nav={nav} cta={t(s?.ctaLabel, locale) || (locale === 'es' ? 'Contacto' : 'Contact')} />
        <main>{children}</main>
        <Footer locale={locale} settings={s} />
      </body>
    </html>
  )
}

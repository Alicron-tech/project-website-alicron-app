import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getApplication, getSlugs} from '@/lib/queries'
import {t, paras, type Locale} from '@/lib/sanity'
import {Cards, Prose, StatStrip, type Ref} from '@/components/Sections'
import {Media} from '@/components/Media'

export const revalidate = 120
export async function generateStaticParams() { return (await getSlugs('application')).map((slug) => ({slug})) }
export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params; const a = await getApplication(slug)
  return {title: t(a?.name, locale), description: paras(a?.summary, locale)[0]}
}

export default async function ApplicationPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params
  const a = await getApplication(slug)
  if (!a) notFound()
  const es = locale === 'es'
  return (
    <>
      <section className="hero--page"><div className="wrap">
        <div className="head" style={{maxWidth: 900}}>
          <Link href={`/${locale}/applications`} className="eyebrow">{es ? 'Aplicaciones' : 'Applications'} /</Link>
          <h1 className="t-h1">{t(a.name, locale)}</h1>
          <p className="t-lead">{t(a.role, locale)}</p>
        </div>
        <Media media={a.media ?? {image: a.image, isVideoPlaceholder: false}} locale={locale} priority sizes="(max-width: 1400px) 100vw, 1360px" videoLabel={es ? 'Vídeo del escenario · próximamente' : 'Scenario video · coming soon'} />
      </div></section>
      <section className="section"><div className="wrap stack-l">
        <StatStrip stats={a.stats} locale={locale} />
        <div className="split" style={{alignItems: 'start'}}>
          <Prose v={a.body} locale={locale} />
          {a.outcomes?.length ? (
            <div className="stack"><div className="eyebrow">{es ? 'Qué recibe el cliente' : 'What the customer gets'}</div><ul className="bullets">{a.outcomes.map((o: never, i: number) => <li key={i}>{t(o, locale)}</li>)}</ul></div>
          ) : null}
        </div>
      </div></section>
      {a.platforms?.length ? (
        <section className="section"><div className="wrap"><div className="head"><div className="eyebrow">{es ? 'Con qué se vuela' : 'What flies it'}</div><h2 className="t-h2">{es ? 'Plataformas adecuadas' : 'Platforms that fit'}</h2></div><Cards refs={a.platforms as Ref[]} locale={locale} /></div></section>
      ) : null}
    </>
  )
}

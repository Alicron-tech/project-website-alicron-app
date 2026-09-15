import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getPlatform, getSlugs} from '@/lib/queries'
import {t, paras, urlFor, type Locale} from '@/lib/sanity'
import {Cards, Prose, StatStrip, type Ref} from '@/components/Sections'
import {Img} from '@/components/Media'
import Image from 'next/image'

export const revalidate = 120
export async function generateStaticParams() { return (await getSlugs('platform')).map((slug) => ({slug})) }
export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params; const p = await getPlatform(slug)
  return {title: t(p?.name, locale), description: paras(p?.summary, locale)[0]}
}

export default async function PlatformPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params
  const p = await getPlatform(slug)
  if (!p) notFound()
  const es = locale === 'es'
  return (
    <>
      <section className="hero--page"><div className="wrap">
        <div className="head" style={{maxWidth: 900}}>
          <div className="card__meta" style={{justifyContent: 'flex-start', gap: 14}}>
            <Link href={`/${locale}/platforms`} className="eyebrow">{es ? 'Plataformas' : 'Platforms'} /</Link>
            {p.family && <span className="chip">{p.family}</span>}
            {t(p.status, locale) && <span className="flag">{t(p.status, locale)}</span>}
          </div>
          <h1 className="t-h1">{t(p.name, locale)}</h1>
          <p className="t-lead">{t(p.role, locale)}</p>
        </div>
        <Img image={p.image} alt={t(p.name, locale)} className="media" sizes="(max-width: 1400px) 100vw, 1360px" width={2000} />
      </div></section>
      <section className="section"><div className="wrap stack-l">
        <StatStrip stats={p.stats} locale={locale} />
        <div className="split" style={{alignItems: 'start'}}>
          <Prose v={p.body} locale={locale} />
          {p.specs?.length ? (
            <dl className="rows">{p.specs.map((s: {label: never; value: never}, i: number) => <div key={i} className="row"><dt>{t(s.label, locale)}</dt><dd>{t(s.value, locale)}</dd></div>)}</dl>
          ) : null}
        </div>
      </div></section>
      {p.gallery?.length ? (
        <section className="section section--tight"><div className="wrap grid grid-2">
          {p.gallery.map((g: unknown, i: number) => <div key={i} className="media media--square" style={{position: 'relative'}}><Image src={urlFor(g).width(1600).url()} alt="" fill sizes="(max-width: 960px) 100vw, 50vw" style={{objectFit: 'cover'}} /></div>)}
        </div></section>
      ) : null}
      {p.applications?.length ? (
        <section className="section"><div className="wrap"><div className="head"><div className="eyebrow">{es ? 'Dónde se usa' : 'Where it is used'}</div><h2 className="t-h2">{es ? 'Aplicaciones para esta clase' : 'Applications for this class'}</h2></div><Cards refs={p.applications as Ref[]} locale={locale} /></div></section>
      ) : null}
    </>
  )
}

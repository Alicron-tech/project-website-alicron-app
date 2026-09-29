import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getPlatform, getSlugs} from '@/lib/queries'
import {t, paras, urlFor, type Locale} from '@/lib/sanity'
import {Cards, Prose, StatBlock, type Ref, type Stat} from '@/components/Sections'
import {Img} from '@/components/Media'

export const revalidate = 120
export async function generateStaticParams() { return (await getSlugs('platform')).map((slug) => ({slug})) }
export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params; const p = await getPlatform(slug)
  return {title: t(p?.name, locale), description: paras(p?.summary, locale)[0]}
}

/** Platform pages use the dark register of the design system: black ground, 122px gutter, square tactical chrome, grey CTA band. */
export default async function PlatformPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params
  const p = await getPlatform(slug)
  if (!p) notFound()
  const es = locale === 'es'
  const family = p.family === 'Multirotor' ? (es ? 'Multirrotor' : 'Multirotor') : p.family === 'Fixed-wing' ? (es ? 'Ala fija' : 'Fixed-wing') : ''
  return (
    <div className="al-dark" style={{marginTop: -1}}>
      <div className="col dhero">
        <div className="dhero__copy">
          <span className="mono-xs" style={{textTransform: 'uppercase', color: 'var(--surface-grey)'}}>
            <Link href={`/${locale}/platforms`}>{es ? 'Plataformas' : 'Platforms'}</Link> · {family}{t(p.status, locale) ? ` · ${t(p.status, locale)}` : ''}
          </span>
          <h1 className="display-2">{t(p.name, locale)}</h1>
          <p className="ui-body dhero__sub">{t(p.role, locale)}</p>
          <div className="dhero__actions">
            <Link href={`/${locale}/contact`} className="tbtn tbtn--accent">{es ? 'Solicitar demostración' : 'Request a demonstration'}</Link>
            <Link href={`/${locale}/applications`} className="tbtn">{es ? 'Ver aplicaciones' : 'See applications'}</Link>
          </div>
        </div>
        <Img image={p.image} alt={t(p.name, locale)} className="frame__box frame__box--43" sizes="(max-width: 900px) 100vw, 55vw" width={2000} priority />
      </div>

      <div className="col dgrid">
        <div>
          <h2 className="display-5">{es ? 'Especificaciones' : 'Specifications'}</h2>
          <div style={{marginTop: 24}}>
            {(p.specs ?? []).map((s: {label: never; value: never}, i: number) => <div key={i} className="specrow"><span className="specrow__k">{t(s.label, locale)}</span><span className="specrow__v">{t(s.value, locale)}</span></div>)}
          </div>
          <div style={{marginTop: 40}}><Prose v={p.body} locale={locale} /></div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 48, paddingTop: 12}}>
          {(p.stats ?? []).map((s: Stat, i: number) => <StatBlock key={i} s={s} locale={locale} />)}
          <Prose v={p.summary} locale={locale} className="ui-body" />
        </div>
      </div>

      {p.gallery?.length ? (
        <div className="col dsection">
          <div className="tiles">
            {p.gallery.map((g: unknown, i: number) => (
              <figure key={i} className="tile" style={{margin: 0}}>
                <Image src={urlFor(g).width(1600).url()} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
                <figcaption className="tile__cap"><span className="tile__meta">{t(p.name, locale)} · {String(i + 1).padStart(2, '0')}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}

      {p.applications?.length ? (
        <div className="col dsection">
          <div className="sh"><div className="sh__copy"><span className="eyebrow" style={{color: 'var(--surface-grey)'}}>{es ? 'Dónde se usa' : 'Where it is used'}</span><h2 className="display-2">{es ? 'Aplicaciones para esta clase' : 'Applications for this class'}</h2></div></div>
          <div style={{marginTop: 40}}><Cards refs={p.applications as Ref[]} locale={locale} /></div>
        </div>
      ) : null}

      <section className="cta-band" style={{marginTop: 'var(--gutter-dark)'}}>
        <h2 className="display-2">{es ? 'Solicita una demostración de vuelo.' : 'Request a flight demonstration.'}</h2>
        <Link href={`/${locale}/contact`} className="tbtn tbtn--light">{es ? 'Contactar' : 'Get in touch'}</Link>
      </section>
    </div>
  )
}

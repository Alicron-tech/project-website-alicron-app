import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getApplication, getSlugs} from '@/lib/queries'
import {t, paras, type Locale} from '@/lib/sanity'
import {Cards, Prose, StatStrip, type Ref} from '@/components/Sections'
import {Media} from '@/components/Media'
import {Sketch} from '@/components/Sketch'

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
      <div className="col"><div className="ruled hero-wrap">
        {!a.media?.videoUrl && <Sketch seed={slug} />}
        <section className="hero hero--media">
          <div className="hero__copy">
            <div className="kicker"><span className="badge badge--quiet"><span>{es ? 'Aplicación' : 'Application'}</span></span><Link href={`/${locale}/applications`}>{es ? 'Todas las aplicaciones →' : 'All applications →'}</Link></div>
            <h1 className="display-1">{t(a.name, locale)}</h1>
            <p className="mono-md hero__sub muted">{t(a.role, locale)}</p>
          </div>
        </section>
        <div style={{padding: '0 var(--cell-pad) var(--cell-pad)'}}>
          <Media media={a.media ?? {image: a.image, isVideoPlaceholder: false}} locale={locale} priority sizes="(max-width: 1444px) 100vw, 1320px" videoLabel={es ? 'Vídeo del escenario · en producción' : 'Scenario video · in production'} />
        </div>
      </div></div>
      <div className="col"><div className="ruled rule-top">
        <StatStrip stats={a.stats} locale={locale} />
        <div className="split rule-top">
          <div className="fb"><span className="eyebrow">{es ? 'Cómo se trabaja' : 'How the job runs'}</span><Prose v={a.body} locale={locale} /></div>
          <div className="media-cell">
            {a.outcomes?.length ? (<><span className="eyebrow">{es ? 'Qué recibe el cliente' : 'What the client receives'}</span><ul className="points" style={{marginTop: 16}}>{a.outcomes.map((o: never, i: number) => <li key={i}>{t(o, locale)}</li>)}</ul></>) : null}
          </div>
        </div>
      </div></div>
      {a.platforms?.length ? (
        <div className="col"><div className="ruled rule-top">
          <div className="cell rule-bottom"><div className="sh"><div className="sh__copy"><span className="eyebrow">{es ? 'Con qué se vuela' : 'What flies it'}</span><h2 className="display-3">{es ? 'Plataformas adecuadas' : 'Platforms that fit'}</h2></div></div></div>
          <Cards refs={a.platforms as Ref[]} locale={locale} />
        </div></div>
      ) : null}
      <section className="cta-band" style={{marginTop: 'clamp(48px, 5.5vw, 80px)'}}>
        <h2 className="display-2">{es ? 'Cuéntanos qué hay que inspeccionar.' : 'Tell us what needs inspecting.'}</h2>
        <Link href={`/${locale}/contact`} className="tbtn tbtn--light">{es ? 'Contactar' : 'Get in touch'}</Link>
      </section>
    </>
  )
}

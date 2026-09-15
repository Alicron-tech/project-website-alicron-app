import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getPage, getPlatforms, getApplications, getOfferings} from '@/lib/queries'
import {t, paras, type Locale} from '@/lib/sanity'
import {PageHero} from '@/components/PageHero'
import {Cards, Prose, SectionView, type Section, type Ref} from '@/components/Sections'
import {Img} from '@/components/Media'

export const revalidate = 120
const PAGES = ['platforms', 'applications', 'software', 'training', 'engineering', 'company', 'contact', 'privacy']
export const generateStaticParams = () => PAGES.map((slug) => ({slug}))

export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params
  const page = await getPage(slug)
  return {title: t(page?.title, locale), description: t(page?.metaDescription, locale)}
}

function Offerings({items, locale}: {items: Record<string, never>[]; locale: Locale}) {
  return (
    <section className="section"><div className="wrap stack-l">
      {items.map((o, i) => (
        <div key={o.slug as string} id={o.slug as string} className={`split ${i % 2 ? 'split--reverse' : ''}`} style={{paddingTop: i ? 44 : 0, borderTop: i ? '1px solid var(--line)' : 'none'}}>
          <div className="stack">
            <div className="card__meta"><span className="num">{String(i + 1).padStart(2, '0')}</span>{t(o.status, locale) && <span className="chip">{t(o.status, locale)}</span>}</div>
            <h2 className="t-h2">{t(o.name, locale)}</h2>
            {t(o.role, locale) && <p className="t-lead">{t(o.role, locale)}</p>}
            <Prose v={o.body} locale={locale} />
            {Array.isArray(o.points) && (o.points as never[]).length > 0 && (
              <ul className="bullets">{(o.points as never[]).map((p, j) => <li key={j}>{t(p, locale)}</li>)}</ul>
            )}
          </div>
          <Img image={o.image} alt={t(o.name, locale)} className="media media--square" sizes="(max-width: 960px) 100vw, 50vw" width={1600} />
        </div>
      ))}
    </div></section>
  )
}

export default async function Page({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params
  if (!PAGES.includes(slug)) notFound()
  const page = await getPage(slug)
  if (!page) notFound()
  const sections = (page.sections ?? []) as Section[]
  let listing: React.ReactNode = null
  if (slug === 'platforms') listing = <section className="section"><div className="wrap"><Cards refs={(await getPlatforms()) as Ref[]} locale={locale} /></div></section>
  if (slug === 'applications') listing = <section className="section"><div className="wrap"><Cards refs={(await getApplications()) as Ref[]} locale={locale} /></div></section>
  if (['software', 'training', 'engineering'].includes(slug)) listing = <Offerings items={await getOfferings(slug)} locale={locale} />
  return (
    <>
      <PageHero page={page} locale={locale} />
      {listing}
      {sections.map((s, i) => <SectionView key={i} s={s} locale={locale} index={i + 1} />)}
      {slug === 'contact' && <ContactBlock locale={locale} />}
    </>
  )
}

async function ContactBlock({locale}: {locale: Locale}) {
  const {getSettings} = await import('@/lib/queries')
  const s = await getSettings()
  const es = locale === 'es'
  return (
    <section className="section"><div className="wrap split">
      <div className="stack">
        <div className="eyebrow">{es ? 'Escríbanos' : 'Write to us'}</div>
        <h2 className="t-h2">{es ? 'Una conversación primero' : 'A conversation first'}</h2>
        <p className="t-body">{es ? 'Cuéntenos qué quiere inspeccionar, mapear o automatizar y desde dónde. Respondemos en un día laborable con las preguntas que necesitamos aclarar antes de proponer nada.' : 'Tell us what you want to inspect, map or automate, and where. We reply within a working day with the questions we need answered before we propose anything.'}</p>
        {s?.email && <a className="btn btn--accent" href={`mailto:${s.email}`}>{s.email}</a>}
      </div>
      <dl className="rows" style={{alignSelf: 'start'}}>
        <div className="row"><dt>{es ? 'Sede' : 'Office'}</dt><dd>{paras(s?.address, locale).map((p, i) => <div key={i}>{p}</div>)}</dd></div>
        {s?.phone && <div className="row"><dt>{es ? 'Teléfono' : 'Phone'}</dt><dd>{s.phone}</dd></div>}
        <div className="row"><dt>{es ? 'Horario' : 'Hours'}</dt><dd>{es ? 'Lunes a viernes, 9:00 a 18:00 CET' : 'Monday to Friday, 9:00 to 18:00 CET'}</dd></div>
        <div className="row"><dt>{es ? 'Idiomas' : 'Languages'}</dt><dd>{es ? 'Español, inglés, ucraniano' : 'Spanish, English, Ukrainian'}</dd></div>
      </dl>
    </div></section>
  )
}

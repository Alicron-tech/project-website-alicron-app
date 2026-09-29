import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getPage, getPlatforms, getApplications, getOfferings, getSettings} from '@/lib/queries'
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
    <div className="col"><div className="ruled rule-top">
      {items.map((o, i) => (
        <div key={o.slug as string} id={o.slug as string} className={`offer ${i % 2 ? 'offer--reverse' : ''}`}>
          <div className="offer__copy">
            <div className="offer__meta"><span className="feature__n">{String(i + 1).padStart(2, '0')}</span>{t(o.status, locale) && <span className="badge badge--quiet"><span>{t(o.status, locale)}</span></span>}</div>
            <h2 className="display-3">{t(o.name, locale)}</h2>
            {t(o.role, locale) && <p className="mono-md muted">{t(o.role, locale)}</p>}
            <Prose v={o.body} locale={locale} />
            {Array.isArray(o.points) && (o.points as never[]).length > 0 && (
              <ul className="points">{(o.points as never[]).map((p, j) => <li key={j}>{t(p, locale)}</li>)}</ul>
            )}
          </div>
          <div className="offer__media"><Img image={o.image} alt={t(o.name, locale)} className="frame__box frame__box--md frame__box--43" sizes="(max-width: 900px) 100vw, 50vw" width={1600} /></div>
        </div>
      ))}
    </div></div>
  )
}

export default async function Page({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params
  if (!PAGES.includes(slug)) notFound()
  const page = await getPage(slug)
  if (!page) notFound()
  const sections = (page.sections ?? []) as Section[]
  let listing: React.ReactNode = null
  if (slug === 'platforms') listing = <div className="col"><div className="ruled rule-top"><Cards refs={(await getPlatforms()) as Ref[]} locale={locale} /></div></div>
  if (slug === 'applications') listing = <div className="col"><div className="ruled rule-top"><Cards refs={(await getApplications()) as Ref[]} locale={locale} /></div></div>
  if (['software', 'training', 'engineering'].includes(slug)) listing = <Offerings items={await getOfferings(slug)} locale={locale} />
  return (
    <>
      <PageHero page={page} locale={locale} />
      {listing}
      {sections.map((s, i) => <SectionView key={i} s={s} locale={locale} index={i + 1} />)}
      {slug === 'contact' && <ContactBlock locale={locale} />}
      <div className="spacer" />
    </>
  )
}

async function ContactBlock({locale}: {locale: Locale}) {
  const s = await getSettings()
  const es = locale === 'es'
  const rows: [string, string][] = [
    [es ? 'Sede' : 'Office', t(s?.address, locale).split('\n').slice(1).join(', ')],
    [es ? 'Correo' : 'Email', s?.email ?? ''],
    [es ? 'Horario' : 'Hours', es ? 'Lunes a viernes, 9:00 a 18:00 CET' : 'Monday to Friday, 9:00 to 18:00 CET'],
    [es ? 'Idiomas' : 'Languages', es ? 'Español, inglés, ucraniano' : 'Spanish, English, Ukrainian'],
  ]
  return (
    <div className="col"><div className="ruled rule-top split">
      <div className="fb">
        <span className="eyebrow">{es ? 'Escríbenos' : 'Write to us'}</span>
        <h2 className="display-3">{es ? 'Primero, una conversación.' : 'A conversation first.'}</h2>
        <p className="body-lg">{es ? 'Cuéntanos qué hay que inspeccionar, cartografiar o automatizar, y desde dónde. Respondemos en un día laborable con las preguntas que necesitamos aclarar antes de proponer nada.' : 'Tell us what needs inspecting, mapping or automating, and from where. We reply within a working day with the questions we need answered before we propose anything.'}</p>
        {s?.email && <div><a className="btn" href={`mailto:${s.email}`}>{s.email}</a></div>}
      </div>
      <div className="media-cell">
        {rows.filter(([, v]) => v).map(([k, v]) => <div key={k} className="specrow"><span className="specrow__k">{k}</span><span className="specrow__v">{v}</span></div>)}
        <div style={{marginTop: 24}}><Link href={`/${locale}/company`} className="tlink">{es ? 'Sobre la compañía' : 'About the company'} <span className="arrow">→</span></Link></div>
      </div>
    </div></div>
  )
}

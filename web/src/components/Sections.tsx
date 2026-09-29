import Link from 'next/link'
import {t, paras, type Locale} from '@/lib/sanity'
import {Media, Img} from './Media'

type LS = {en?: string; es?: string}
export type Stat = {value: string; label?: LS}
export type Ref = {_type: string; slug: string; name?: LS; role?: LS; summary?: LS; image?: unknown; category?: string; family?: string; status?: LS; stats?: Stat[]}
export type Section = {kind: string; eyebrow?: LS; title?: LS; lead?: LS; body?: LS; reverse?: boolean; ctaLabel?: LS; ctaHref?: string; media?: never; stats?: Stat[]; features?: {title?: LS; text?: LS; href?: string; image?: unknown}[]; refs?: Ref[]}

export const refPath = (r: Ref) => (r._type === 'platform' ? `/platforms/${r.slug}` : r._type === 'application' ? `/applications/${r.slug}` : `/${r.category ?? 'software'}#${r.slug}`)
const familyLabel = (f: string | undefined, locale: Locale) => (f === 'Multirotor' ? (locale === 'es' ? 'Multirrotor' : 'Multirotor') : f === 'Fixed-wing' ? (locale === 'es' ? 'Ala fija' : 'Fixed-wing') : f ?? '')

export function StatBlock({s, locale}: {s: Stat; locale: Locale}) {
  const [v, ...u] = s.value.split(/\s+(?=[^\d,.]+$)/)   // "55 min" -> value 55, unit min; "3 000 m" -> "3 000", "m"
  const value = u.length ? v : s.value
  const unit = u.join(' ')
  return (
    <div className="stat">
      {t(s.label, locale) && <span className="stat__l">{t(s.label, locale)}</span>}
      <span className="stat__v">{value}{unit ? <span style={{fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 18, letterSpacing: 0, marginLeft: 8}}>{unit}</span> : null}</span>
    </div>
  )
}

export function StatStrip({stats, locale}: {stats?: Stat[]; locale: Locale}) {
  if (!stats?.length) return null
  return <div className="stats rule-top">{stats.map((s, i) => <div key={i} className="cell"><StatBlock s={s} locale={locale} /></div>)}</div>
}

export function Cards({refs, locale}: {refs?: Ref[]; locale: Locale}) {
  if (!refs?.length) return null
  const cols = refs.length === 2 || refs.length === 4 ? 2 : 3
  return (
    <div className={`cells cells--${cols}`}>
      {refs.map((r) => (
        <Link key={r.slug} href={`/${locale}${refPath(r)}`} className="cell case" style={{padding: 0}}>
          <div style={{padding: 'var(--cell-pad)', display: 'flex', flexDirection: 'column', flex: 1}}>
            <Img image={r.image} alt={t(r.name, locale)} sizes="(max-width: 900px) 100vw, 40vw" />
            <span className="case__client">{r.family ? familyLabel(r.family, locale) : t(r.status, locale) || (r.category ?? '')}</span>
            <h3 className="display-4">{t(r.name, locale)}</h3>
            <p className="body-lg">{t(r.role, locale) || paras(r.summary, locale)[0]}</p>
            <div className="case__actions"><span className="tlink">{locale === 'es' ? 'Ver ficha' : 'View'} <span className="arrow">→</span></span></div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function Prose({v, locale, className = 'body-lg'}: {v?: LS; locale: Locale; className?: string}) {
  const ps = paras(v, locale)
  if (!ps.length) return null
  return <div className={className}>{ps.map((p, i) => <p key={i}>{p}</p>)}</div>
}

function Cta({s, locale, tactical}: {s: Section; locale: Locale; tactical?: 'light' | 'dark'}) {
  if (!s.ctaHref || !t(s.ctaLabel, locale)) return null
  if (tactical) return <Link href={`/${locale}${s.ctaHref}`} className={`tbtn ${tactical === 'light' ? 'tbtn--light' : ''}`}>{t(s.ctaLabel, locale)}</Link>
  return <Link href={`/${locale}${s.ctaHref}`} className="pill">{t(s.ctaLabel, locale)} <span className="arrow" aria-hidden="true">→</span></Link>
}

function Heading({s, locale, dark, action}: {s: Section; locale: Locale; dark?: boolean; action?: React.ReactNode}) {
  const eyebrow = t(s.eyebrow, locale), title = t(s.title, locale), lead = paras(s.lead, locale)
  if (!eyebrow && !title && !lead.length) return null
  return (
    <div className="sh">
      <div className="sh__copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {title && <h2 className={dark ? 'display-2' : 'display-3'}>{title}</h2>}
        {lead.map((l, i) => <p key={i} className="body-lg sh__sub">{l}</p>)}
      </div>
      {action}
    </div>
  )
}

export function SectionView({s, locale, index}: {s: Section; locale: Locale; index: number}) {
  void index
  switch (s.kind) {
    case 'prose':
      return (
        <div className="col"><div className="ruled rule-top" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
          <div className="cell" style={{borderRight: '1px dashed var(--rule-dashed)'}}><Heading s={s} locale={locale} /><div style={{marginTop: 24}}><Cta s={s} locale={locale} /></div></div>
          <div className="cell"><Prose v={s.body} locale={locale} /></div>
        </div></div>
      )
    case 'features':
      return (
        <div className="col"><div className="ruled rule-top">
          <div className="cell rule-bottom"><Heading s={s} locale={locale} /></div>
          <div className={`cells cells--${Math.min(4, Math.max(2, s.features?.length ?? 3))}`}>
            {s.features?.map((f, i) => (
              <div key={i} className="cell feature">
                <span className="feature__n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display-5">{t(f.title, locale)}</h3>
                <Prose v={f.text} locale={locale} />
                {f.href && <Link className="tlink" href={`/${locale}${f.href}`}>{locale === 'es' ? 'Más' : 'More'} <span className="arrow">→</span></Link>}
              </div>
            ))}
          </div>
          {s.ctaHref && <div className="cell"><Cta s={s} locale={locale} /></div>}
        </div></div>
      )
    case 'media':
      return <div className="col"><div className="ruled rule-top cell">{(t(s.title, locale) || t(s.eyebrow, locale)) && <div style={{marginBottom: 32}}><Heading s={s} locale={locale} /></div>}<Media media={s.media} locale={locale} sizes="(max-width: 1444px) 100vw, 1320px" /></div></div>
    case 'stats':
      return <div className="col"><div className="ruled rule-top">{(t(s.title, locale) || t(s.eyebrow, locale)) && <div className="cell"><Heading s={s} locale={locale} /></div>}<StatStrip stats={s.stats} locale={locale} /></div></div>
    case 'dark':
      return (
        <section className="al-dark" style={{marginTop: 'clamp(48px, 5.5vw, 80px)', paddingBottom: 'var(--gutter-dark)'}}>
          <div className="col dsection">
            <Heading s={s} locale={locale} dark action={<Cta s={s} locale={locale} tactical="dark" />} />
            <div className="dgrid" style={{paddingTop: 'clamp(40px, 3.9vw, 56px)'}}>
              <Prose v={s.body} locale={locale} />
              {s.media && <Media media={s.media} locale={locale} radius="none" sizes="(max-width: 960px) 100vw, 50vw" />}
            </div>
            {s.stats?.length ? <div style={{marginTop: 'var(--section-dark)'}}><StatStrip stats={s.stats} locale={locale} /></div> : null}
          </div>
        </section>
      )
    case 'cards':
      return (
        <div className="col"><div className="ruled rule-top">
          <div className="cell rule-bottom"><Heading s={s} locale={locale} action={s.ctaHref ? <Link href={`/${locale}${s.ctaHref}`} className="tlink">{t(s.ctaLabel, locale)} <span className="arrow">→</span></Link> : undefined} /></div>
          <Cards refs={s.refs} locale={locale} />
        </div></div>
      )
    case 'split':
      return (
        <div className="col"><div className={`ruled rule-top split ${s.reverse ? 'split--reverse' : ''}`}>
          <div className="fb">
            {t(s.eyebrow, locale) && <span className="eyebrow">{t(s.eyebrow, locale)}</span>}
            <h2 className="display-3">{t(s.title, locale)}</h2>
            <Prose v={s.lead} locale={locale} />
            <Prose v={s.body} locale={locale} />
            <div><Cta s={s} locale={locale} /></div>
          </div>
          <div className="media-cell"><Media media={s.media} locale={locale} sizes="(max-width: 900px) 100vw, 60vw" /></div>
        </div></div>
      )
    case 'cta':
      return (
        <section className="cta-band" style={{marginTop: 'clamp(48px, 5.5vw, 80px)'}}>
          <div>
            <h2 className="display-2">{t(s.title, locale)}</h2>
            {paras(s.lead, locale)[0] && <p className="mono-md" style={{marginTop: 16, color: 'var(--ink-600)', maxWidth: 560}}>{paras(s.lead, locale)[0]}</p>}
          </div>
          <Cta s={s} locale={locale} tactical="light" />
        </section>
      )
    default:
      return null
  }
}

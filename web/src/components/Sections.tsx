import Link from 'next/link'
import {t, paras, type Locale} from '@/lib/sanity'
import {Media, Img} from './Media'

type LS = {en?: string; es?: string}
export type Stat = {value: string; label?: LS}
export type Ref = {_type: string; slug: string; name?: LS; role?: LS; summary?: LS; image?: unknown; category?: string; family?: string; status?: LS; stats?: Stat[]}
export type Section = {kind: string; eyebrow?: LS; title?: LS; lead?: LS; body?: LS; reverse?: boolean; ctaLabel?: LS; ctaHref?: string; media?: never; stats?: Stat[]; features?: {title?: LS; text?: LS; href?: string; image?: unknown}[]; refs?: Ref[]}

export const refPath = (r: Ref) => (r._type === 'platform' ? `/platforms/${r.slug}` : r._type === 'application' ? `/applications/${r.slug}` : `/${r.category ?? 'software'}#${r.slug}`)

export function Stats({stats}: {stats?: Stat[]}) {
  if (!stats?.length) return null
  return null
}

export function StatStrip({stats, locale}: {stats?: Stat[]; locale: Locale}) {
  if (!stats?.length) return null
  return (
    <div className="stats">
      {stats.map((s, i) => (
        <div key={i}><div className="stat__v">{s.value}</div><div className="stat__l">{t(s.label, locale)}</div></div>
      ))}
    </div>
  )
}

export function Cards({refs, locale}: {refs?: Ref[]; locale: Locale}) {
  if (!refs?.length) return null
  return (
    <div className="grid grid-3">
      {refs.map((r, i) => (
        <Link key={r.slug} href={`/${locale}${refPath(r)}`} className="card">
          <Img image={r.image} alt={t(r.name, locale)} />
          <div className="card__meta"><span className="num">{String(i + 1).padStart(2, '0')}</span>{r.family && <span className="chip">{r.family}</span>}</div>
          <h3 className="t-h4">{t(r.name, locale)}</h3>
          <p>{t(r.role, locale) || paras(r.summary, locale)[0]}</p>
        </Link>
      ))}
    </div>
  )
}

export function Prose({v, locale, className = 't-body'}: {v?: LS; locale: Locale; className?: string}) {
  const ps = paras(v, locale)
  if (!ps.length) return null
  return <div className={className}>{ps.map((p, i) => <p key={i}>{p}</p>)}</div>
}

function Cta({s, locale}: {s: Section; locale: Locale}) {
  if (!s.ctaHref || !t(s.ctaLabel, locale)) return null
  return <Link href={`/${locale}${s.ctaHref}`} className="btn btn--ink">{t(s.ctaLabel, locale)} <span className="arrow">→</span></Link>
}

export function SectionView({s, locale, index}: {s: Section; locale: Locale; index: number}) {
  const eyebrow = t(s.eyebrow, locale), title = t(s.title, locale)
  const Head = (
    <div className="head">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {title && <h2 className="t-h2">{title}</h2>}
      <Prose v={s.lead} locale={locale} className="t-lead" />
    </div>
  )
  switch (s.kind) {
    case 'prose':
      return <section className="section"><div className="wrap split"><div>{Head}<Cta s={s} locale={locale} /></div><Prose v={s.body} locale={locale} /></div></section>
    case 'features':
      return (
        <section className="section"><div className="wrap">{Head}
          <div className={`grid grid-${Math.min(4, Math.max(2, s.features?.length ?? 3))}`}>
            {s.features?.map((f, i) => (
              <div key={i} className="feature">
                {f.image ? <Img image={f.image} alt={t(f.title, locale)} className="card__img" /> : <span className="feature__n">{String(i + 1).padStart(2, '0')}</span>}
                <h3 className="t-h4">{t(f.title, locale)}</h3>
                <Prose v={f.text} locale={locale} className="" />
                {f.href && <Link className="more" href={`/${locale}${f.href}`}>{locale === 'es' ? 'Más' : 'More'} →</Link>}
              </div>
            ))}
          </div>
          {s.ctaHref && <div style={{marginTop: 40}}><Cta s={s} locale={locale} /></div>}
        </div></section>
      )
    case 'media':
      return (
        <section className="section section--tight"><div className="wrap">
          {(eyebrow || title) && Head}
          <Media media={s.media} locale={locale} sizes="(max-width: 1400px) 100vw, 1360px" />
        </div></section>
      )
    case 'stats':
      return <section className="section"><div className="wrap">{(eyebrow || title) && Head}<StatStrip stats={s.stats} locale={locale} /></div></section>
    case 'dark':
      return (
        <section className="surface-dark"><div className="section"><div className="wrap">
          <div className="head">{eyebrow && <div className="eyebrow eyebrow--accent">{eyebrow}</div>}{title && <h2 className="t-h1">{title}</h2>}<Prose v={s.lead} locale={locale} className="t-lead" /></div>
          <div className="split"><Prose v={s.body} locale={locale} /><div>{s.media && <Media media={s.media} locale={locale} sizes="(max-width: 960px) 100vw, 50vw" />}</div></div>
          {s.stats?.length ? <div style={{marginTop: 56}}><StatStrip stats={s.stats} locale={locale} /></div> : null}
          {s.ctaHref && <div style={{marginTop: 40}}><Cta s={s} locale={locale} /></div>}
        </div></div></section>
      )
    case 'cards':
      return <section className="section"><div className="wrap">{Head}<Cards refs={s.refs} locale={locale} />{s.ctaHref && <div style={{marginTop: 40}}><Cta s={s} locale={locale} /></div>}</div></section>
    case 'split':
      return (
        <section className="section"><div className={`wrap split ${s.reverse ? 'split--reverse' : ''}`}>
          <div className="stack-l">{Head}<Prose v={s.body} locale={locale} /><Cta s={s} locale={locale} /></div>
          <Media media={s.media} locale={locale} className="media--square" sizes="(max-width: 960px) 100vw, 50vw" />
        </div></section>
      )
    case 'cta':
      return (
        <section className="section"><div className="wrap" style={{display: 'grid', gap: 24, justifyItems: 'start'}}>
          <span className="numeral" aria-hidden="true">{String(index).padStart(2, '0')}</span>
          {title && <h2 className="t-h1" style={{maxWidth: 900}}>{title}</h2>}
          <Prose v={s.lead} locale={locale} className="t-lead" />
          <Cta s={s} locale={locale} />
        </div></section>
      )
    default:
      return null
  }
}

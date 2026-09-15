import Link from 'next/link'
import {t, paras, type Locale} from '@/lib/sanity'
import {Media} from './Media'

export function PageHero({page, locale, full = false}: {page: Record<string, never>; locale: Locale; full?: boolean}) {
  const p = page as Record<string, never>
  const eyebrow = t(p.heroEyebrow, locale), title = t(p.heroTitle, locale) || t(p.title, locale), lead = paras(p.heroLead, locale)
  const cta = t(p.heroCtaLabel, locale)
  if (full && p.heroMedia) {
    return (
      <section className="hero">
        <div className="hero__media">
          <Media media={p.heroMedia} locale={locale} className="media--band" priority sizes="100vw" videoLabel={locale === 'es' ? 'Vídeo · próximamente' : 'Video · coming soon'} />
          <div className="hero__grad" />
        </div>
        <div className="hero__copy"><div className="wrap stack">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 className="t-display" style={{maxWidth: 980}}>{title}</h1>
          {lead[0] && <p className="t-lead">{lead[0]}</p>}
          <div className="hero__row">
            {cta && p.heroCtaHref && <Link href={`/${locale}${p.heroCtaHref}`} className="btn btn--accent">{cta} <span className="arrow">→</span></Link>}
            <Link href={`/${locale}/platforms`} className="btn btn--ghost" style={{color: '#fff', borderColor: 'rgba(255,255,255,.4)'}}>{locale === 'es' ? 'Ver plataformas' : 'See the platforms'}</Link>
          </div>
        </div></div>
      </section>
    )
  }
  return (
    <section className="hero--page"><div className="wrap">
      <div className="head" style={{maxWidth: 900}}>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1 className="t-h1">{title}</h1>
        {lead.map((l, i) => <p key={i} className="t-lead">{l}</p>)}
        {cta && p.heroCtaHref && <div><Link href={`/${locale}${p.heroCtaHref}`} className="btn btn--ink">{cta} <span className="arrow">→</span></Link></div>}
      </div>
      {p.heroMedia && <Media media={p.heroMedia} locale={locale} priority sizes="(max-width: 1400px) 100vw, 1360px" />}
    </div></section>
  )
}

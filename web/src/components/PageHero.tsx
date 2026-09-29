import Link from 'next/link'
import {t, paras, urlFor, type Locale} from '@/lib/sanity'
import {Media} from './Media'
import {Sketch} from './Sketch'

/** Light hero from the design system: badge + mono kicker, Geist Bold display title, mono standfirst, actions.
 *  The hero media (photo or video placeholder) sits below in the ruled column at 10px radius. */
export function PageHero({page, locale, full = false}: {page: Record<string, never>; locale: Locale; full?: boolean}) {
  const p = page as Record<string, never>
  const eyebrow = t(p.heroEyebrow, locale), title = t(p.heroTitle, locale) || t(p.title, locale), lead = paras(p.heroLead, locale)
  const cta = t(p.heroCtaLabel, locale)
  const es = locale === 'es'
  const hm = p.heroMedia as {videoUrl?: string; image?: unknown; alt?: never} | undefined
  if (full && hm?.videoUrl) {
    // Full-bleed video hero (first screen): the film plays behind the copy, the copy sits on a photo scrim.
    const poster = hm.image ? urlFor(hm.image).width(2000).url() : undefined
    return (
      <section className="vhero al-dark">
        <video className="vhero__video" src={hm.videoUrl} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        <div className="vhero__scrim" />
        <div className="col vhero__copy">
          {eyebrow && <div className="kicker" style={{color: 'var(--surface-grey)'}}><span className="badge"><span>{es ? 'Ingeniería' : 'Engineering'}</span></span><span>{eyebrow}</span></div>}
          <h1 className="display-1">{title}</h1>
          {lead[0] && <p className="mono-md hero__sub" style={{color: 'var(--surface-grey)'}}>{lead[0]}</p>}
          <div className="hero__actions">
            {cta && p.heroCtaHref && <Link href={`/${locale}${p.heroCtaHref}`} className="tbtn tbtn--accent">{cta}</Link>}
            <Link href={`/${locale}/platforms`} className="tbtn">{es ? 'Ver plataformas' : 'See the platforms'}</Link>
          </div>
        </div>
      </section>
    )
  }
  return (
    <div className="col">
      <div className="ruled hero-wrap">
        {!(p.heroMedia as {videoUrl?: string} | undefined)?.videoUrl && <Sketch seed={String(t(p.title, 'en'))} />}
        <section className={`hero ${p.heroMedia ? 'hero--media' : ''}`}>
          <div className="hero__copy">
            {eyebrow && (
              <div className="kicker">
                <span className="badge"><span>{es ? 'Ingeniería' : 'Engineering'}</span></span>
                <span>{eyebrow}</span>
              </div>
            )}
            <h1 className="display-1">{title}</h1>
            {lead[0] && <p className="mono-md hero__sub muted">{lead[0]}</p>}
            {lead.slice(1).map((l, i) => <p key={i} className="body-lg hero__sub">{l}</p>)}
            {(cta || full) && (
              <div className="hero__actions">
                {cta && p.heroCtaHref && <Link href={`/${locale}${p.heroCtaHref}`} className="btn">{cta}</Link>}
                {full && <Link href={`/${locale}/platforms`} className="btn btn--secondary">{es ? 'Ver plataformas' : 'See the platforms'}</Link>}
              </div>
            )}
          </div>
        </section>
        {p.heroMedia && (
          <div style={{padding: '0 var(--cell-pad) var(--cell-pad)'}}>
            <Media media={p.heroMedia} locale={locale} priority sizes="(max-width: 1444px) 100vw, 1320px" videoLabel={es ? 'Vídeo · en producción' : 'Video · in production'} />
          </div>
        )}
      </div>
    </div>
  )
}

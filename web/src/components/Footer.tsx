import Link from 'next/link'
import {t, type Locale} from '@/lib/sanity'

export function Footer({locale, settings}: {locale: Locale; settings: Record<string, never> | null | undefined}) {
  const s = (settings ?? {}) as Record<string, never>
  const href = (p: string) => `/${locale}${p === '/' ? '' : p}`
  const es = locale === 'es'
  const cols: [string, [string, string][]][] = [
    [es ? 'Plataformas' : 'Platforms', [[es ? 'Todas las clases' : 'All classes', '/platforms'], [es ? 'Multirrotor 15″ satelital' : '15-inch satellite-linked', '/platforms/multirotor-15-satellite'], [es ? 'Ala fija de levantamiento' : 'Fixed-wing survey', '/platforms/fixed-wing-endurance']]],
    [es ? 'Aplicaciones' : 'Applications', [[es ? 'Tuberías' : 'Pipelines', '/applications/pipeline-inspection'], [es ? 'Líneas eléctricas' : 'Power lines', '/applications/power-lines'], [es ? 'Cultivos' : 'Crops', '/applications/agriculture'], [es ? 'Cartografía' : 'Mapping', '/applications/mapping'], [es ? 'Emergencias' : 'Emergency', '/applications/emergency']]],
    [es ? 'Servicios' : 'Services', [[es ? 'Software y robótica' : 'Software and robotics', '/software'], [es ? 'Formación' : 'Training', '/training'], [es ? 'Ingeniería' : 'Engineering', '/engineering']]],
    [es ? 'Compañía' : 'Company', [[es ? 'Sobre nosotros' : 'About us', '/company'], [es ? 'Contacto' : 'Contact', '/contact'], [es ? 'Privacidad' : 'Privacy', '/privacy']]],
  ]
  const address = t(s.address, locale).split('\n').slice(1).join(', ')
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__mission">
          <span className="wordmark">ALICRON</span>
          <p>{t(s.tagline, locale)}{address ? ` ${address}.` : ''}</p>
          <div className="footer__chips">
            <span className="chip">{es ? 'Trabajo civil' : 'Civil work'}</span>
            <span className="chip">{es ? 'I+D en Alicante' : 'R&D in Alicante'}</span>
            <span className="chip">ES · EN</span>
          </div>
        </div>
        {cols.map(([h, links]) => (
          <div key={h} className="fcol">
            <h4>{h}</h4>
            <ul>{links.map(([l, p]) => <li key={p}><Link href={href(p)}>{l}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="footer__legal">
        <span className="mono-xs" style={{textTransform: 'uppercase', color: 'var(--text-label)'}}>© {new Date().getFullYear()} {s.name ?? 'ALICRON'} · {t(s.footerNote, locale)}</span>
        <span className="mono-xs" style={{textTransform: 'uppercase', color: 'var(--text-label)'}}>{s.email}</span>
      </div>
    </footer>
  )
}

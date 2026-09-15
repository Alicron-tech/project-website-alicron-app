import Link from 'next/link'
import {t, paras, type Locale} from '@/lib/sanity'

export function Footer({locale, settings}: {locale: Locale; settings: Record<string, never> | null | undefined}) {
  const s = (settings ?? {}) as Record<string, never>
  const href = (p: string) => `/${locale}${p === '/' ? '' : p}`
  const es = locale === 'es'
  const cols = [
    {h: es ? 'Empresa' : 'Company', items: [[es ? 'Empresa' : 'Company', '/company'], [es ? 'Ingeniería' : 'Engineering', '/engineering'], [es ? 'Contacto' : 'Contact', '/contact']]},
    {h: es ? 'Qué hacemos' : 'What we do', items: [[es ? 'Plataformas' : 'Platforms', '/platforms'], [es ? 'Aplicaciones' : 'Applications', '/applications'], [es ? 'Software y robótica' : 'Software and robotics', '/software'], [es ? 'Formación' : 'Training', '/training']]},
  ]
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <div className="brand"><span className="brand__mark" /> ALICRON</div>
            <p style={{marginTop: 14, maxWidth: 320}}>{t(s.tagline, locale)}</p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4>{c.h}</h4>
              <ul>{c.items.map(([l, h]) => <li key={h}><Link href={href(h)}>{l}</Link></li>)}</ul>
            </div>
          ))}
          <div>
            <h4>{es ? 'Contacto' : 'Contact'}</h4>
            <ul>
              {s.email && <li><a href={`mailto:${s.email}`}>{s.email}</a></li>}
              {s.phone && <li>{s.phone}</li>}
              {paras(s.address, locale).map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {s.name ?? 'ALICRON'}. {t(s.footerNote, locale)}</span>
          <span><Link href={href('/privacy')}>{es ? 'Privacidad' : 'Privacy'}</Link></span>
        </div>
      </div>
    </footer>
  )
}

'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'
import type {Locale} from '@/lib/sanity'

type Nav = {label: string; href: string}[]

export function Header({locale, nav, cta}: {locale: Locale; nav: Nav; cta: string}) {
  const pathname = usePathname() || `/${locale}`
  const rest = pathname.replace(/^\/(en|es)/, '') || ''
  const [open, setOpen] = useState(false)
  const href = (p: string) => `/${locale}${p === '/' ? '' : p}`
  return (
    <header className="header">
      <div className="wrap header__in">
        <Link href={href('/')} className="brand" aria-label="ALICRON">
          <span className="brand__mark" /> ALICRON
        </Link>
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={href(n.href)} aria-current={rest === n.href || (n.href !== '/' && rest.startsWith(n.href)) ? 'page' : undefined} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header__right">
          <div className="lang" aria-label="Language">
            <Link href={`/en${rest}`} aria-current={locale === 'en'} hrefLang="en">EN</Link>
            <Link href={`/es${rest}`} aria-current={locale === 'es'} hrefLang="es">ES</Link>
          </div>
          <Link href={href('/contact')} className="btn btn--ink header__cta">{cta}</Link>
          <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? '✕' : 'Menu'}</button>
        </div>
      </div>
    </header>
  )
}

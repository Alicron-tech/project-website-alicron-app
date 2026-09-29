'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import type {Locale} from '@/lib/sanity'

type Nav = {label: string; href: string}[]

export function Header({locale, nav, cta}: {locale: Locale; nav: Nav; cta: string}) {
  const pathname = usePathname() || `/${locale}`
  const rest = pathname.replace(/^\/(en|es)/, '') || ''
  const [open, setOpen] = useState(false)
  const href = (p: string) => `/${locale}${p === '/' ? '' : p}`
  // On the home page the header floats over the hero film (transparent, white type) until the visitor scrolls past it.
  const isHome = rest === ''
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (!isHome) return
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55)
    onScroll(); window.addEventListener('scroll', onScroll, {passive: true}); return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])
  const overlay = isHome && !scrolled && !open
  return (
    <header className={`header ${isHome ? 'header--fixed' : ''} ${overlay ? 'header--overlay' : ''}`}>
      <div className="col header__in">
        <Link href={href('/')} className="wordmark" aria-label="ALICRON">ALICRON</Link>
        <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={href(n.href)} aria-current={rest === n.href || (n.href !== '/' && rest.startsWith(n.href)) ? 'page' : undefined} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header__right">
          <div className="lang" role="group" aria-label="Idioma / Language">
            <Link href={`/es${rest}`} aria-current={locale === 'es'} hrefLang="es">es</Link>
            <span className="sep" aria-hidden="true">/</span>
            <Link href={`/en${rest}`} aria-current={locale === 'en'} hrefLang="en">en</Link>
          </div>
          <Link href={href('/contact')} className="btn btn--compact header__cta">{cta}</Link>
          <button className="menu-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{open ? (locale === 'es' ? 'Cerrar' : 'Close') : (locale === 'es' ? 'Menú' : 'Menu')}</button>
        </div>
      </div>
    </header>
  )
}

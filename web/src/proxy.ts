import {NextResponse, type NextRequest} from 'next/server'
import {GATE_COOKIE, getPassword, tokenFor} from './lib/gate'
import {isLocale} from './lib/sanity'

const PUBLIC = ['/gate', '/api/gate', '/robots.txt', '/favicon.ico', '/icon.svg']

export async function proxy(req: NextRequest) {
  const {pathname, search} = req.nextUrl
  const noindex = (res: NextResponse) => {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    return res
  }
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '/'))) return noindex(NextResponse.next())

  const expected = await tokenFor(getPassword())
  if (process.env.GATE_DISABLED !== '1' && req.cookies.get(GATE_COOKIE)?.value !== expected) {
    const url = req.nextUrl.clone()
    url.pathname = '/gate'
    url.search = '?next=' + encodeURIComponent(pathname + search)
    return noindex(NextResponse.redirect(url))
  }
  const first = pathname.split('/')[1]
  if (!isLocale(first)) {
    const url = req.nextUrl.clone()
    const preferred = req.headers.get('accept-language')?.toLowerCase().startsWith('es') ? 'es' : 'en'
    url.pathname = `/${preferred}${pathname === '/' ? '' : pathname}`
    return noindex(NextResponse.redirect(url))
  }
  return noindex(NextResponse.next())
}

export const config = {matcher: ['/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)']}

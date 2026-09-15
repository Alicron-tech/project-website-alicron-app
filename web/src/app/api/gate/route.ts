import {NextResponse} from 'next/server'
import {GATE_COOKIE, getPassword, tokenFor} from '@/lib/gate'

export async function POST(req: Request) {
  const form = await req.formData()
  const password = String(form.get('password') ?? '')
  const next = String(form.get('next') ?? '/')
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  if (password !== getPassword()) {
    return NextResponse.redirect(new URL('/gate?error=1&next=' + encodeURIComponent(safeNext), req.url), 303)
  }
  const res = NextResponse.redirect(new URL(safeNext, req.url), 303)
  res.cookies.set(GATE_COOKIE, await tokenFor(password), {httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 30})
  return res
}

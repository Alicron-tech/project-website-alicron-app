import '@/app/globals.css'
import {fontClass} from '@/app/fonts'
export const metadata = {title: 'ALICRON', robots: {index: false, follow: false}}
export const viewport = {width: 'device-width', initialScale: 1}
export default function GateLayout({children}: {children: React.ReactNode}) {
  return <html lang="es" className={fontClass}><body style={{background: '#050506'}}>{children}</body></html>
}

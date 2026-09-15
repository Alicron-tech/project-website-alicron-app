import '@/app/globals.css'
import {inter, mono} from '@/app/fonts'
export const metadata = {title: 'ALICRON', robots: {index: false, follow: false}}
export const viewport = {width: 'device-width', initialScale: 1}
export default function GateLayout({children}: {children: React.ReactNode}) {
  return <html lang="en" className={`${inter.variable} ${mono.variable}`}><body>{children}</body></html>
}

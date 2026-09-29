import {Geist, Geist_Mono, Inter} from 'next/font/google'
export const geist = Geist({subsets: ['latin', 'latin-ext'], variable: '--font-geist', display: 'swap'})
export const geistMono = Geist_Mono({subsets: ['latin', 'latin-ext'], variable: '--font-geist-mono', display: 'swap'})
export const inter = Inter({subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap'})
export const fontClass = `${geist.variable} ${geistMono.variable} ${inter.variable}`

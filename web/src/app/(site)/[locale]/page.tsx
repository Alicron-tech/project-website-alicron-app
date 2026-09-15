import {notFound} from 'next/navigation'
import {getPage} from '@/lib/queries'
import type {Locale} from '@/lib/sanity'
import {PageHero} from '@/components/PageHero'
import {SectionView, type Section} from '@/components/Sections'

export const revalidate = 120

export default async function Home({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params
  const page = await getPage('home')
  if (!page) notFound()
  return (
    <>
      <PageHero page={page} locale={locale} full />
      {(page.sections as Section[] | undefined)?.map((s, i) => <SectionView key={i} s={s} locale={locale} index={i + 1} />)}
    </>
  )
}

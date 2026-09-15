import Image from 'next/image'
import {urlFor, t, type Locale} from '@/lib/sanity'

type MediaDoc = {image?: unknown; alt?: {en?: string; es?: string}; videoUrl?: string; isVideoPlaceholder?: boolean; caption?: {en?: string; es?: string}} | null | undefined

export function Media({media, locale, className = '', sizes = '100vw', priority = false, videoLabel}: {media: MediaDoc; locale: Locale; className?: string; sizes?: string; priority?: boolean; videoLabel?: string}) {
  if (!media?.image && !media?.videoUrl) return null
  const alt = t(media.alt, locale)
  const poster = media.image ? urlFor(media.image).width(2000).url() : undefined
  const isVideo = Boolean(media.videoUrl) || Boolean(media.isVideoPlaceholder)
  return (
    <figure>
      <div className={`media ${className}`}>
        {media.videoUrl ? (
          <video src={media.videoUrl} poster={poster} autoPlay muted loop playsInline aria-label={alt} />
        ) : (
          media.image ? <Image src={poster!} alt={alt} fill sizes={sizes} priority={priority} style={{objectFit: 'cover'}} /> : null
        )}
        {isVideo && !media.videoUrl && (
          <div className="play" aria-hidden="true">
            <span className="play__btn" />
            <span className="play__tag">{videoLabel ?? (locale === 'es' ? 'Vídeo' : 'Video')}</span>
          </div>
        )}
      </div>
      {t(media.caption, locale) && <figcaption className="caption">{t(media.caption, locale)}</figcaption>}
    </figure>
  )
}

export function Img({image, alt = '', className = 'card__img', sizes = '(max-width: 900px) 100vw, 33vw', width = 1200}: {image: unknown; alt?: string; className?: string; sizes?: string; width?: number}) {
  if (!image) return <div className={className} />
  return (
    <div className={className} style={{position: 'relative'}}>
      <Image src={urlFor(image).width(width).url()} alt={alt} fill sizes={sizes} style={{objectFit: 'cover'}} />
    </div>
  )
}

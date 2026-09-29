import Image from 'next/image'
import {urlFor, t, localVideo, type Locale} from '@/lib/sanity'
import {InViewVideo} from './InViewVideo'

type MediaDoc = {image?: unknown; alt?: {en?: string; es?: string}; videoUrl?: string; isVideoPlaceholder?: boolean; caption?: {en?: string; es?: string}} | null | undefined

/** MediaFrame: photo on a black ground, optional 10px radius, mono uppercase caption. Renders a looping video when videoUrl is set,
 *  or a poster with a play mark when the media is flagged as a video placeholder. */
export function Media({media, locale, radius = 'md', ratio = '169', sizes = '100vw', priority = false, videoLabel, caption}: {media: MediaDoc; locale: Locale; radius?: 'none' | 'md'; ratio?: '169' | '43'; sizes?: string; priority?: boolean; videoLabel?: string; caption?: string}) {
  if (!media?.image && !media?.videoUrl) return null
  const alt = t(media.alt, locale)
  const local = localVideo(media.videoUrl)
  const videoUrl = local?.src ?? media.videoUrl
  const poster = local?.poster ?? (media.image ? urlFor(media.image).width(2000).url() : undefined)
  const isVideo = Boolean(videoUrl) || Boolean(media.isVideoPlaceholder)
  const cap = caption ?? (local?.caption ? t(local.caption, locale) : t(media.caption, locale))
  return (
    <figure className="frame">
      <div className={`frame__box ${radius === 'md' ? 'frame__box--md' : ''} ${ratio === '43' ? 'frame__box--43' : ''}`}>
        {videoUrl ? (
          <InViewVideo src={videoUrl} poster={poster} label={alt} />
        ) : media.image ? (
          <Image src={poster!} alt={alt} fill sizes={sizes} priority={priority} style={{objectFit: 'cover'}} />
        ) : null}
        {isVideo && !videoUrl && (
          <div className="play" aria-hidden="true">
            <span className="play__btn" />
            <span className="play__tag">{videoLabel ?? (locale === 'es' ? 'Vídeo · en producción' : 'Video · in production')}</span>
          </div>
        )}
      </div>
      {cap && <figcaption className="frame__cap">{cap}</figcaption>}
    </figure>
  )
}

export function Img({image, alt = '', className = 'case__img', sizes = '(max-width: 900px) 100vw, 33vw', width = 1200, priority = false}: {image: unknown; alt?: string; className?: string; sizes?: string; width?: number; priority?: boolean}) {
  if (!image) return <div className={className} />
  return (
    <div className={className} style={{position: 'relative'}}>
      <Image src={urlFor(image).width(width).url()} alt={alt} fill sizes={sizes} priority={priority} style={{objectFit: 'cover'}} />
    </div>
  )
}

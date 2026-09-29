'use client'
import {useEffect, useRef} from 'react'

/** A muted, looping film that starts when it scrolls into view and pauses when it leaves, so pages with several clips
 *  do not play them all at once. Falls back to the poster when the browser blocks autoplay or the user prefers reduced motion. */
export function InViewVideo({src, poster, label, className}: {src: string; poster?: string; label?: string; className?: string}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      })
    }, {threshold: 0.35})
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
}

'use client'
import {useEffect, useRef, useState} from 'react'

const DIMS = [0, 1, 2, 3, 4] as const
const RATES = [1, 0.85, 0.7] as const

/** The full-bleed film behind the home hero, with a dark dim so the white copy stays readable.
 *  `data-dim` picks the dim level (0 = scrim only … 4 = strongest); `?dim=` and `?rate=` override it for tuning,
 *  and `?tune` shows a small panel to switch both live. */
export function HeroFilm({src, poster, dim = 0}: {src: string; poster?: string; dim?: number}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [level, setLevel] = useState(dim)
  const [rate, setRate] = useState(1)
  const [tune, setTune] = useState(false)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.has('dim')) setLevel(Number(q.get('dim')))
    if (q.has('rate')) setRate(Number(q.get('rate')))
    setTune(q.has('tune'))
  }, [])
  useEffect(() => { if (ref.current) ref.current.playbackRate = rate }, [rate])
  return (
    <div className="vhero__film" data-dim={level}>
      <video ref={ref} className="vhero__video" src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"
        onLoadedMetadata={(e) => { e.currentTarget.playbackRate = rate }} />
      <div className="vhero__scrim" />
      <div className="vhero__shade" />
      {tune && (
        <div className="vhero__tune mono-sm">
          <span>dim</span>{DIMS.map((d) => <button key={d} aria-pressed={level === d} onClick={() => setLevel(d)}>{d}</button>)}
          <span>speed</span>{RATES.map((r) => <button key={r} aria-pressed={rate === r} onClick={() => setRate(r)}>{r}×</button>)}
        </div>
      )}
    </div>
  )
}

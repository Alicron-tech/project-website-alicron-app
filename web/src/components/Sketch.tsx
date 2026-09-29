import Image from 'next/image'

/** Faint wireframe mesh of one of our own aircraft (studio photo redrawn by fal.ai Kontext, mesh lines extracted), top right of a light page's first screen,
 *  oversized so only part of it shows. Scrolls with the page.
 *  Variants live in public/sketches; remove a number from SKETCHES to retire it. The variant is picked from the page key,
 *  so a given page always shows the same drawing. */
export const SKETCHES = [7, 8]   // 7 = the fixed-wing mesh Alec chose on 2026-09-17, 8 = the twin-motor wing from his photo; 1..6 are the multirotor meshes, kept as options
const SIZES: Record<number, [number, number]> = {1: [1227, 581], 2: [1019, 643], 3: [942, 802], 4: [1173, 595], 5: [1094, 427], 6: [1040, 527], 7: [1411, 596], 8: [1300, 684]}

// Fixed assignment for the main pages so every variant is on show; anything else falls back to a hash of its key.
const ASSIGNED: Record<string, number> = {Platforms: 1, Applications: 2, 'Software and robotics': 3, Training: 4, Engineering: 5, Company: 6, Contact: 1, Privacy: 2}

export function Sketch({seed}: {seed: string}) {
  if (!SKETCHES.length) return null
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const wanted = ASSIGNED[seed]
  const n = wanted && SKETCHES.includes(wanted) ? wanted : SKETCHES[h % SKETCHES.length]   // with two options this alternates by page key
  const [w, hh] = SIZES[n] ?? [1456, 800]
  return (
    <div className="sketch" aria-hidden="true">
      <Image src={`/sketches/mesh-${n}.png`} alt="" width={w} height={hh} priority={false} />
    </div>
  )
}

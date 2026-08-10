/**
 * Pulls sample photographs into public/images/samples/ from Wikimedia
 * Commons.
 *
 * These are placeholders so the design can be judged against real
 * photography instead of grey rectangles. They are NOT Matt's work — the
 * site marks every one as a sample, and the marker disappears the moment a
 * real photo replaces it.
 *
 * Commons images carry a licence each. Every one used is recorded in
 * CREDITS.json with its licence and source page, because most are CC BY-SA
 * and that requires attribution. Openverse was tried first but its CC0
 * filter returned almost nothing usable for building work.
 *
 *   node scripts/fetch-samples.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = new URL('../public/images/samples/', import.meta.url).pathname
const API = 'https://commons.wikimedia.org/w/api.php'
const UA = 'SweetfixSiteBuild/1.0 (https://sweetfix.nz)'

const wanted = [
  { slug: 'framing', q: 'timber frame house under construction' },
  { slug: 'deck', q: 'timber decking wooden deck house' },
  { slug: 'tools', q: 'carpenter hand tools workbench' },
  { slug: 'painting', q: 'painting interior wall paint roller' },
  { slug: 'stage', q: 'festival outdoor stage structure' },
  { slug: 'renovation', q: 'house interior renovation building' },
  { slug: 'workshop', q: 'woodworking workshop bench timber' },
  { slug: 'roof', q: 'roof truss timber construction' },
]

/** Licences we will actually ship, best first. GFDL and NC are excluded. */
const OK = [/public domain/i, /^CC0/i, /^CC BY 4/i, /^CC BY 3/i, /^CC BY 2/i, /^CC BY-SA/i]
const rank = (lic) => {
  const i = OK.findIndex((re) => re.test(lic))
  return i === -1 ? 99 : i
}

async function search(q) {
  const url =
    `${API}?action=query&format=json&origin=*` +
    `&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}` +
    `&gsrnamespace=6&gsrlimit=12&prop=imageinfo` +
    `&iiprop=url|size|extmetadata&iiurlwidth=1800`

  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`search: ${res.status}`)
  const data = await res.json()
  const pages = Object.values(data?.query?.pages ?? {})

  return pages
    .map((p) => {
      const ii = p.imageinfo?.[0] ?? {}
      const meta = ii.extmetadata ?? {}
      const strip = (v) => (v?.value ?? '').replace(/<[^>]*>/g, '').trim()
      return {
        title: p.title.replace(/^File:/, ''),
        thumb: ii.thumburl,
        width: ii.width ?? 0,
        height: ii.height ?? 0,
        license: strip(meta.LicenseShortName) || 'unknown',
        artist: strip(meta.Artist) || null,
        page: ii.descriptionurl,
      }
    })
    // Landscape and large enough that a 4:3 crop still looks sharp.
    .filter((r) => r.thumb && r.width >= 1600 && r.width > r.height)
    .filter((r) => rank(r.license) < 99)
    .sort((a, b) => rank(a.license) - rank(b.license) || b.width - a.width)
}

await mkdir(OUT, { recursive: true })
const manifest = []

for (const { slug, q } of wanted) {
  try {
    const hits = await search(q)
    let saved = false
    for (const hit of hits.slice(0, 5)) {
      const img = await fetch(hit.thumb, { headers: { 'User-Agent': UA } })
      if (!img.ok) continue
      const buf = Buffer.from(await img.arrayBuffer())
      if (buf.length < 60_000) continue
      await writeFile(join(OUT, `${slug}.jpg`), buf)
      manifest.push({ slug, ...hit, thumb: undefined })
      console.log(`${slug.padEnd(11)} ${(buf.length / 1024).toFixed(0)}kB  ${hit.license.padEnd(12)} ${hit.title.slice(0, 52)}`)
      saved = true
      break
    }
    if (!saved) console.log(`${slug.padEnd(11)} no usable result`)
  } catch (err) {
    console.log(`${slug.padEnd(11)} FAILED: ${err.message}`)
  }
}

await writeFile(join(OUT, 'CREDITS.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${manifest.length}/${wanted.length} saved`)

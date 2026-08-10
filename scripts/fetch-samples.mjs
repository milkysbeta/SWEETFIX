/**
 * Pulls sample photographs into public/images/samples/ from Wikimedia
 * Commons.
 *
 * These are placeholders so the design can be judged against real
 * photography instead of grey rectangles. They are NOT Matt's work — the
 * site marks every one as a sample, and the marker goes the moment a real
 * photo replaces it.
 *
 * Reads Commons *categories* rather than running a text search. Search
 * relevance on Commons is poor for this subject — it returned a Victorian
 * engraving for "timber framing" and a covered bridge for "decking".
 * Categories are curated by hand, so precision is far higher.
 *
 * Every image's licence, author and source page goes into CREDITS.json.
 * Most are CC BY / CC BY-SA, which require attribution.
 *
 *   node scripts/fetch-samples.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const OUT = new URL('../public/images/samples/', import.meta.url).pathname
const API = 'https://commons.wikimedia.org/w/api.php'
const UA = 'SweetfixSiteBuild/1.0 (https://sweetfix.nz)'

/** Several categories per slot — the first usable hit wins. */
const wanted = [
  { slug: 'framing', cats: ['Timber framing', 'Timber frame houses'] },
  { slug: 'construction', cats: ['House construction', 'Residential construction'] },
  { slug: 'tools', cats: ['Carpentry tools', 'Woodworking hand tools'] },
  { slug: 'stage', cats: ['Concert stages', 'Festival stages'] },
  { slug: 'deck', cats: ['Wooden decks', 'Terraces (architecture)', 'Wooden balconies'] },
  { slug: 'workshop', cats: ['Carpentry', 'Joinery', 'Woodworking'] },
  { slug: 'timber', cats: ['Wooden boards', 'Planks', 'Sawn timber'] },
]

// GFDL is awkward to comply with on a website, and NC forbids commercial use.
const BAD = /GFDL|NonCommercial|-NC|Fair use/i

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', ...params })}`
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json()
}

async function fromCategory(cat) {
  const data = await api({
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: `Category:${cat}`,
    gcmtype: 'file',
    gcmlimit: '40',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1800',
  })

  const strip = (v) => (v?.value ?? '').replace(/<[^>]*>/g, '').trim()

  return Object.values(data?.query?.pages ?? {})
    .map((p) => {
      const ii = p.imageinfo?.[0] ?? {}
      const meta = ii.extmetadata ?? {}
      return {
        title: p.title.replace(/^File:/, ''),
        thumb: ii.thumburl,
        width: ii.width ?? 0,
        height: ii.height ?? 0,
        license: strip(meta.LicenseShortName) || 'unknown',
        artist: strip(meta.Artist) || null,
        page: ii.descriptionurl,
        category: cat,
      }
    })
    // Landscape, and large enough that a 4:3 crop stays sharp.
    .filter((r) => r.thumb && r.width >= 1800 && r.width > r.height * 1.15)
    .filter((r) => !BAD.test(r.license))
}

await mkdir(OUT, { recursive: true })
const manifest = []

for (const { slug, cats } of wanted) {
  let saved = false
  for (const cat of cats) {
    if (saved) break
    let hits = []
    try {
      hits = await fromCategory(cat)
    } catch (err) {
      console.log(`${slug.padEnd(13)} ${cat}: ${err.message}`)
      continue
    }
    for (const hit of hits.slice(0, 6)) {
      try {
        const img = await fetch(hit.thumb, { headers: { 'User-Agent': UA } })
        if (!img.ok) continue
        const buf = Buffer.from(await img.arrayBuffer())
        if (buf.length < 80_000) continue
        await writeFile(join(OUT, `${slug}.jpg`), buf)
        manifest.push({ ...hit, slug, thumb: undefined })
        console.log(
          `${slug.padEnd(13)} ${(buf.length / 1024).toFixed(0).padStart(4)}kB  ${hit.license.padEnd(14)} ${hit.title.slice(0, 46)}`,
        )
        saved = true
        break
      } catch {
        /* next candidate */
      }
    }
  }
  if (!saved) console.log(`${slug.padEnd(13)} nothing usable`)
}

await writeFile(join(OUT, 'CREDITS.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${manifest.length}/${wanted.length} saved`)

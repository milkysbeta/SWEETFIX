/**
 * Pulls sample photographs from Unsplash into public/images/samples/.
 *
 * Placeholders so the design can be judged against real photography. They
 * are NOT Matt's work — the site marks every one as a sample and the marker
 * goes the moment a real photo replaces it.
 *
 * The access key is read from the environment and never written to a file.
 * Anything committed here is public, and a key in a public repo is a key
 * somebody else is using within the day.
 *
 *   UNSPLASH_KEY=xxxx node scripts/fetch-unsplash.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const KEY = process.env.UNSPLASH_KEY
if (!KEY) {
  console.error('Set UNSPLASH_KEY first:  UNSPLASH_KEY=xxxx node scripts/fetch-unsplash.mjs')
  process.exit(1)
}

const OUT = new URL('../public/images/samples/', import.meta.url).pathname
const auth = { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' }

/**
 * Orientation matters more than it looks: a portrait shot in a 4:3 frame
 * crops to somebody's midriff. Everything here is landscape except the
 * cut-outs, which want height.
 */
const wanted = [
  { slug: 'construction', q: 'timber frame house construction site' },
  { slug: 'framing', q: 'wooden roof trusses framing' },
  { slug: 'deck', q: 'timber deck outdoor build' },
  { slug: 'tools', q: 'carpenter tools workbench dark' },
  { slug: 'workshop', q: 'woodworking workshop craftsman' },
  { slug: 'painting', q: 'painting interior wall renovation' },
  { slug: 'stage', q: 'festival stage lights night' },
  { slug: 'renovation', q: 'home renovation interior building' },
  { slug: 'sawdust', q: 'wood shavings sawdust macro' },
  { slug: 'timber', q: 'dark walnut wood grain texture' },
]

async function search(q, orientation = 'landscape') {
  const url =
    `https://api.unsplash.com/search/photos?` +
    new URLSearchParams({ query: q, orientation, per_page: '10', content_filter: 'high' })
  const res = await fetch(url, { headers: auth })
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 90)}`)
  const { results = [] } = await res.json()
  return results
}

await mkdir(OUT, { recursive: true })
const manifest = []

for (const { slug, q } of wanted) {
  try {
    const hits = await search(q)
    let saved = false
    for (const hit of hits.slice(0, 3)) {
      // 1800px wide is plenty for a full-bleed frame and keeps the repo sane.
      const url = `${hit.urls.raw}&w=1800&q=80&fm=jpg&fit=max`
      const img = await fetch(url)
      if (!img.ok) continue
      const buf = Buffer.from(await img.arrayBuffer())
      if (buf.length < 60_000) continue

      await writeFile(join(OUT, `${slug}.jpg`), buf)
      manifest.push({
        slug,
        description: hit.description ?? hit.alt_description ?? null,
        photographer: hit.user?.name ?? null,
        profile: hit.user?.links?.html ?? null,
        page: hit.links?.html ?? null,
        license: 'Unsplash License',
      })
      console.log(
        `${slug.padEnd(13)} ${(buf.length / 1024).toFixed(0).padStart(4)}kB  ` +
          `${(hit.user?.name ?? '—').padEnd(20)} ${(hit.alt_description ?? '').slice(0, 44)}`,
      )

      // Unsplash asks API consumers to register a download when a photo is
      // actually used. It is a courtesy that keeps the free tier viable.
      if (hit.links?.download_location) {
        fetch(hit.links.download_location, { headers: auth }).catch(() => {})
      }
      saved = true
      break
    }
    if (!saved) console.log(`${slug.padEnd(13)} nothing usable`)
  } catch (err) {
    console.log(`${slug.padEnd(13)} FAILED: ${err.message}`)
  }
}

await writeFile(join(OUT, 'CREDITS.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${manifest.length}/${wanted.length} saved`)

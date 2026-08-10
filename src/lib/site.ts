/**
 * Single source of truth for everything the site says about Matt.
 *
 * Anything marked TODO is deliberately unset — it renders as nothing rather
 * than as an invented placeholder, so the live site never claims something
 * that isn't true yet.
 */

export const site = {
  name: 'Sweetfix',
  owner: 'Matt Sweetman',
  domain: 'sweetfix.nz',

  tagline: 'Fix it. Build it. Sorted.',
  subline: 'Quiet, tidy, and very good at this.',

  phone: '+64220945745',
  phoneDisplay: '022 094 5745',
  email: 'info@sweetfix.nz',
  // Until sweetfix.nz email forwarding is live, enquiries land here.
  emailFallback: 'mattsweetman00@gmail.com',
  instagram: 'sweetfix.nz',
  instagramUrl: 'https://instagram.com/sweetfix.nz',

  base: 'Queenstown & Wanaka',
  reach: 'New Zealand and worldwide',

  yearsExperience: 15,
  minimumHours: 2,

  // TODO(matt): drop the NZBN in when you find it — it renders in the footer
  // automatically once set, and stays hidden while empty.
  nzbn: '',

  credentials: [
    { label: 'Site Safe', note: 'Construction site safety certified' },
    { label: 'First Aid', note: 'Current certification' },
    { label: '15 Years', note: 'Building and renovation experience' },
  ],

  /**
   * Web3Forms access key. Free, unlimited, no backend required — the form
   * POSTs straight to their API and the answers arrive as an email.
   *
   * Get one in 30 seconds at https://web3forms.com (enter the destination
   * email, they mail you the key), then paste it here.
   * While this is empty, every form falls back to a mailto: link so nothing
   * silently swallows an enquiry.
   */
  formAccessKey: '',

  /** Design credit in the footer. */
  designer: {
    name: 'Milky',
    // Drop the vector export here as a PNG or SVG:
    //   public/images/brand/milky.png
    // If the file is missing the credit falls back to plain text, so the
    // footer never shows a broken image.
    logo: '/images/brand/milky.png',
    /** Points at the digital-design side of Matt's work once it exists. */
    url: '',
    credit: 'Web design by',
  },
} as const

/**
 * The treasure-hunt chest — a past project, shown here as proof of work.
 *
 * A locked chest with a hologram countdown, cracked by clues hidden around
 * the festival. This is a playable recreation of it: the point isn't the
 * prize, it's showing that Matt designs and builds interactive objects, not
 * just structures.
 *
 * TODO(matt): the code is readable in the page source, so keep it a demo
 * code rather than anything with a real prize attached.
 */
export const treasure = {
  /**
   * Countdown target. The demo keeps a rolling deadline so the timer is
   * always live — set a fixed ISO timestamp to pin it, or '' to hide it.
   */
  unlockAt: 'rolling',
  /** Case- and space-insensitive. */
  code: 'SHIPWRECK',
  hint: 'Demo code: the name of the festival.',
  reward:
    'Cracked it. At the festival this opened for real — passes, jewellery, and collectible Shipwrecked coins inside.',
} as const

export type Service = {
  id: string
  title: string
  blurb: string
  items: string[]
}

export const services: Service[] = [
  {
    id: 'fix-it',
    title: 'Fix-It Jobs',
    blurb:
      'The list on the fridge. Doors that stick, taps that drip, shelves that were never going to hold. One visit, sorted properly.',
    items: ['Small repairs', 'Doors & windows', 'Hanging & mounting', 'Flat-pack & furniture', 'Odd jobs'],
  },
  {
    id: 'building',
    title: 'Building & Renovation',
    blurb:
      'Fifteen years across new builds and renovations. Comfortable running a job start to finish, or slotting into someone else’s.',
    items: ['Renovations', 'New build carpentry', 'Framing & fit-out', 'Alterations', 'Project work'],
  },
  {
    id: 'outdoor',
    title: 'Decks & Outdoor',
    blurb:
      'Decks, screens, gates, fences. Built for Central Otago weather, and levelled like it matters — because it does.',
    items: ['Decks', 'Fences & gates', 'Screens & pergolas', 'Outdoor repairs'],
  },
  {
    id: 'painting',
    title: 'Painting & Patch Repairs',
    blurb:
      'Patch, sand, prime, finish. The unglamorous part that decides whether the whole room reads as finished or not.',
    items: ['Interior painting', 'Patch repairs', 'Prep & finishing', 'Touch-ups'],
  },
  {
    id: 'sets',
    title: 'Sets, Stages & Props',
    blurb:
      'Festival stages, film props, installations. Built fast, built strange, built to look extraordinary under lights.',
    items: ['Festival stages', 'Film & TV props', 'Set building', 'Installations', 'Scenic carpentry'],
  },
  {
    id: 'tech',
    title: 'WiFi, Smart Home & Tech',
    blurb:
      'Dead spots, mesh setups, cameras, automation. The bit where the builder who understands networking saves you two callouts.',
    items: ['WiFi & mesh setup', 'Troubleshooting', 'Smart home automation', 'Cameras & sensors', 'TV & AV mounting'],
  },
  {
    id: 'fabrication',
    title: 'Design & 3D Printing',
    blurb:
      'When the part you need doesn’t exist, it gets designed and printed. Brackets, mounts, replacements, one-offs.',
    items: ['Custom parts', '3D printing', 'Replacement fittings', 'Prototyping', 'Design work'],
  },
]

export type WorkItem = {
  id: string
  title: string
  location: string
  year?: string
  blurb: string
  /** Files live in public/images/work/<id>/ — see that folder's README. */
  images: string[]
  tag: 'Build' | 'Renovation' | 'Stage' | 'Props' | 'Outdoor'
}

/**
 * TODO(matt): replace the `images: []` arrays as photos land in
 * public/images/work/<id>/. Any project with no images renders as a
 * text-only card rather than a broken frame.
 *
 * NOTE: the private-residence entry is deliberately unnamed. Do not put a
 * client's name on the public site without their written permission.
 */
export const work: WorkItem[] = [
  {
    id: 'private-residence-queenstown',
    title: 'Private Residence',
    location: 'Queenstown',
    blurb:
      'Full renovation of a private home for a well-known New Zealand sportsperson. High-spec finish, discreet delivery.',
    images: [],
    tag: 'Renovation',
  },
  {
    id: 'fusion-palapa-stage',
    title: 'Fusion Festival — Palapa Stage',
    location: 'Germany',
    blurb:
      'Large-scale stage build for one of Europe’s most visually ambitious festivals. Structural carpentry meeting scenic design.',
    images: [],
    tag: 'Stage',
  },
  {
    id: 'shipwrecked-festival',
    title: 'Shipwrecked Festival',
    location: 'New Zealand',
    blurb:
      'Multiple years of stage and set construction. Fast builds, big structures, no second chances on opening night.',
    images: [],
    tag: 'Stage',
  },
  {
    id: 'film-props',
    title: 'Film & High-Tech Props',
    location: 'Various',
    blurb:
      'Precision prop and set fabrication for screen work, where the camera sees every millimetre.',
    images: [],
    tag: 'Props',
  },
  {
    id: 'decks-southern-lakes',
    title: 'Decks & Outdoor',
    location: 'Southern Lakes',
    blurb: 'Decking, screens and outdoor structures built for alpine weather.',
    images: [],
    tag: 'Outdoor',
  },
  {
    id: 'new-build-carpentry',
    title: 'New Build Carpentry',
    location: 'New Zealand',
    blurb: 'Framing, fit-out and finishing across residential new builds.',
    images: [],
    tag: 'Build',
  },
]

/**
 * TODO(matt): fills from the client questionnaire at /reviews.
 * Empty array = the testimonials section hides itself entirely. Never
 * ship an invented review.
 */
export const testimonials: {
  quote: string
  name: string
  location?: string
  job?: string
}[] = []

export const jobTypes = [
  'Small repairs / fix-it list',
  'Building or renovation',
  'Deck or outdoor',
  'Painting or patch repairs',
  'Stage, set or props',
  'WiFi, smart home or tech',
  'Design or 3D printed parts',
  'Something else',
]

export const timeframes = ['As soon as possible', 'Within a few weeks', 'In a month or two', 'Just planning ahead']

export function whatsappLink(message: string) {
  return `https://wa.me/${site.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

export const waHello = whatsappLink(
  `Hi Matt, I found you on ${site.domain} — I've got a job I'd like to talk about.`,
)

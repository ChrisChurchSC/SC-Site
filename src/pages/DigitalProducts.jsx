import { useEffect, useCallback } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useSanity } from '../hooks/useSanity'
import { useMeta } from '../hooks/useMeta'
import { CAPABILITIES_QUERY } from '../lib/queries'
import LazyVideo from '../components/LazyVideo'
import styles from './Capabilities.module.css'

const VARIANTS = {
  4: [
    { shape: 'hero' }, { shape: 'hero' },
    { shape: 'hero' }, { shape: 'hero' },
  ],
  7: [
    { shape: 'hero' }, { shape: 'small' }, { shape: 'small' },
    { shape: 'small' }, { shape: 'small' },
    { shape: 'hero' }, { shape: 'hero' },
  ],
  10: [
    { shape: 'column' }, { shape: 'small' }, { shape: 'small' }, { shape: 'small' },
    { shape: 'hero' }, { shape: 'tall' },
    { shape: 'small' }, { shape: 'small' }, { shape: 'small' }, { shape: 'small' },
  ],
  14: [
    { shape: 'small' }, { shape: 'small' }, { shape: 'small' }, { shape: 'small' },
    { shape: 'tall' }, { shape: 'small' }, { shape: 'small' }, { shape: 'tall' },
    { shape: 'small' }, { shape: 'small' },
    { shape: 'small' }, { shape: 'small' }, { shape: 'small' }, { shape: 'small' },
  ],
}

function pickVariant(uniqueCount) {
  const counts = Object.keys(VARIANTS).map(Number).sort((a, b) => b - a)
  return counts.find(c => c <= uniqueCount) ?? null
}

const MIN_UNIQUE_TILES = 4

function flattenTiles(sections) {
  if (!Array.isArray(sections)) return []
  const flat = []
  for (const sec of sections) {
    if (!sec) continue
    if (sec.src) flat.push({ src: sec.src, isVideo: sec.isVideo })
    if (Array.isArray(sec.grid)) {
      for (const item of sec.grid) {
        if (item?.src) flat.push({ src: item.src, isVideo: item.isVideo })
      }
    }
  }
  return flat
}

const DIGITAL_SLUGS = new Set([
  'photon', 'print-parlor', 'yura',
])

const DIGITAL_INTRO_SLIDES = [
  { id: 'cover', layout: 'cover' },
  {
    id: 'what-it-is', layout: 'who-we-are',
    pill: 'What it is',
    headline: 'Designed and shipped. One engagement, no handoff.',
    paragraphs: [
      "Digital Products is where brand promise meets user reality. We design and build websites, product interfaces, interactive experiences, design systems, and operational infrastructure: CRM, email platforms, and GTM stacks.",
      "One team holds the design and the build. No handoff to another agency. No lost context. No revision multiplied across vendors. What you approved is what ships.",
    ],
    videoUrl: 'https://cdn.sanity.io/files/ppq16wpu/production/341eb794a01297458ce27c4d65b7ede0b37ca16a.mp4',
  },
  {
    id: 'outcomes', layout: 'outcomes',
    pill: 'Why it matters',
    cards: [
      {
        tag: 'Conversion',
        title: 'Turn traffic into pipeline.',
        body: "A well-designed site with clear messaging and deliberate conversion architecture moves visitors toward a decision. The site stops being a presence and starts being a sales tool.",
      },
      {
        tag: 'Speed',
        title: 'Launch faster.',
        body: "Design and build in one engagement eliminates the handoff gap, the biggest source of delay, scope creep, and rework in most web projects. Weeks, not months.",
      },
      {
        tag: 'Discovery',
        title: 'Build what users actually need.',
        body: "Discovery-led design surfaces what users need before a line of code is written, reducing the risk of building the wrong thing at the cost of the right one.",
      },
      {
        tag: 'Data',
        title: 'Own a stack that gives you data.',
        body: "When CRM, email platform, and GTM infrastructure are wired together correctly, you can see the full pipeline from first touch to closed deal in one place.",
      },
      {
        tag: 'Scale',
        title: 'Build once, iterate forever.',
        body: "A design system turns your website and product into a platform you can extend, not a bespoke build you have to break every time you need to change something.",
      },
      {
        tag: 'Differentiation',
        title: 'Compete on experience.',
        body: "Interactive and 3D experiences are rare enough that a well-executed one is genuinely memorable, and measurably increases dwell time, shareability, and brand lift.",
      },
      {
        tag: 'Sales',
        title: 'Stop losing deals to your website.',
        body: "A poor digital presence is costing you deals you don't even know about. Prospects check your site after every conversation. Make sure what they find helps, not hurts.",
      },
      {
        tag: 'Simplicity',
        title: 'Reduce agency sprawl.',
        body: "One partner holds design and build. No translation between teams, no version control across agencies, no one pointing fingers when something breaks.",
      },
    ],
  },
  {
    id: 'outcome-conversion', layout: 'outcome-detail',
    pill: 'Conversion',
    headline: 'Turn traffic into pipeline.',
    when: "When your website is generating traffic but not leads. When prospects land on your site after a good intro call and leave less convinced than when they arrived.",
    before: "Decent traffic, poor conversion. Visitors land, browse, and leave. The site is technically present but not doing any work.",
    after: "A site designed to convert: clear hierarchy, intentional calls to action, messaging that matches what you say in the room. Marketing has a digital surface it can be proud to send people to.",
    stats: [
      { metric: 'Conversion rate', result: '20–100% lift over unoptimised baseline (CXL Institute)' },
      { metric: 'Inbound leads per month', result: '+25–50%' },
      { metric: 'Bounce rate', result: '20–40% reduction' },
    ],
  },
  {
    id: 'outcome-speed', layout: 'outcome-detail',
    pill: 'Speed',
    headline: 'Launch faster.',
    when: "When you need to ship quickly — a fundraise, a product launch, a market entry — and can't afford months of back-and-forth between separate design and development teams.",
    before: "A design agency hands off to a dev agency. Context is lost. Revisions multiply. The timeline doubles. By the time it launches, the brief has changed.",
    after: "One team holds the design and the build. Decisions happen fast. What you approved is what ships. Weeks, not months.",
    stats: [
      { metric: 'Time-to-launch', result: '30–50% faster vs. separate design and dev agencies' },
      { metric: 'Revision cycles', result: '40–60% fewer' },
      { metric: 'Cost overrun rate', result: '30–50% lower' },
    ],
  },
  {
    id: 'outcome-discovery', layout: 'outcome-detail',
    pill: 'Discovery',
    headline: 'Build what users actually need.',
    when: "When you have a product idea but limited certainty about which features matter most, or when a previous product failed to get traction and you need to understand why.",
    before: "Features built on assumptions. A product that launches to silence. Expensive rework once real users encounter it.",
    after: "User flows mapped, key interactions tested as prototypes, and the highest-value feature set identified before full build begins. Less waste. Better product.",
    stats: [
      { metric: 'Feature adoption rate', result: '+25–40%' },
      { metric: 'Time-to-first-value', result: '30–50% faster' },
      { metric: 'Post-launch rework cost', result: '40–60% lower (Nielsen Norman)' },
    ],
  },
  {
    id: 'outcome-data', layout: 'outcome-detail',
    pill: 'Data',
    headline: 'Own a stack that gives you data.',
    when: "When you're scaling a sales or marketing function and need to know which channels, campaigns, and content are actually driving revenue.",
    before: "Disconnected tools. Marketing can't see what sales is doing. No one knows which campaign sourced which deal. Reporting is a manual exercise.",
    after: "A connected stack. Every lead tracked. Attribution visible. Marketing and sales working from the same data. Decisions made on evidence, not instinct.",
    stats: [
      { metric: 'Pipeline visibility', result: '2–3x improvement in tracked deals' },
      { metric: 'Marketing attribution accuracy', result: '+40–60%' },
      { metric: 'Manual reporting time', result: '50–70% reduction' },
    ],
  },
  {
    id: 'outcome-scale', layout: 'outcome-detail',
    pill: 'Scale',
    headline: 'Build once, iterate forever.',
    when: "When you're planning to grow the site or product over time, when you have an internal team that will manage it, or when pace of iteration matters.",
    before: "Every update requires a designer. Every new page is built from scratch. The site drifts from the brand over time. Changes take weeks.",
    after: "A component library and token system your team can use. New pages built in hours, not days. Brand consistency maintained without agency involvement for every update.",
    stats: [
      { metric: 'Time per site update', result: '50–70% faster' },
      { metric: 'Cost per new page or feature', result: '40–60% lower' },
      { metric: 'Design system adoption', result: 'Near 100% with documented components' },
    ],
  },
  {
    id: 'outcome-experience', layout: 'outcome-detail',
    pill: 'Differentiation',
    headline: 'Compete on experience.',
    when: "When you're in a crowded market where differentiation has to come from how you show up, not just what you're selling.",
    before: "A flat site that looks like every competitor's flat site. Nothing to share. Nothing to remember. The brand is present but not felt.",
    after: "An experience that people show each other. A flagship digital moment that signals your category of ambition. Traffic that comes back.",
    stats: [
      { metric: 'Average session duration', result: '+30–60%' },
      { metric: 'Bounce rate', result: '20–35% reduction' },
      { metric: 'Social shares and referral traffic', result: '+50–100% for flagship interactive builds' },
    ],
  },
  {
    id: 'outcome-deals', layout: 'outcome-detail',
    pill: 'Sales',
    headline: 'Stop losing deals to your website.',
    when: "When you're in active sales conversations and suspects are checking you out online. When a good pitch is being followed by a website that undermines it.",
    before: "A prospect has a great call with your team, goes to the site, and their confidence drops. They don't say anything. The deal just goes quiet.",
    after: "A site that reinforces every good impression from the call. Prospects leave more confident, not less. The website becomes a sales asset, not a liability.",
    stats: [
      { metric: 'Post-demo to proposal conversion', result: '+15–25%' },
      { metric: 'Sales-assisted close rate', result: '+10–20%' },
      { metric: 'Prospect engagement after calls', result: 'Measurably higher with a credible digital presence' },
    ],
  },
  {
    id: 'outcome-sprawl', layout: 'outcome-detail',
    pill: 'Simplicity',
    headline: 'Reduce agency sprawl.',
    when: "When you're managing two or more agencies for a single digital project and spending time project-managing the relationship between them instead of getting results.",
    before: "Design agency, dev agency, and sometimes a third for CMS. Three invoices. Three timelines. Three places for things to fall through the gaps.",
    after: "One point of contact. One team with full context. Faster decisions, cleaner output, and accountability that doesn't get lost between vendors.",
    stats: [
      { metric: 'Project delivery time', result: '20–40% faster' },
      { metric: 'Cost overrun rate', result: '30–50% lower' },
      { metric: 'Revision rounds', result: '40–60% fewer with single-team accountability' },
    ],
  },
  {
    id: 'packages', layout: 'dp-packages',
    pill: 'Packages',
    packages: [
      { name: 'Starter Web Presence', goal: 'Basic web presence, ready to grow', includes: ['Web strategy & sitemap', 'Landing page', 'Business card site'], price: '$11,210' },
      { name: 'Marketing Site', goal: 'Full marketing site with a CMS you can manage yourself', includes: ['Web strategy & sitemap', 'Marketing site', 'CMS'], price: '$21,110' },
      { name: 'Microsite Build', goal: 'Focused, campaign-driven microsite', includes: ['Web strategy & sitemap', 'Microsite'], price: '$14,690' },
      { name: 'Product Design Sprint', goal: 'Take a product concept into a working interactive design', includes: ['Product discovery', 'UX wireframes', 'UI design (feature)'], price: '$17,370' },
      { name: 'Interactive Experience', goal: 'Immersive 3D/WebGL flagship build', includes: ['Web strategy & sitemap', 'Interactive experience/WebGL'], price: '$30,045' },
      { name: 'Product Build', goal: 'Designed and built product in front of real users', includes: ['Product discovery', 'UX wireframes', 'UI design (feature)', 'Design-to-build (Claude Code)'], price: '$36,660' },
      { name: 'Full Web Build', goal: 'Large multi-template site with a design system to extend it', includes: ['Web strategy & sitemap', 'Big marketing site + CMS', 'Design system/component library'], price: '$43,275' },
    ],
    note: 'CRM Setup, Email System, and Full GTM Stack are available as custom-scoped engagements — pricing on request. Engagements start from $11,210.',
  },
  {
    id: 'services', layout: 'dp-services',
    pill: 'Services',
    areas: [
      {
        name: 'Product Design',
        services: [
          { name: 'Product discovery' },
          { name: 'UX wireframes' },
          { name: 'UI design — feature' },
          { name: 'Full product UI' },
          { name: 'Design-to-build (Claude Code)' },
          { name: 'Prototyping' },
        ],
      },
      {
        name: 'Web Builds',
        services: [
          { name: 'Web strategy & sitemap' },
          { name: 'Business card site' },
          { name: 'Landing page' },
          { name: 'Marketing site' },
          { name: 'Marketing site + CMS' },
          { name: 'Big marketing site + CMS' },
          { name: 'Shopify store' },
          { name: 'Microsite' },
          { name: 'Web design refresh' },
          { name: 'Design system / component library' },
        ],
      },
      {
        name: 'Interactive',
        services: [
          { name: 'Interactive experience / WebGL' },
          { name: 'Interactive calculator / quiz' },
        ],
      },
      {
        name: 'AI Products',
        services: [
          { name: 'Custom AI tool / agent' },
        ],
      },
      {
        name: 'Ops Infrastructure',
        services: [
          { name: 'CRM setup' },
          { name: 'Email system' },
          { name: 'Full GTM stack' },
        ],
      },
    ],
  },
]

export default function DigitalProducts() {
  const { data, loading } = useSanity(CAPABILITIES_QUERY)
  const [searchParams, setSearchParams] = useSearchParams()

  const clients = (data ?? [])
    .map(p => {
      const flat = flattenTiles(p.tiles)
      const variantCount = pickVariant(flat.length)
      if (!variantCount || flat.length < MIN_UNIQUE_TILES) return { ...p, tiles: [], variant: null }
      return { ...p, tiles: flat.slice(0, variantCount), variant: VARIANTS[variantCount] }
    })
    .filter(p => p.tiles.length > 0 && (p.summary || p.tagline) && DIGITAL_SLUGS.has(p.slug))

  const pool = clients.flatMap(c => c.tiles)

  const introSlides = DIGITAL_INTRO_SLIDES.map(slide => ({ kind: 'intro', slide }))
  const clientSlides = clients.map(client => ({ kind: 'client', client }))
  const slides = [...introSlides, ...clientSlides, { kind: 'closing' }]

  let tileIdx = 0
  slides.forEach((s, i) => {
    if (s.kind === 'intro' && s.slide.layout === 'outcome-detail' && pool.length > 0) {
      slides[i] = { ...s, tile: pool[tileIdx % pool.length] }
      tileIdx++
    }
  })

  const total = slides.length
  const rawIdx = parseInt(searchParams.get('slide') ?? '1', 10) - 1
  const idx = Math.max(0, Math.min(total - 1, isNaN(rawIdx) ? 0 : rawIdx))

  const setIdx = useCallback((next) => {
    const clamped = Math.max(0, Math.min(total - 1, next))
    const params = new URLSearchParams(searchParams)
    params.set('slide', String(clamped + 1))
    setSearchParams(params, { replace: true })
  }, [searchParams, setSearchParams, total])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); setIdx(idx + 1) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setIdx(idx - 1) }
      else if (e.key === 'Home') { e.preventDefault(); setIdx(0) }
      else if (e.key === 'End') { e.preventDefault(); setIdx(total - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx, total, setIdx])

  useMeta({
    title: 'Digital Products | Super Conscious',
    description: 'Websites, interfaces, and interactive experiences. Designed and shipped in one engagement.',
    path: '/digital-products',
  })

  if (loading) return <main className={styles.main} />
  if (total === 0) return (
    <main className={styles.main}>
      <p className={styles.notFound}>No published projects yet.</p>
    </main>
  )

  const current = slides[idx]

  return (
    <main className={styles.main}>
      <div className={styles.stage}>
        <div className={styles.slideFrame}>
          {current.kind === 'closing'
            ? <ClosingSlide />
            : current.kind === 'intro'
              ? <IntroSlide slide={current.slide} tile={current.tile} />
              : <ClientSlide client={current.client} />}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setIdx(idx - 1)}
            disabled={idx === 0}
            aria-label="Previous slide"
          >← Prev</button>
          <span className={styles.counter}>
            {String(idx + 1).padStart(2, '0')} <span className={styles.counterDim}>/ {String(total).padStart(2, '0')}</span>
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => setIdx(idx + 1)}
            disabled={idx === total - 1}
            aria-label="Next slide"
          >Next →</button>
        </div>
      </div>
    </main>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Slide router
// ────────────────────────────────────────────────────────────────────────

function IntroSlide({ slide, tile }) {
  switch (slide.layout) {
    case 'cover':           return <CoverSlide />
    case 'who-we-are':      return <WhoWeAreSlide slide={slide} />
    case 'outcomes':        return <DpOutcomesSlide slide={slide} />
    case 'outcome-detail':  return <DpOutcomeDetailSlide slide={slide} tile={tile} />
    case 'dp-packages':     return <DpPackagesSlide slide={slide} />
    case 'dp-services':     return <DpServicesSlide slide={slide} />
    default:                return null
  }
}

function Pill({ children }) {
  return <span className={styles.pill}>{children}</span>
}

// ────────────────────────────────────────────────────────────────────────
// Slide components
// ────────────────────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <section className={styles.coverSlide}>
      <video
        className={styles.coverVideo}
        src="https://cdn.sanity.io/files/ppq16wpu/production/6d752bbf01b6f5301b48d62598d4e1ee51a44251.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <svg
        className={styles.coverLogo}
        viewBox="0 0 168 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Super Conscious"
        role="img"
      >
        <path d="M132.995 4.23605C133.69 4.23605 134.242 3.72599 134.242 2.99733C134.242 2.26868 133.69 1.73499 132.995 1.73499C132.3 1.73499 131.772 2.26868 131.772 2.99733C131.772 3.72599 132.3 4.23605 132.995 4.23605Z" fill="currentColor"/>
        <path d="M81.4989 1.03586H81.5029V1.03192C83.232 1.03192 84.2954 2.49317 85.0654 4.23209C85.3628 4.90364 85.5144 5.66774 85.5144 5.66774L85.9359 5.58897L85.4317 0.0984497L85.0339 0.12602C85.0615 0.606539 84.902 0.927542 84.3742 0.927542C83.7144 0.927542 82.6333 0.447023 81.2882 0.447023C75.9848 0.447023 70.9453 7.31608 70.9453 13.4624C70.9453 17.151 73.1352 19.1814 75.6697 19.1814C78.2042 19.1814 81.1582 17.017 83.1374 13.9705L82.7672 13.7046C80.8136 16.2707 78.8364 17.3932 77.1211 17.3932C74.8268 17.3932 73.3478 15.7901 73.3478 12.716C73.3478 7.07582 77.3318 1.03782 81.5009 1.03782L81.4989 1.03586Z" fill="currentColor"/>
        <path d="M9.64172 0.968934C11.0931 0.968934 12.834 1.90437 14.1515 5.96515L14.5729 5.88637L13.5725 0.0866699L13.1747 0.114241C13.2023 0.541587 13.0172 0.86259 12.4874 0.86259C11.8277 0.86259 10.8509 0.409642 9.66338 0.409642C7.07764 0.409642 4.78139 2.57395 4.78139 5.38025C4.78139 7.01087 5.49232 8.42682 6.6818 9.73643L7.44787 10.5931C8.7949 12.0898 9.61218 13.425 9.61218 15.0832C9.61218 17.1943 8.13517 18.5827 6.10084 18.5827C4.06652 18.5827 2.30396 17.1648 0.931326 12.6235L0.509888 12.7023L1.27596 19.142L1.67377 19.0888C1.67377 18.7147 1.80571 18.3937 2.36107 18.3937C3.20591 18.3937 4.4722 19.142 6.08115 19.142C8.87761 19.142 11.6504 16.897 11.6504 13.8228C11.6504 11.9775 10.6224 10.6975 9.14347 9.01369L8.3518 8.10582C7.18989 6.79621 6.58333 5.59491 6.58333 4.20259C6.58333 2.25294 7.98156 0.968934 9.64369 0.968934H9.64172Z" fill="currentColor"/>
        <path d="M116.959 9.10035C117.276 8.73996 117.309 8.05857 117.02 7.56426C116.567 6.78637 115.832 6.43583 115.013 6.29995C113.607 6.06757 112.295 6.28616 111.295 7.44807C110.364 8.52924 110.48 9.78174 110.905 11.0264C111.262 12.0721 111.707 13.0843 112.055 14.132C112.248 14.7149 112.392 15.3333 112.433 15.9458C112.487 16.763 112.392 17.8521 111.774 18.0096C111.134 18.1731 110.206 17.4366 109.781 16.6941C109.597 16.3771 109.45 16.0344 109.237 15.741C108.904 15.2801 108.347 15.1443 107.876 15.3569C107.725 15.4239 107.593 15.5224 107.482 15.6405C107.299 15.8414 107.124 16.0482 106.919 16.2274C105.925 17.0998 104.968 17.4543 104.613 17.4543C104.591 17.4543 104.572 17.4503 104.55 17.4484C104.536 17.4444 104.523 17.4425 104.509 17.4366C104.505 17.4366 104.501 17.4326 104.497 17.4326C104.393 17.3893 104.298 17.2751 104.298 17.0427C104.298 16.6055 104.637 15.8099 104.924 15.2014L107.423 10.0771C107.855 9.20275 108.262 8.159 108.262 7.45595C108.262 6.80016 107.88 6.21724 106.968 6.21724C105.818 6.21724 104.956 7.11722 103.038 9.78765L99.0044 15.3904H98.6952L100.999 9.88415C101.311 9.13186 101.72 8.13537 101.72 7.45595C101.72 6.77653 101.297 6.21724 100.542 6.21724C100.521 6.21724 100.495 6.22117 100.474 6.22117V6.21724C99.1698 6.21724 98.0001 7.68636 96.7476 9.5789C96.332 10.2032 95.9716 10.7979 95.7077 11.178C94.9791 12.2848 94.2701 13.4447 93.4253 14.4688H93.1594L93.2264 14.3427C93.2382 14.3191 94.469 11.9992 94.6601 10.4868C94.6758 10.3292 94.6876 10.1855 94.6935 10.0496C94.7959 7.75726 93.5139 6.21724 91.5012 6.21724C89.6245 6.21724 87.789 7.5682 86.0383 10.2347C85.9674 10.343 85.9162 10.4198 85.8866 10.4592L85.8807 10.4671C85.5479 11.0795 84.9591 12.2316 84.6913 13.171C84.5554 13.7342 84.4746 14.3014 84.451 14.8489C84.3486 17.151 85.5932 18.6379 87.6216 18.6379C90.0873 18.6379 92.608 16.4519 93.9767 14.5003C94.7447 13.5255 95.3966 12.46 96.0799 11.4222C96.3635 11.0126 96.7889 10.3056 97.2714 9.59268C97.9193 8.71436 98.3782 8.13931 98.7208 7.80058C99.6681 7.55048 99.7094 7.67652 99.7094 7.85376C99.7094 8.26535 99.3491 9.04324 99.1108 9.60253L95.5404 18.2932C95.8515 18.2932 96.2119 18.244 96.525 18.244C96.8145 18.244 97.2675 18.2932 97.5806 18.2932L103.453 10.1126C105.107 7.83012 105.539 7.3693 105.897 7.3693C106.135 7.3693 106.279 7.56426 106.279 7.85376C106.279 8.29095 105.968 8.97037 105.487 9.96686L103.063 14.9946C102.815 15.5165 102.516 16.2097 102.374 16.8083C102.311 17.0191 102.272 17.218 102.272 17.3972C102.272 18.1002 102.703 18.6359 103.471 18.6359H103.495C104.048 18.63 104.609 18.4547 105.174 18.1061C105.738 17.7595 106.659 17.0722 107.226 16.5307C107.234 16.5661 107.236 16.5996 107.248 16.637C107.386 17.09 107.656 17.5626 108 17.8698C108.68 18.4783 109.554 18.6064 110.328 18.6359C113.172 18.6674 114.775 16.5661 114.054 13.8248C113.772 12.7594 113.327 11.7412 112.989 10.6876C112.794 10.0811 112.53 9.36227 112.431 8.73405C112.327 8.07235 112.268 7.13101 113.132 6.86318C113.664 6.69775 114.042 6.81395 114.613 7.99161C114.732 8.23581 114.925 8.59226 115.094 8.79116C115.287 9.01764 115.517 9.2579 115.779 9.36424C116.201 9.5336 116.638 9.47255 116.967 9.09444L116.959 9.10035ZM92.868 9.2835C92.6907 13.167 89.8194 18.1258 87.7437 18.1278C86.7236 18.1278 86.2234 17.3026 86.2943 15.7469C86.4578 12.1548 89.1715 6.8553 91.3949 6.8553C92.417 6.8553 92.9408 7.71787 92.8699 9.28547L92.868 9.2835Z" fill="currentColor"/>
        <path d="M35.0107 6.22507H34.991C34.9891 6.22507 34.9871 6.22507 34.9851 6.22507H34.9654H34.9733C32.9961 6.25461 31.0287 9.00971 29.9397 11.3257L29.918 11.371H29.5419L31.5841 6.53622C31.2414 6.53622 30.8436 6.58546 30.499 6.58546C30.1799 6.58546 29.6797 6.53622 29.3351 6.53622C29.0515 8.17668 28.6104 9.6596 28.0176 10.983C26.8695 13.1788 25.4023 15.2289 23.494 16.8024C23.4015 16.8772 23.2538 16.9875 23.0982 17.0998C22.6039 17.3853 22.2179 17.4641 21.9835 17.4641C21.7787 17.4641 21.6487 17.2947 21.6487 17.0033C21.6487 16.5917 22.0091 15.8138 22.2474 15.2545L25.8178 6.5638C25.5067 6.5638 25.1463 6.61303 24.8332 6.61303C24.5437 6.61303 24.0907 6.5638 23.7776 6.5638L17.905 14.7444C16.2508 17.0269 15.8195 17.4877 15.4611 17.4877C15.2228 17.4877 15.079 17.2928 15.079 17.0033C15.079 16.5661 15.3902 15.8866 15.8707 14.8902L18.295 9.86244C18.6298 9.15939 19.061 8.1373 19.061 7.45985C19.061 6.78239 18.6298 6.22113 17.8617 6.22113C16.8534 6.22113 15.9258 7.06795 14.9786 8.30272C15.1519 8.3362 15.3252 8.37559 15.4985 8.41497C16.1641 7.64299 16.5107 7.40667 16.749 7.3988C16.8908 7.40273 17.072 7.5012 17.072 7.81039C17.072 8.22198 16.7116 9.0491 16.4241 9.65566L13.925 14.7799C13.4937 15.6543 13.0861 16.698 13.0861 17.4011C13.0861 18.0569 13.4681 18.6398 14.3799 18.6398C15.53 18.6398 16.3926 17.7398 18.3107 15.0694L22.3439 9.4666H22.6531L20.349 14.9729C20.0378 15.7252 19.6282 16.7216 19.6282 17.4011C19.6282 18.0805 20.0595 18.6398 20.8275 18.6398C21.3888 18.6398 21.9579 18.4645 22.533 18.11C22.6393 18.045 22.7437 17.9741 22.85 17.9013V17.9052L22.8894 17.8757C23.3444 17.5645 23.7934 17.1963 24.2404 16.761C24.2936 16.7098 24.3448 16.6508 24.3979 16.5976C25.9084 15.1383 27.1314 13.3423 28.0944 11.4241H28.4193L28.378 11.558L24.6697 21.0522C24.203 22.4997 23.5905 22.7734 22.4916 22.7833L22.3774 23.1515H28.4666L28.6478 22.7833C27.4425 22.7754 26.9364 22.6533 26.7356 22.3303C26.5524 22.0349 26.6469 21.5997 26.8577 20.9912L27.9881 17.6157L28.0471 17.6787C28.6301 18.2971 29.4552 18.6378 30.3769 18.6378C31.9642 18.6378 33.6598 17.4286 35.0324 15.3195C36.2809 13.4013 37.0569 11.0637 37.0569 9.2224C37.0569 9.20271 37.0569 9.18105 37.0569 9.16135C37.0569 6.99705 35.9934 6.22507 34.9969 6.22507H35.0107ZM33.4825 15.0418C32.4191 17.0072 31.1902 18.1317 30.109 18.1317C29.7014 18.1317 29.3587 17.9801 29.0909 17.6807C28.7246 17.2731 28.5336 16.6074 28.5513 15.8098L28.5572 15.7803L28.9392 14.6538C29.8924 11.8141 32.3324 7.68632 33.9847 7.68632C34.7074 7.68632 35.06 8.33817 35.06 9.67732C35.06 11.1681 34.4416 13.2733 33.4845 15.0398L33.4825 15.0418Z" fill="currentColor"/>
        <path d="M65.4508 10.8589C63.7375 10.8018 63.379 9.41735 61.4432 9.35237C59.9504 9.30116 58.6132 10.4867 57.4907 12.135L57.9102 12.1882C58.6822 11.3 59.7259 10.8766 60.7894 10.9121C62.5184 10.9712 62.8749 12.3556 64.8265 12.4206C66.3035 12.4698 67.6446 11.2744 68.7652 9.63792L68.3497 9.57096C67.5777 10.4591 66.5457 10.8963 65.4528 10.8589H65.4508Z" fill="currentColor"/>
        <path d="M57.022 5.87653C55.7144 5.87653 53.6466 9.07276 52.2641 11.4931L52.081 11.8101L49.8103 16.2116H49.4145C50.5311 13.9114 52.6048 9.08261 52.6048 7.56425C52.6048 6.86513 52.1873 6.31569 51.3228 6.31569C50.4582 6.31569 49.4105 7.31611 48.3392 8.72419C48.3412 8.72616 48.3432 8.72813 48.3471 8.73207C47.6224 9.72659 46.9745 10.8885 46.5589 11.5147C45.3458 13.4427 44.436 14.8488 43.5458 15.8237L43.41 15.9458C43.3332 16.0147 43.2603 16.0876 43.1894 16.1604C42.8979 16.4598 41.9369 17.3617 40.9227 17.3617C39.7194 17.3617 39.1582 16.5405 39.1582 15.1088C39.1582 14.5495 39.235 13.9095 39.3787 13.2596L39.3925 13.2044L39.4437 13.1985C42.6616 12.7416 46.1355 10.6837 46.1355 8.15702C46.1355 6.95966 45.2533 6.18571 43.8846 6.18571C40.4126 6.18571 36.8875 11.4576 36.8875 15.2466C36.8875 17.3716 37.9943 18.6398 39.9853 18.6398C41.3166 18.6398 42.4686 18.0195 43.5104 16.7886C44.5167 15.672 45.6668 13.7952 46.9351 11.7786C47.453 10.9948 48.5401 9.12791 49.383 8.14717C49.7119 7.773 49.9876 7.55046 50.2002 7.54456C50.4149 7.55046 50.5567 7.69816 50.5567 7.96796C50.5567 8.39137 50.2593 9.11609 49.9895 9.81521L46.7125 18.3109C47.0316 18.3109 47.5023 18.2617 47.7977 18.2617C48.0931 18.2617 48.3412 18.3109 48.8828 18.3109L52.6796 11.818C54.135 9.3209 55.1925 8.19838 56.6991 7.72377C57.217 7.5485 57.8334 7.24916 57.8334 6.67608C57.8334 6.27827 57.538 5.8785 57.022 5.87653ZM39.5737 12.5309C40.3417 9.71871 42.0196 6.86907 43.7408 6.86907C44.5246 6.86907 44.6172 7.50911 44.6172 7.99357C44.6172 10.2544 42.0649 12.074 39.6623 12.6373L39.5343 12.6688L39.5717 12.5309H39.5737Z" fill="currentColor"/>
        <path d="M167.291 7.56425C166.838 6.78636 166.106 6.43582 165.285 6.29994C164.906 6.23692 164.536 6.20935 164.178 6.22116L164.186 6.21722C164.012 6.21722 163.847 6.22707 163.685 6.24283C163.678 6.24283 163.67 6.24283 163.662 6.24479C159.999 6.58943 158.764 10.4671 158.339 11.5147C157.512 13.5589 155.123 17.4622 153.508 17.4622C153.303 17.4622 153.173 17.2928 153.173 17.0013C153.173 16.5897 153.533 15.8118 153.772 15.2526L157.342 6.56186C157.031 6.56186 156.671 6.61109 156.358 6.61109C156.068 6.61109 155.615 6.56186 155.302 6.56186L149.429 14.7425C147.775 17.025 147.344 17.4858 146.985 17.4858C146.747 17.4858 146.603 17.2908 146.603 17.0013C146.603 16.5641 146.915 15.8847 147.395 14.8882L149.819 9.8605C150.154 9.15745 150.585 8.13536 150.585 7.45791C150.585 6.78046 150.154 6.21919 149.386 6.21919C148.378 6.21919 147.45 7.06601 146.503 8.30079C146.507 8.30079 146.513 8.30275 146.517 8.30472C145.723 9.28545 145 10.538 144.553 11.18C143.884 12.1981 143.183 13.4309 142.35 14.3939H142.09L142.117 14.3447C142.129 14.3211 143.36 12.0012 143.551 10.4887C143.567 10.3312 143.578 10.1874 143.584 10.0515C143.687 7.75922 142.405 6.21919 140.392 6.21919C137.773 6.21919 135.768 8.1393 134.527 9.93731C131.997 13.2143 130.545 17.4484 128.931 17.4484C128.736 17.4484 128.592 17.3007 128.592 17.0309C128.592 16.6134 128.98 15.7291 129.248 15.1639L131.747 9.92943C132.085 9.21653 132.523 8.18459 132.523 7.44806C132.523 6.78439 132.111 6.21919 131.26 6.21919C131.211 6.21919 131.162 6.22313 131.111 6.22904C130.526 6.29009 129.655 6.7135 128.897 7.56819C127.389 9.23622 126.242 12.1213 124.561 14.327C124.393 14.5554 124.232 14.7642 124.076 14.9631L123.978 15.1009C123.178 15.9911 122.333 16.7493 121.323 17.1904C121.14 17.2475 120.965 17.2928 120.809 17.3204C120.622 17.342 120.456 17.3479 120.299 17.344C118.735 17.2869 118.111 16.5247 118.066 14.6224C118.115 12.3182 118.911 10.0377 120.399 8.24761C120.766 7.80648 121.248 7.5032 121.585 7.32793C122.249 6.9833 122.804 7.3752 123.225 8.09204C123.275 8.17672 123.322 8.26337 123.369 8.35002C123.46 8.51938 123.556 8.69662 123.668 8.84432C123.993 9.27167 124.529 9.36029 124.97 9.06095C125.366 8.79312 125.64 8.20823 125.417 7.69029C125.21 7.21371 124.884 6.79818 124.541 6.57958C123.804 6.11285 122.91 6.09709 121.811 6.53429C118.924 7.68044 116.299 11.7314 116.197 15.2053C116.211 16.2136 116.534 17.0781 117.128 17.7083C117.749 18.3641 118.822 18.63 119.539 18.63C121.685 18.63 123.135 16.7236 124.243 15.3294C126.981 12.0091 128.485 7.40277 130.169 7.40277C130.364 7.40277 130.508 7.55047 130.508 7.82027C130.508 8.23777 130.12 9.122 129.852 9.6872L127.353 14.9217C127.014 15.6346 126.577 16.6665 126.577 17.4031C126.577 18.0667 126.989 18.6319 127.84 18.6319C127.889 18.6319 127.938 18.628 127.989 18.6221C128.574 18.561 129.445 18.1376 130.203 17.2829C131.711 15.6149 133.119 12.3045 134.803 10.0988H135.041C134.764 10.5498 133.923 11.9834 133.584 13.171C133.448 13.7342 133.367 14.3014 133.344 14.8488C133.241 17.151 134.486 18.6378 136.514 18.6378C138.982 18.6378 141.461 16.4499 142.83 14.4983C143.596 13.5235 144.246 12.46 144.929 11.4222C145.378 10.7743 146.182 9.37998 147.007 8.40713C147.304 8.0881 147.525 7.86359 147.706 7.70605C147.889 7.56031 148.071 7.45397 148.242 7.4008C148.254 7.4008 148.266 7.39686 148.275 7.39489C148.417 7.39883 148.598 7.49729 148.598 7.80648C148.598 8.21807 148.238 9.0452 147.95 9.65175L145.451 14.776C145.02 15.6504 144.612 16.6941 144.612 17.3972C144.612 18.053 144.994 18.6359 145.906 18.6359C147.056 18.6359 147.919 17.7359 149.837 15.0655L153.868 9.4627H154.177L151.873 14.969C151.562 15.7213 151.153 16.7177 151.153 17.3972C151.153 18.0766 151.584 18.6359 152.352 18.6359C155.834 18.6359 157.811 13.9823 158.735 11.7747C159.026 11.0776 159.871 8.53514 161.11 7.70605H161.364C160.653 8.72616 160.781 9.87823 161.171 11.0244C161.527 12.0701 161.972 13.0823 162.319 14.13C162.512 14.713 162.657 15.3313 162.695 15.9438C162.697 16.4795 162.65 17.1727 162.559 17.4267C162.386 17.8422 162.201 18.053 161.925 18.116C161.32 18.2558 160.546 17.9998 160.036 17.3597C159.707 16.9088 159.558 16.5878 159.44 16.2786C159.219 15.6622 159.065 15.3747 158.624 15.3747C158.096 15.3747 157.677 15.7705 157.677 16.3652C157.677 17.5646 159.124 18.6122 160.844 18.6319L160.838 18.6359C160.854 18.6359 160.869 18.6359 160.887 18.6359C163.699 18.6398 165.023 16.5503 164.306 13.8268C164.026 12.7613 163.581 11.7432 163.242 10.6896C163.047 10.083 162.783 9.36423 162.685 8.73601C162.581 8.07431 162.524 7.13297 163.386 6.86514C163.92 6.69971 164.296 6.8159 164.867 7.99357C164.985 8.23777 165.178 8.59422 165.348 8.79312C165.539 9.01959 165.771 9.25985 166.031 9.3662C166.452 9.53556 166.89 9.47451 167.218 9.0964C167.535 8.73601 167.569 8.05462 167.281 7.56031L167.291 7.56425ZM141.765 9.28349C141.587 13.167 138.716 18.1258 136.64 18.1278C135.62 18.1278 135.12 17.3026 135.191 15.7469C135.355 12.1548 138.068 6.85529 140.292 6.85529C141.314 6.85529 141.838 7.71786 141.767 9.28546L141.765 9.28349Z" fill="currentColor"/>
      </svg>
      <div className={styles.coverDivider} aria-hidden="true" />
      <svg
        className={styles.coverMark}
        viewBox="0 0 75 75"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g clipPath="url(#sc-mark-clip-digital)">
          <path d="M58.07 43.71L56.14 30.12C56.09 29.78 56.03 29.45 55.96 29.12C55.96 29.06 55.94 29 55.92 28.94C55 24.68 52.72 20.81 49.4 17.93C45.74 14.75 41.04 13 36.19 13C26.5 13 18.39 19.86 16.45 28.97C16.45 28.97 16.45 28.99 16.45 29C16.16 30.35 16.01 31.75 16.01 33.19C16.01 39.84 17.82 44.38 19.41 48.39C20.72 51.69 21.86 54.54 21.86 58.02C21.86 58.73 21.86 59.36 21.86 59.36V61.57C21.85 61.75 21.92 61.92 22.04 62.05C22.17 62.18 22.34 62.25 22.51 62.25H34.2C34.2 62.25 34.21 62.25 34.22 62.25H38.17C38.17 62.25 38.17 62.25 38.18 62.25H48.15C48.33 62.25 48.5 62.18 48.62 62.06C48.74 61.94 48.82 61.76 48.82 61.59V56.58H52.74C53.55 56.58 54.2 55.92 54.2 55.12V45.11H56.88C57.23 45.11 57.57 44.96 57.8 44.69C58.03 44.42 58.13 44.07 58.08 43.73L58.07 43.71ZM36.19 14.34C40.72 14.34 45.1 15.97 48.53 18.94C51.45 21.47 53.5 24.81 54.45 28.5H17.93C20.02 20.36 27.41 14.34 36.19 14.34ZM34.62 60.9L29.62 51.44H42.77L37.77 60.9H34.62ZM43.48 50.1H28.91L23.91 40.63H48.48L43.48 50.1ZM49.19 39.3H23.2L18.2 29.83H54.19L49.19 39.3ZM20.65 47.89C19.1 44 17.34 39.58 17.34 33.19C17.34 32.54 17.37 31.89 17.44 31.26L22.21 40.28L27.92 51.08L33.11 60.9H23.18V59.36C23.18 59.36 23.18 58.73 23.18 58.01C23.18 54.27 21.94 51.17 20.64 47.89H20.65ZM53.53 43.76C53.16 43.76 52.86 44.06 52.86 44.43V55.11C52.86 55.18 52.8 55.24 52.73 55.24H48.14C47.77 55.24 47.47 55.54 47.47 55.91V60.92H39.27L44.46 51.1L50.17 40.3L54.94 31.27L56.71 43.78H53.52L53.53 43.76Z" fill="currentColor"/>
        </g>
        <defs>
          <clipPath id="sc-mark-clip-digital">
            <rect width="42.09" height="49.24" fill="white" transform="translate(16 13)" />
          </clipPath>
        </defs>
      </svg>
      <div className={styles.coverCornerStack}>
        <div className={styles.coverCorner}>Digital Products.</div>
        <div className={styles.coverCorner}>Websites, interfaces, and interactive experiences. Designed and shipped.</div>
      </div>
    </section>
  )
}

function ClosingSlide() {
  return (
    <section className={styles.closingSlide}>
      <img src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif" alt="" className={styles.closingGif} />
    </section>
  )
}

function WhoWeAreSlide({ slide }) {
  return (
    <section className={styles.whoWeAreSlide}>
      <video className={styles.whoWeAreVideo} src={slide.videoUrl} autoPlay loop muted playsInline />
      <div className={styles.whoWeAreScrim} aria-hidden="true" />
      <div className={styles.whoWeAreCard}>
        <Pill>{slide.pill}</Pill>
        <h2 className={styles.whoWeAreHeadline}>{slide.headline}</h2>
        <div className={styles.whoWeAreBody}>
          {slide.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  )
}

function DpOutcomesSlide({ slide }) {
  return (
    <section className={styles.introSlide}>
      <Pill>{slide.pill}</Pill>
      <div className={styles.bsOutcomesGrid}>
        {slide.cards.map(card => (
          <div key={card.tag} className={styles.bsOutcomeCard}>
            <p className={styles.outcomeTag}>{card.tag}</p>
            <p className={styles.bsOutcomeTitle}>{card.title}</p>
            <p className={styles.bsOutcomeBody}>{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function DpOutcomeDetailSlide({ slide, tile }) {
  return (
    <section className={styles.introSlide}>
      <Pill>{slide.pill}</Pill>
      <h2 className={styles.bsDetailTitle}>{slide.headline}</h2>
      <div className={styles.bsDetailMain}>
        {tile && <Tile tile={tile} className={styles.bsDetailImage} />}
        <div className={styles.bsDetailCards}>
          <div className={styles.bsDetailCard}>
            <p className={styles.bsDetailLabel}>When you need it</p>
            <p className={styles.bsDetailBody}>{slide.when}</p>
          </div>
          <div className={styles.bsDetailCard}>
            <p className={styles.bsDetailLabel}>Before</p>
            <p className={styles.bsDetailBody}>{slide.before}</p>
          </div>
          <div className={styles.bsDetailCard}>
            <p className={styles.bsDetailLabel}>After</p>
            <p className={styles.bsDetailBody}>{slide.after}</p>
          </div>
          <div className={styles.bsDetailCard}>
            <p className={styles.bsDetailLabel}>The numbers</p>
            <ul className={styles.bsDetailStats}>
              {slide.stats.map(s => (
                <li key={s.metric} className={styles.bsDetailStat}>
                  <span className={styles.bsDetailMetric}>{s.metric}</span>
                  <span className={styles.bsDetailResult}>{s.result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function DpPackagesSlide({ slide }) {
  const half = Math.ceil(slide.packages.length / 2)
  const left = slide.packages.slice(0, half)
  const right = slide.packages.slice(half)
  return (
    <section className={styles.introSlide}>
      <Pill>{slide.pill}</Pill>
      <div className={styles.bsPackGrid}>
        {[left, right].map((col, ci) => (
          <div key={ci} className={styles.servicesCol}>
            <ul className={styles.packagesList}>
              {col.map(pkg => (
                <li key={pkg.name} className={styles.packagesRow}>
                  <div className={styles.packagesText}>
                    <p className={styles.packagesName}>{pkg.name}</p>
                    <p className={styles.packagesGoal}>{pkg.goal}</p>
                    {pkg.includes && (
                      <div className={styles.bsPackIncludes}>
                        {pkg.includes.map(d => <span key={d} className={styles.servicesTag}>{d}</span>)}
                      </div>
                    )}
                  </div>
                  <span className={styles.packagesPrice}>{pkg.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {slide.note && <p className={styles.bsPackNote}>{slide.note}</p>}
    </section>
  )
}

function DpServicesSlide({ slide }) {
  return (
    <section className={styles.introSlide}>
      <Pill>{slide.pill}</Pill>
      <div className={styles.bsSvcGrid}>
        {slide.areas.map(area => (
          <div key={area.name} className={styles.bsSvcCol}>
            <p className={styles.bsSvcHead}>{area.name}</p>
            <div className={styles.servicesTags}>
              {area.services.map(svc => (
                <span key={svc.name} className={styles.servicesTag}>{svc.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Shared tile + client slide
// ────────────────────────────────────────────────────────────────────────

function Tile({ tile, className }) {
  if (!tile) return null
  return (
    <div className={className}>
      {tile.isVideo
        ? <LazyVideo src={tile.src} className={styles.tileMedia} />
        : <img src={`${tile.src}?w=1600&q=80&auto=format`} alt="" loading="lazy" className={styles.tileMedia} />}
    </div>
  )
}

const PILLAR_MAP = {
  brand:   { label: 'Brand System',    icon: '◆' },
  product: { label: 'Digital Product', icon: '◈' },
  content: { label: 'Content Program', icon: '◉' },
}

const STATIC_CATEGORY_MAP = {
  'photon':      [{ key: 'product', achievement: 'Designed the product UI for a system that moves prescriptions faster and more cleanly.' }],
  'print-parlor':[{ key: 'product', achievement: 'Built a clean, conversion-focused site that turned browsing into buying.' }],
  'yura':        [{ key: 'product', achievement: 'Built a digital benefits platform that changes how employees access their coverage.' }],
}

function ClientSlide({ client }) {
  const staticEntries = STATIC_CATEGORY_MAP[client.slug] ?? []
  const rawCats = Array.isArray(client.category) && client.category.length > 0
    ? client.category.map(c => ({ key: c, achievement: staticEntries.find(e => e.key === c)?.achievement ?? '' }))
    : staticEntries
  const pillars = rawCats.map(item => {
    const pillar = PILLAR_MAP[item.key?.toLowerCase()]
    return pillar ? { ...pillar, achievement: item.achievement } : null
  }).filter(Boolean)

  return (
    <section className={styles.slide}>
      <div className={styles.text}>
        <div className={styles.ticks} aria-hidden="true">
          <span /><span /><span />
        </div>
        <h2 className={styles.name}>{client.name}</h2>
        {(client.summary || client.tagline) && (
          <div className={styles.body}>
            {(client.summary || client.tagline).split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
        {pillars.length > 0 && (
          <div className={styles.pillarCards}>
            {pillars.map(p => (
              <div key={p.label} className={styles.pillarCard}>
                <span className={styles.pillarLabel}>{p.label}</span>
                {p.achievement && <span className={styles.pillarSub}>{p.achievement}</span>}
              </div>
            ))}
          </div>
        )}
        <NavLink to={`/work/${client.slug}`} className={styles.openLink}>
          Open case study →
        </NavLink>
      </div>

      <div className={styles.mosaic}>
        {client.tiles.map((tile, i) => {
          const shape = client.variant[i].shape
          return (
            <Tile
              key={`${client._id}-${i}`}
              tile={tile}
              className={`${styles.tile} ${styles[`tile_${shape}`]}`}
            />
          )
        })}
      </div>
    </section>
  )
}

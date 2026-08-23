import styles from './Services.module.css'
import { useMeta } from '../hooks/useMeta'
import EmailCaptureForm from '../components/EmailCaptureForm'
import LazyVideo from '../components/LazyVideo'
import { useSanity } from '../hooks/useSanity'
import { ABOUT_PAGE_QUERY, SITE_CONFIG_QUERY } from '../lib/queries'

/**
 * The page's copy, in code on purpose.
 *
 * This is the studio's own argument for itself, and its price list. Neither is
 * editorial content that changes week to week, and the argument only works as
 * a whole: a half-edited positioning statement is worse than none, and a CMS
 * field invites exactly that. A stale price is worse still. It also renders
 * without a network call, so crawlers and the SSG get the real page rather
 * than a shell waiting on Sanity.
 *
 * What is left in Sanity is what genuinely churns: the discipline list and the
 * FAQ. See the note on the component below.
 */
// The studio reel, same source and same fallback as the homepage: it reads
// siteConfig.reelVideoUrl so changing the reel in the Studio moves both pages
// at once, rather than leaving /services on a URL nobody remembers pasting.
const REEL_FALLBACK = 'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'

const COPY = {
  eyebrow: '[ Services ]',
  headline: "For brands that don't have incumbent money — and don't need it.",
  intro: [
    "You're competing against companies with bigger budgets, bigger teams, and a decade of brand equity you don't have yet. What you do have is speed, a sharper point of view, and no legacy to protect.",
    'We build brands that use that. Then we take them to market.',
    "Most of the brands who come to us assumed this level of work was out of reach — that agency-caliber branding, film, and media management was something you graduated into after a raise or a good year. It isn't.",
  ],

  audienceLabel: "Where You're Starting",
  audienceLead: 'Most of the brands we work with arrive in one of three situations.',
  audience: [
    {
      name: 'New',
      definition: 'A brand that needs to be defined from scratch: identity, visual system, voice.',
      body: 'Nothing to protect and nothing to unwind. The advantage is that every decision is still available to you; the risk is making them in the wrong order. We start with positioning, then build the system outward.',
    },
    {
      name: 'Pivoting',
      definition: 'An existing brand reworking what it has. A facelift, or a full-scale overhaul to retain and amplify relevancy.',
      body: "You have equity worth keeping and baggage worth dropping, and the hard part is telling them apart. We audit what's actually load-bearing before we touch anything.",
    },
    {
      name: 'Underdog',
      definition: 'A brand in a crowded category that needs to stand out.',
      body: "The category has conventions, and the leader wrote them. Blending in is the default failure. We find the position your competitors can't copy without contradicting themselves, then put weight behind it.",
    },
  ],

  // The two halves of the offer, each opened by a band in the homepage intro
  // card's style: name on the left, its one-line definition right-aligned.
  buildBand: { name: 'Build' },
  growBand: { name: 'Grow' },

  buildIntro: [
    "Typically one-time engagements: you build a brand, you build a website. But brands aren't static. When you launch a new offering and your positioning suddenly feels a half-step behind, we're here for the refresh.",
    "Almost everything in branding and marketing falls into one of four pillars. Don't see what you need? Ask — our capabilities run deep, and if we can't help, we probably know who can.",
  ],

  packages: [
    {
      n: '01',
      name: 'Your Brand',
      items: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Motion Identity', 'Product Positioning'],
      value: 'The thing that makes you impossible to confuse with the category leader.',
      price: '$15,000',
    },
    {
      n: '02',
      name: 'Your Website & App',
      items: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
      value: 'Design and engineering under one roof, so nothing gets lost in the handoff.',
      price: '$10,000',
    },
    {
      n: '03',
      name: 'Your Marketing Mix',
      items: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Film & Video Production', 'Motion Graphics', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
      note: 'Covers initial marketing set-up and the initial flighting of any campaigns. Campaign extensions and subsequent campaign work are billed separately. All production costs are billed separately.',
      price: '$15,000',
    },
    {
      n: '04',
      name: 'Your Channels',
      items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
      note: 'Covers initial channel set-up and two months of organic content, including short-form social video and motion assets.',
      price: '$10,000',
      priceSuffix: 'per channel',
    },
  ],

  growIntro: 'Ongoing support, billed hourly. With the brand and marketing apparatus in good shape, we pivot toward optimizations, extensions, additions, and whatever else you need as you engage your audience.',
  growTerms: 'Billed quarterly. One-quarter minimum engagement. Media spend is separate and paid directly by you to the platforms.',

  // NOTE ON THE FIGURES: the source table labelled this column "Quarterly
  // rate", but every row is hours-per-month times the effective rate — 25 ×
  // $180 = $4,500, 150 × $140 = $21,000 — which makes them monthly amounts.
  // Read as quarterly, 25 hrs/month for $4,500 would work out at $60/hr and
  // contradict the effective-rate column beside it. They are labelled per
  // month here so the page cannot understate the price threefold; "billed
  // quarterly" is stated in the terms above the grid.
  tiers: [
    { hours: '25', price: '$4,500', rate: '$180 / hour', body: 'One pillar, kept current.' },
    { hours: '50', price: '$8,250', rate: '$165 / hour', body: 'Two pillars, running properly across your most important channels.' },
    { hours: '100', price: '$15,000', rate: '$150 / hour', body: 'Three pillars, every month — comprehensive performance view and quick optimizations.', flag: 'Most common' },
    { hours: '150', price: '$21,000', rate: '$140 / hour', body: 'All four pillars. The most robust support for brand oversight, maintenance, and seamless evolution.' },
  ],

  // Lifted out of Sanity so Media and Search could be added — there is no
  // write token here, and every other block on this page is already in code.
  // The first ten are the client's own wording from the aboutPage document,
  // verbatim; Media and Search are new.
  disciplinesLabel: 'Disciplines',
  disciplines: [
    { name: 'Creative direction', body: 'Brand strategy, concept development, and the creative through-line that holds a project together from first idea to final asset.' },
    { name: 'Writing', body: 'Naming, taglines, scripts, voice, and body copy. The verbal half of a brand, shaped to earn its space across every surface.' },
    { name: 'Design', body: 'Identity systems, visual languages, layout, and typography. The framework that lets every piece of output feel like the same brand.' },
    { name: 'Illustration', body: 'Custom marks, characters, editorial pieces, and full toolkit systems built to extend the brand into any context.' },
    { name: 'Film & photo', body: 'Direction, shoots, casting, lighting, and styling for stills and moving image, from product capture to campaign storytelling.' },
    { name: '3D & motion', body: 'Modeling, rendering, and motion design across formats: brand films, product explainers, social spots, and platform-native work.' },
    { name: 'Animation', body: 'Cel, rigged, and procedural animation built for any platform, from social loops to broadcast spots to interactive experiences.' },
    { name: 'Editing', body: 'Story structure, pacing, and color. The post-production craft that turns footage into a finished piece with rhythm and intent.' },
    { name: 'Production', body: 'Planning, scheduling, budgeting, casting, and the on-the-ground logistics that turn a creative brief into a finished, shipped piece of work.' },
    { name: 'Media', body: 'Paid strategy, buying, and creative testing across social, search, and programmatic. Planned, flighted, and optimized against the numbers rather than the impressions.' },
    { name: 'Search', body: 'SEO and AEO: the technical foundations, the content that earns the position, and the structured data that makes a brand legible to engines and to models.' },
    { name: 'Engineering', body: 'Marketing sites, web apps, internal tools, and bespoke builds. Production code that ships fast, scales cleanly, and is built to last.' },
  ],

  // The three points that were 'Our Point of View' until they were pulled for
  // an About page that does not exist. They are about how an engagement runs
  // rather than what the studio believes, which is what this section is for —
  // and they put 'embedded' back on a page that had lost the word entirely.
  howLabel: 'How We Work',
  howLead: 'One team, on the inside, for both halves of the work.',
  how: [
    {
      heading: 'Build and Grow, one embedded team.',
      body: 'Most of the field only does one half: identity and web, or campaigns and content. We do both, with the same people who already know the brand.',
    },
    {
      heading: 'Digital-first, by priority not by rule.',
      body: 'If it is digital, it is core to what we do. Print, events, and partnerships are available as needed; the door is not closed.',
    },
    {
      heading: 'Strategy that gets executed.',
      body: 'Our thinking does not sit in a deck. It goes into brand, creative, and paid media — and we revisit it through analytics, testing for bias and confirming the assumptions still hold.',
    },
  ],

  proofLabel: 'Proof',
  proofLead: 'What Build → Grow looks like in practice.',
  // `image` is the Sanity CDN URL for the card's picture. Arbitrum's is the
  // rebrand project's thumbnail, the only Arbitrum asset in the dataset.
  // iScribe has none: there is no iScribe project in Sanity at all, so its
  // card renders the empty frame until an asset is supplied. The frame holds
  // the 4:5 either way, so a missing image costs alignment, not layout.
  proof: [
    {
      name: 'iScribe',
      body: 'Came to us for a website. We sold in branding, marketing, and ongoing channel support, including for their conference season.',
      video: '/iscribe-linkedin.mp4',
    },
    {
      name: 'Arbitrum',
      body: 'Came to us for a campaign, which was subsequently adopted and adapted across their key channels, including Meta, LinkedIn, and X.',
      image: 'https://cdn.sanity.io/images/ppq16wpu/production/287033702920964323315b0505937fc161be77d1-720x1280.jpg',
    },
  ],


  ctaLabel: 'Talk to a Super-Conscious human.',
  ctaSub: 'It might change your life. At minimum, we can probably answer some of your burning marketing questions.',
}

/**
 * The studio's services page, at /services.
 *
 * It was called Capabilities and lived at /about until the rename; the old URL
 * is 301'd in vercel.json (and mapped client-side in App.jsx, since a Vercel
 * redirect never runs on an in-app navigation).
 *
 * The CMS side deliberately did NOT follow. The Sanity type is still
 * `aboutPage`, doc id `about-page`, queried through ABOUT_PAGE_QUERY —
 * renaming a type in Sanity does not migrate the documents stored under the
 * old name, so it would orphan every field the client has edited. The names
 * differ on purpose: /services is what the visitor sees, aboutPage is where
 * the remaining content is kept.
 *
 * The page now reads only TWO things from that document: the discipline list
 * and the FAQ. Everything else on screen comes from COPY above. Each field
 * that stopped reaching the page was dropped from the query and the schema in
 * the same change rather than left fetched-but-unused — a field an editor can
 * still fill in that changes nothing is a trap. Their stored values are
 * untouched in Sanity if any of this needs reverting.
 */
export default function Services() {
  const { data } = useSanity(ABOUT_PAGE_QUERY)
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  const cfg = data ?? {}
  const reelUrl = siteConfig?.reelVideoUrl ?? REEL_FALLBACK
  const faqSchema = cfg.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null
  useMeta({
    title: 'Services | Super Conscious',
    description: "For brands that don't have incumbent money. Brand, website, marketing mix and channels from $10,000, plus ongoing support billed hourly with a flat media fee.",
    path: '/services',
    schema: faqSchema,
  })

  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>{COPY.eyebrow}</p>
        <h1 className={styles.headline}>{COPY.headline}</h1>
        <div className={styles.introStack}>
          {COPY.intro.map(para => (
            <p key={para.slice(0, 24)} className={styles.introPara}>{para}</p>
          ))}
        </div>
        {/* Closes the hero: the argument, then the work. Same lazy treatment
            as the Proof films — nothing loads until it is on screen. */}
        <div className={styles.reelFrame}>
          <LazyVideo src={reelUrl} className={styles.reelVideo} />
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.audienceLabel}</p>
        <p className={styles.sectionLead}>{COPY.audienceLead}</p>
        <div className={styles.audienceGrid}>
          {COPY.audience.map(({ name, definition, body }) => (
            <div key={name} className={styles.audienceCard}>
              <p className={styles.audienceName}>{name}</p>
              <p className={styles.audienceDefinition}>{definition}</p>
              <p className={styles.audienceBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>What We Do</p>

        {/* Both halves are set as plain type now; the band card they used to
            sit in is gone. */}
        <div className={styles.halfHead}>
          <p className={styles.halfName}>{COPY.buildBand.name}</p>
        </div>
        <div className={styles.bandBody}>
          {COPY.buildIntro.map(para => (
            <p key={para.slice(0, 24)} className={styles.bandPara}>{para}</p>
          ))}
        </div>
        <div className={styles.packageList}>
          {COPY.packages.map(({ n, name, items, value, note, price, priceSuffix }) => (
            <div key={n} className={styles.packageCard}>
              <div className={styles.packageMain}>
                <span className={styles.packageN}>{n}</span>
                <p className={styles.packageName}>{name}</p>
                <ul className={styles.packageItems}>
                  {items.map(i => (
                    <li key={i} className={styles.packageItem}>{i}</li>
                  ))}
                </ul>
                {value && <p className={styles.packageValue}>{value}</p>}
                {note && <p className={styles.packageNote}>{note}</p>}
              </div>
              <div className={styles.packagePrice}>
                <span className={styles.packagePriceLabel}>Starting at</span>
                <span className={styles.packagePriceValue}>{price}</span>
                {/* Rendered on every card, empty or not, so all four prices sit
                    on one line — only 04 carries a suffix. */}
                <span className={styles.packagePriceSuffix} aria-hidden={!priceSuffix}>{priceSuffix}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.halfHead}>
          <p className={styles.halfName}>{COPY.growBand.name}</p>
        </div>
        <div className={styles.bandBody}>
          <p className={styles.bandPara}>{COPY.growIntro}</p>
        </div>
        <div className={styles.tierGrid}>
          {COPY.tiers.map(({ hours, price, rate, body, flag }) => (
            <div key={hours} className={flag ? styles.tierCardFlagged : styles.tierCard}>
              {/* The badge slot is always rendered, empty or not, so all four
                  cards align on the number rather than the flagged one sitting
                  a line lower than its neighbours. CSS reserves the height, so
                  the empty ones stay out of the accessibility tree. */}
              <span className={styles.tierFlag} aria-hidden={!flag}>{flag}</span>
              {/* Three groups, not six loose lines: what the tier IS (hours),
                  what it COSTS (price over its effective rate, which is the
                  argument for stepping up), and what it BUYS (the body, pinned
                  to the foot so all four align). */}
              <div className={styles.tierId}>
                <p className={styles.tierHours}>{hours}</p>
                <p className={styles.tierUnit}>hours / month</p>
              </div>
              <div className={styles.tierMoney}>
                <p className={styles.tierPrice}>{price}</p>
                <p className={styles.tierRate}>{rate}</p>
              </div>
              <p className={styles.tierBody}>{body}</p>
            </div>
          ))}
        </div>
        {/* The terms belong after the numbers they qualify, not before them.
            Set small: they are the conditions on the rates above, and reading
            them first made the reader work through the fine print to reach
            the prices. */}
        <div className={styles.growFootnotes}>
          <p className={styles.growTerms}>{COPY.growTerms}</p>
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.howLabel}</p>
        <p className={styles.sectionLead}>{COPY.howLead}</p>
        <div className={styles.howGrid}>
          {COPY.how.map(({ heading, body }, i) => (
            <div key={heading} className={styles.howPoint}>
              <span className={styles.howN}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.howHeading}>{heading}</p>
              <p className={styles.howBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.proofLabel}</p>
        <p className={styles.sectionLead}>{COPY.proofLead}</p>
        <div className={styles.proofGrid}>
          {COPY.proof.map(({ name, body, image, video }) => (
            <div key={name} className={styles.proofCard}>
              {/* LazyVideo, not a bare <video>: preload="none" until the frame
                  intersects, then autoplay muted and pause again offscreen. The
                  file is large, and this is well down the page — most visitors
                  should never pay for it. */}
              <div className={styles.proofFrame}>
                {video && <LazyVideo src={video} className={styles.proofImage} />}
                {image && !video && <img className={styles.proofImage} src={image} alt="" loading="lazy" />}
              </div>
              <div className={styles.proofText}>
                <p className={styles.proofName}>{name}</p>
                <p className={styles.proofBody}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.disciplinesLabel}</p>
        <div className={styles.rolesGrid}>
          {/* <details>, on the FAQ's pattern further down the page — twelve
              descriptions open at once was most of a screen of body copy for a
              list whose job is to be scanned. */}
          {COPY.disciplines.map(({ name, body }) => (
            <details key={name} className={styles.roleCard}>
              <summary className={styles.roleSummary}>
                <span className={styles.roleName}>{name}</span>
                <span className={styles.roleToggle} aria-hidden="true" />
              </summary>
              <p className={styles.roleDesc}>{body}</p>
            </details>
          ))}
        </div>
      </section>

      {cfg.faqs?.length > 0 && (
        <section className={styles.textSection}>
          <p className={styles.sectionLabel}>{cfg.faqLabel || 'FAQ'}</p>
          <div className={styles.faqList}>
            {cfg.faqs.map(({ question, answer }) => (
              <details key={question} className={styles.faqItem}>
                <summary className={styles.faqQ}>
                  <span>{question}</span>
                  <span className={styles.faqToggle} aria-hidden="true" />
                </summary>
                <p className={styles.faqA}>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className={styles.pricingSection}>
        <div className={styles.pricingCard}>
          <p className={styles.pricingLabel}>{COPY.ctaLabel}</p>
          <p className={styles.pricingSub}>{COPY.ctaSub}</p>
          <EmailCaptureForm
            styles={styles}
            submitLabel="Get in touch →"
            confirmMessage="Thanks — we'll be in touch shortly."
            subject="Enquiry from super-conscious.studio"
            requestType="pricing"
          />
        </div>
      </section>

    </main>
  )
}

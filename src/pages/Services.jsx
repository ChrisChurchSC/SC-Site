import { useState } from 'react'
import styles from './Services.module.css'
import { useMeta } from '../hooks/useMeta'
import ContactCTA from '../components/ContactCTA'
import LazyVideo from '../components/LazyVideo'
import { useSanity } from '../hooks/useSanity'
import { SITE_CONFIG_QUERY } from '../lib/queries'

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
  headline: 'Super-Conscious exists to level up challenger brands by combining world-class creative with analytics-driven marketing at an accessible price.',
  intro: [
    "You're competing against companies with bigger budgets, bigger teams, and a decade of brand equity you don't have yet. What you do have is speed, a sharper point of view, and no legacy to protect.",
    'We build challenger brands that use that. Then we take them to market.',
  ],

  audienceLabel: "Who We're For",
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
    'We make your brand and its assets, from scratch or refreshed from what you have: brand strategy, identity, voice, messaging, website, app. Almost everything in branding and marketing falls into one of four pillars — the four below.',
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
      value: "An incumbent's site is a brochure — everyone already trusts them. Yours has to prove you are real and take the order.",
      price: '$10,000',
    },
    {
      n: '03',
      name: 'Your Marketing Mix',
      items: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Film & Video Production', 'Motion Graphics', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
      value: 'The leader can waste half a budget and never feel it. You cannot, so every dollar is tracked and moved when it is not working.',
      price: '$15,000',
    },
    {
      n: '04',
      name: 'Your Channels',
      items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
      value: 'Nobody is searching for you by name yet, so you go to them — at the volume the platforms demand.',
      price: '$10,000',
      priceSuffix: 'per channel',
    },
  ],

  growPillars: [
    {
      n: '01',
      name: 'Your Brand',
      items: ['Brand Governance', 'Asset Extension', 'Sub-brand Support', 'Guideline Upkeep', 'New Collateral'],
      value: 'The system stays coherent as it stretches into things it was never drawn for.',
    },
    {
      n: '02',
      name: 'Your Website & App',
      items: ['Conversion Optimization', 'Landing Pages', 'A/B Testing', 'New Features', 'Performance', 'Ongoing SEO/AEO'],
      value: 'The site stops being a launch and becomes something you tune every month.',
    },
    {
      n: '03',
      name: 'Your Marketing Mix',
      items: ['Campaign Extensions', 'Paid Media Management', 'Creative Testing', 'Audience Expansion', 'Reporting & Dashboards'],
      value: 'Budget moves toward what is working, on evidence rather than instinct.',
    },
    {
      n: '04',
      name: 'Your Channels',
      items: ['Always-On Content', 'Short-Form Video', 'Community Management', 'Email & SMS', 'Channel Expansion'],
      value: 'The feed keeps moving at the volume the platforms want, without the work getting worse.',
    },
  ],

  growIntro: [
    'We take that brand to market and run it: campaigns, paid media, organic content, and an embedded marketing team, measured and optimized every month.',
  ],
  growTerms: 'Billed quarterly. One-quarter minimum engagement. Media spend is separate and paid directly by you to the platforms.',

  // NOTE ON THE FIGURES: the source table labelled this column "Quarterly
  // rate", but every row is hours-per-month times the effective rate — 25 ×
  // $180 = $4,500, 150 × $140 = $21,000 — which makes them monthly amounts.
  // Read as quarterly, 25 hrs/month for $4,500 would work out at $60/hr and
  // contradict the effective-rate column beside it. They are labelled per
  // month here so the page cannot understate the price threefold; "billed
  // quarterly" is stated in the terms above the grid.
  tiers: [
    { hours: '25', hoursQuarter: '75', hoursYear: '300', month: '$4,500', quarter: '$13,500', year: '$54,000', rate: '$180 / hour' },
    { hours: '50', hoursQuarter: '150', hoursYear: '600', month: '$8,250', quarter: '$24,750', year: '$99,000', rate: '$165 / hour' },
    { hours: '100', hoursQuarter: '300', hoursYear: '1,200', month: '$15,000', quarter: '$45,000', year: '$180,000', rate: '$150 / hour', flag: 'Most common' },
    { hours: '150', hoursQuarter: '450', hoursYear: '1,800', month: '$21,000', quarter: '$63,000', year: '$252,000', rate: '$140 / hour' },
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
  howLabel: 'What You Get',
  howLead: 'A whole department, at the fraction of it you actually use.',
  how: [
    {
      heading: 'Twelve disciplines, one bench.',
      body: 'Creative direction, design, writing, film, motion, engineering, media and search — the full list is below. An in-house team takes years to assemble that, and you would carry all of it every month whether the work called for it or not.',
    },
    {
      heading: 'The same team, from brand to market.',
      body: 'Whoever built the identity runs the campaigns against it. No re-briefing an agency on your own brand, and no handoff between the studio that made the thing and the shop that spends behind it.',
    },
    {
      heading: 'One team reads the work and the numbers.',
      body: 'Creative judgment and marketing analytics in the same people. Nobody translates between the studio that made it and whoever is measuring whether it worked, because they are the same room.',
    },
    {
      heading: 'A department you do not have to hire.',
      body: 'Add a discipline for a launch and drop it after. You are buying hours across the four pillars, not twelve salaries and the hope that the work arrives in the shape you hired for.',
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
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)

  // 'month' | 'quarter' | 'year'. Billing is quarterly, so a quarter is what
  // lands on the invoice; the monthly figure is what people compare against a
  // salary; the annual one is what a budget is approved in. None is the
  // obviously right default, so all three are one click apart.
  const [period, setPeriod] = useState('month')

  const PERIODS = [
    { key: 'month', label: 'Per month', unit: 'hours / month', per: 'per month' },
    { key: 'quarter', label: 'Per quarter', unit: 'hours / quarter', per: 'per quarter' },
    { key: 'year', label: 'Per year', unit: 'hours / year', per: 'per year' },
  ]
  const active = PERIODS.find(x => x.key === period)
  const reelUrl = siteConfig?.reelVideoUrl ?? REEL_FALLBACK
  useMeta({
    title: 'Services | Super Conscious',
    description: 'Brand, website, marketing mix and channels for challenger brands, from $10,000 — plus ongoing support billed hourly. We build the brand, then grow it.',
    path: '/services',
  })

  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>{COPY.eyebrow}</p>
        <h1 className={styles.headline}>{COPY.headline}</h1>
        {/* Closes the hero: the argument, then the work. Same lazy treatment
            as the Proof films — nothing loads until it is on screen. */}
        <div className={styles.reelFrame}>
          <LazyVideo src={reelUrl} className={styles.reelVideo} />
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.audienceLabel}</p>
        <div className={styles.introStack}>
          {[...COPY.intro, COPY.audienceLead].map(para => (
            <p key={para.slice(0, 24)} className={styles.introPara}>{para}</p>
          ))}
        </div>
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
          {COPY.packages.map(({ n, name, items, value, price, priceSuffix }) => (
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
          {COPY.growIntro.map(para => (
            <p key={para.slice(0, 24)} className={styles.bandPara}>{para}</p>
          ))}
        </div>
        <div className={styles.packageList}>
          {COPY.growPillars.map(({ n, name, items, value }) => (
            <div key={n} className={styles.packageCard}>
              <div className={styles.packageMain}>
                <span className={styles.packageN}>{n}</span>
                <p className={styles.packageName}>{name}</p>
                <ul className={styles.packageItems}>
                  {items.map(i => (
                    <li key={i} className={styles.packageItem}>{i}</li>
                  ))}
                </ul>
                <p className={styles.packageValue}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.periodToggle} role="group" aria-label="Show prices per month or per quarter">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`${styles.periodBtn}${period === key ? ' ' + styles.periodBtnOn : ''}`}
              aria-pressed={period === key}
              onClick={() => setPeriod(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.tierGrid}>
          {COPY.tiers.map(({ hours, hoursQuarter, hoursYear, month, quarter, year, rate, flag }) => (
            <div key={hours} className={flag ? styles.tierCardFlagged : styles.tierCard}>
              {/* The badge slot is always rendered, empty or not, so all four
                  cards align on the number rather than the flagged one sitting
                  a line lower than its neighbours. CSS reserves the height, so
                  the empty ones stay out of the accessibility tree. */}
              <span className={styles.tierFlag} aria-hidden={!flag}>{flag}</span>
              {/* Two groups, not four loose lines: what the tier IS (hours)
                  and what it COSTS (price over its effective rate, which is
                  the argument for stepping up). The line naming how many
                  pillars each tier bought is gone — four cards side by side
                  already answer that, and the hours are the comparison. */}
              <div className={styles.tierId}>
                <p className={styles.tierHours}>{{ month: hours, quarter: hoursQuarter, year: hoursYear }[period]}</p>
                <p className={styles.tierUnit}>{active.unit}</p>
              </div>
              <div className={styles.tierMoney}>
                <p className={styles.tierPrice}>{{ month, quarter, year }[period]}</p>
                <p className={styles.tierRate}>{active.per} · {rate}</p>
              </div>
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

      {/* The same block the homepage closes on. Its own subject and request
          type, so a services enquiry is not filed as whatever the homepage
          files. */}
      <ContactCTA
        label={COPY.ctaLabel}
        sub={COPY.ctaSub}
        subject="Pricing request from super-conscious.studio"
        requestType="pricing"
      />

    </main>
  )
}

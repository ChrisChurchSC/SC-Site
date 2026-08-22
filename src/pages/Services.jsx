import styles from './Services.module.css'
import { useMeta } from '../hooks/useMeta'
import EmailCaptureForm from '../components/EmailCaptureForm'
import { useSanity } from '../hooks/useSanity'
import { ABOUT_PAGE_QUERY } from '../lib/queries'

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
const COPY = {
  eyebrow: '[ Services ]',
  headline: "For brands that don't have incumbent money — and don't need it.",
  intro: [
    "You're competing against companies with bigger budgets, bigger teams, and a decade of brand equity you don't have yet. What you do have is speed, a sharper point of view, and no legacy to protect.",
    'We build brands that use that. Then we take them to market.',
    "Most of the brands who come to us assumed this level of work was out of reach — that agency-caliber branding, film, and media management was something you graduated into after a raise or a good year. It isn't. Our infrastructure is lean, our scoping is flexible, and our media fee is flat, so the work costs what the work costs.",
  ],
  // The one intro line that names the two halves, split so the weight lands on
  // the two words the rest of the page is organised around.
  introOffer: {
    lead: 'Two ways to work with us: ',
    build: 'Build',
    mid: ' and ',
    grow: 'Grow',
    rest: '. Most clients do a mix of both. Nothing here is off the shelf — every recommendation is scoped to your goals, your budget, and your timeline.',
  },

  audienceLabel: "Where You're Starting",
  audienceLead: 'Most of the brands we work with arrive in one of three situations. Find yours — it determines what we scope first.',
  audience: [
    {
      name: 'New',
      definition: 'A brand that needs to be defined from scratch: identity, visual system, voice.',
      body: 'Nothing to protect and nothing to unwind. The advantage is that every decision is still available to you; the risk is making them in the wrong order. We start with positioning, then build the system outward.',
      startsWith: 'Your Brand',
    },
    {
      name: 'Pivoting',
      definition: 'An existing brand reworking what it has. A facelift, or a full-scale overhaul to retain and amplify relevancy.',
      body: "You have equity worth keeping and baggage worth dropping, and the hard part is telling them apart. We audit what's actually load-bearing before we touch anything.",
      startsWith: 'Your Brand → Your Website & App',
    },
    {
      name: 'Underdog',
      definition: 'A brand in a crowded category that needs to stand out.',
      body: "The category has conventions, and the leader wrote them. Blending in is the default failure. We find the position your competitors can't copy without contradicting themselves, then put weight behind it.",
      startsWith: 'Your Marketing Mix → Your Channels',
    },
  ],

  // The two halves of the offer, each opened by a band in the homepage intro
  // card's style: name on the left, its one-line definition right-aligned.
  buildBand: { name: 'Build', text: 'Project-based,\nscoped specifically.' },
  growBand: { name: 'Grow', text: 'Ongoing support,\nbilled hourly.' },

  buildIntro: [
    "Typically one-time engagements: you build a brand, you build a website. But brands aren't static. When you launch a new offering and your positioning suddenly feels a half-step behind, we're here for the refresh.",
    "Almost everything in branding and marketing falls into one of four pillars. Don't see what you need? Ask — our capabilities run deep, and if we can't help, we probably know who can.",
    'The starting prices below are real starting prices, not anchors designed to make a conversation necessary. Most brands are surprised by them.',
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

  growIntro: 'With the brand and marketing apparatus in good shape, we pivot toward optimizations, extensions, additions, and whatever else you need as you engage your audience.',
  growTerms: 'Billed quarterly. One-quarter minimum engagement. Media spend is separate and paid directly by you to the platforms.',
  growFee: {
    lead: 'Our media management fee is flat — never a percentage of your buy.',
    rest: ' Scale your spend without scaling what you pay us to manage it.',
  },

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

  proofLabel: 'Proof',
  proofLead: 'What Build → Grow looks like in practice.',
  proof: [
    { name: 'iScribe', body: 'Came to us for a website. We sold in branding, marketing, and ongoing channel support, including for their conference season.' },
    { name: 'Arbitrum', body: 'Came to us for a campaign, which was subsequently adopted and adapted across their key channels, including Meta, LinkedIn, and X.' },
  ],

  povLabel: 'Our Point of View',
  pov: [
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
  const cfg = data ?? {}
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
          <p className={styles.introPara}>
            {COPY.introOffer.lead}
            <strong className={styles.introStrong}>{COPY.introOffer.build}</strong>
            {COPY.introOffer.mid}
            <strong className={styles.introStrong}>{COPY.introOffer.grow}</strong>
            {COPY.introOffer.rest}
          </p>
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.audienceLabel}</p>
        <p className={styles.sectionLead}>{COPY.audienceLead}</p>
        <div className={styles.audienceGrid}>
          {COPY.audience.map(({ name, definition, body, startsWith }) => (
            <div key={name} className={styles.audienceCard}>
              <p className={styles.audienceName}>{name}</p>
              <p className={styles.audienceDefinition}>{definition}</p>
              <p className={styles.audienceBody}>{body}</p>
              {/* Pushed to the foot of the card so the three routes line up
                  across the row and can be compared without reading all
                  three cards top to bottom. */}
              <p className={styles.audienceStarts}>
                <span className={styles.audienceStartsLabel}>Usually starts with</span>
                {startsWith}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>What We Do</p>

        <div className={styles.band}>
          <p className={styles.bandName}>{COPY.buildBand.name}</p>
          <p className={styles.bandText}>{COPY.buildBand.text}</p>
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
                {/* Joined rather than a <ul>: these read as one line of scope,
                    not as a checklist, and the middot is the separator the
                    client wrote them with. */}
                <p className={styles.packageItems}>{items.join(' · ')}</p>
                {value && <p className={styles.packageValue}>{value}</p>}
                {note && <p className={styles.packageNote}>{note}</p>}
              </div>
              <div className={styles.packagePrice}>
                <span className={styles.packagePriceLabel}>Starting at</span>
                <span className={styles.packagePriceValue}>{price}</span>
                {priceSuffix && <span className={styles.packagePriceSuffix}>{priceSuffix}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.band}>
          <p className={styles.bandName}>{COPY.growBand.name}</p>
          <p className={styles.bandText}>{COPY.growBand.text}</p>
        </div>
        <div className={styles.bandBody}>
          <p className={styles.bandPara}>{COPY.growIntro}</p>
          <p className={styles.growTerms}>{COPY.growTerms}</p>
          {/* The flat fee is the differentiator in this half of the offer, so
              it carries its own weight rather than sitting inside the terms
              paragraph, where it would read as one more piece of small print. */}
          <p className={styles.growFee}>
            <strong className={styles.growFeeLead}>{COPY.growFee.lead}</strong>
            {COPY.growFee.rest}
          </p>
        </div>
        <div className={styles.tierGrid}>
          {COPY.tiers.map(({ hours, price, rate, body, flag }) => (
            <div key={hours} className={flag ? styles.tierCardFlagged : styles.tierCard}>
              {/* The badge slot is always rendered, empty or not, so all four
                  cards align on the number rather than the flagged one sitting
                  a line lower than its neighbours. CSS reserves the height, so
                  the empty ones stay out of the accessibility tree. */}
              <span className={styles.tierFlag} aria-hidden={!flag}>{flag}</span>
              <p className={styles.tierHours}>{hours}</p>
              <p className={styles.tierUnit}>hours / month</p>
              <p className={styles.tierPrice}>{price}</p>
              <p className={styles.tierRate}>{rate}</p>
              <p className={styles.tierBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.proofLabel}</p>
        <p className={styles.sectionLead}>{COPY.proofLead}</p>
        <div className={styles.proofGrid}>
          {COPY.proof.map(({ name, body }) => (
            <div key={name} className={styles.proofCard}>
              <p className={styles.proofName}>{name}</p>
              <p className={styles.proofBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.povLabel}</p>
        <div className={styles.embeddedGrid}>
          {COPY.pov.map(({ heading, body }, i) => (
            <div key={heading} className={styles.embeddedPoint}>
              <span className={styles.embeddedN}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.embeddedHeading}>{heading}</p>
              <p className={styles.embeddedBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {cfg.roles?.length > 0 && (
        <section className={styles.textSection}>
          <p className={styles.sectionLabel}>{cfg.rolesLabel || 'Roles'}</p>
          {cfg.rolesIntro && <p className={styles.rolesIntro}>{cfg.rolesIntro}</p>}
          <div className={styles.rolesGrid}>
            {cfg.roles.map(r => {
              const name = typeof r === 'string' ? r : r.name
              const description = typeof r === 'string' ? null : r.description
              return (
                <div key={name} className={styles.roleCard}>
                  <p className={styles.roleName}>{name}</p>
                  {description && <p className={styles.roleDesc}>{description}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

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

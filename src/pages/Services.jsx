import styles from './Services.module.css'
import { useMeta } from '../hooks/useMeta'
import EmailCaptureForm from '../components/EmailCaptureForm'
import { useSanity } from '../hooks/useSanity'
import { ABOUT_PAGE_QUERY } from '../lib/queries'

/**
 * The positioning copy, in code on purpose.
 *
 * This is the studio's own argument for itself — its mission, who it is for,
 * and its point of view. It is not editorial content that
 * changes week to week, and it only works as a whole: a half-edited
 * positioning statement is worse than none, and a CMS field invites exactly
 * that. It also renders without a network call, so crawlers and the SSG get
 * the real page rather than a shell waiting on Sanity.
 *
 * What stays in Sanity is what genuinely churns: the Build/Grow deliverables,
 * the discipline list, the FAQ, and the pricing block. See the note on the
 * component below for how the two halves meet.
 */
const COPY = {
  eyebrow: '[ Services ]',
  // The positioning statement verbatim, carrying the whole hero. Long for an
  // h1, and deliberately so: it is the one place the page states who it is for
  // and what it does in a single breath.
  headline: 'For challenger brands — new, pivoting, or fighting to stand out — who are ready to accelerate their business, Super-Conscious is the embedded creative and marketing team that builds your brand and then grows it.',

  audienceLabel: "Who We're For",
  audience: [
    { name: 'New', body: 'A brand that needs defining from scratch: identity, visual system, voice.' },
    { name: 'Pivoting', body: 'An existing brand reworking what it has. A facelift, or a full overhaul to retain and amplify relevance.' },
    { name: 'Underdog', body: 'A brand in a crowded category that needs to stand out.' },
  ],


  // The two halves of the offer, each introduced by a band in the homepage
  // intro card's style: name on the left, definition right-aligned in mono.
  // The definitions are the client's own Build/Grow lines from the module
  // spec, the same copy the homepage two-up carries.
  buildBand: {
    name: 'Build',
    text: 'We make your brand and its assets:\nfrom scratch, or refreshed from what you have.',
  },
  growBand: {
    name: 'Grow',
    text: 'We take that brand to market and run it:\ncampaigns, paid media, content, an embedded team.',
  },

  // What We Do, as the offer is actually sold: four packages, each with its
  // deliverable list and an entry price. This replaced the Build/Grow pair and
  // the nine outcome cards, both of which described the work without ever
  // saying what it costs.
  packages: [
    {
      n: '01',
      name: 'Your Brand',
      items: ['New Brand', 'Rebrand', 'Brand Refresh', 'Sub-brand', 'Brand Guidelines', 'Product Positioning'],
      price: '$15,000',
    },
    {
      n: '02',
      name: 'Your Website & App',
      items: ['Brochure Website', 'Microsite', 'Landing Pages', 'Ecom Site', 'Mobile App', 'Web App', 'SEO/AEO', 'Development', 'Integrations', 'Analytics', 'Deployment'],
      price: '$10,000',
    },
    {
      n: '03',
      name: 'Your Marketing Mix',
      items: ['Audience Architecture', 'Launch Campaign Strategy & Concept', 'Always-On Campaign Strategy & Concept', 'Conference & Event Strategy & Execution', 'Partnerships', 'Paid Media Strategy & Execution', 'Dashboards'],
      note: 'Covers initial marketing set-up and the initial flighting of any campaigns. Campaign extensions and subsequent campaign work billed separately. All production costs are billed separately.',
      price: '$15,000',
    },
    {
      n: '04',
      name: 'Your Channels',
      items: ['Meta', 'LinkedIn', 'TikTok', 'YouTube', 'X', 'Reddit', 'Email', 'SMS'],
      note: 'Covers initial channel set-up and two months of organic content.',
      price: '$10,000',
      priceSuffix: 'per channel',
    },
  ],

  // The other half of the money: the four packages above are the build, this
  // is what it costs to keep it running afterwards. Rates fall as the
  // commitment rises, so the tiers are shown with their per-hour figure rather
  // than only the monthly one — that is the whole argument for the bigger tier.
  growIntro: 'With the brand and marketing apparatus in good shape, we can pivot our focus towards optimizations, extensions, additions, and anything else you might need as you engage with your audience.',
  tiers: [
    { hours: '25', price: '$4,500', rate: '$180 per hour', body: 'Focus on one pillar to keep things current.' },
    { hours: '50', price: '$8,250', rate: '$165 per hour', body: 'Focus on two pillars to ensure things are running properly across your most important channels.' },
    { hours: '100', price: '$15,000', rate: '$150 per hour', body: 'Focus on three pillars, every month, for a comprehensive view of performance and quick optimizations.', flag: 'Most common' },
    { hours: '150', price: '$21,000', rate: '$140 per hour', body: 'Focus on all four pillars, the most robust support for optimal brand oversight, maintenance, and seamless evolution.' },
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

  mission: 'We exist to level up challenger brands: world-class creative and analytics-driven marketing, at a price that is actually accessible.',
}

/**
 * The Sanity-backed half, and the only fields still read from the CMS.
 *
 * Object-level fallback, so this substitutes only when Sanity returns nothing
 * at all. That is the whole reason the positioning copy above is not in here:
 * Sanity does answer, so a value in this object would never render.
 */
const FALLBACK = {
  pricingLabel: "Let's build together.",
  pricingSub: "Drop your email and we'll send over rates and availability.",
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
 * the content is kept.
 *
 * The page reads FOUR things from that document — services, roles, faqs, and
 * the pricing pair. Everything else on screen comes from COPY above. The
 * fields that used to drive the header and the three-up (`headerLabel`,
 * `intro`, `embeddedPoints`, `servicesIntro`) were dropped from the query and
 * the schema in the same change, rather than merely left unread: a field an
 * editor can still fill in, that no longer reaches the page, is a trap. Their
 * stored values are untouched in Sanity if any of this needs reverting.
 */
export default function Services() {
  const { data } = useSanity(ABOUT_PAGE_QUERY)
  const cfg = data ?? FALLBACK
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
    description: 'An embedded creative and marketing team for challenger brands. We build your brand — identity, voice, web — then grow it with content and paid media.',
    path: '/services',
    schema: faqSchema,
  })

  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>{COPY.eyebrow}</p>
        <h1 className={styles.headline}>{COPY.headline}</h1>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{COPY.audienceLabel}</p>
        <div className={styles.audienceGrid}>
          {COPY.audience.map(({ name, body }) => (
            <div key={name} className={styles.audienceCard}>
              <p className={styles.audienceName}>{name}</p>
              <p className={styles.audienceBody}>{body}</p>
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
        <div className={styles.packageList}>
          {COPY.packages.map(({ n, name, items, note, price, priceSuffix }) => (
            <div key={n} className={styles.packageCard}>
              <div className={styles.packageMain}>
                <span className={styles.packageN}>{n}</span>
                <p className={styles.packageName}>{name}</p>
                {/* Joined rather than a <ul>: these read as one line of scope,
                    not as a checklist, and the middot is the separator the
                    client wrote them with. */}
                <p className={styles.packageItems}>{items.join(' · ')}</p>
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
        <p className={styles.growIntro}>{COPY.growIntro}</p>
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

      {/* The three-up that used to be "Embedded Partnership", carrying the
          point of view instead. Same numbered treatment, so the audience grid
          above stays visually distinct from it — two identically-styled
          three-ups on one page read as a template rather than an argument. */}
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
          {/* The mission sits here rather than in the header. "At an accessible
              price" is a claim that pays off where the ask happens; at the top
              of the page it would spend the headline on internal language. */}
          <p className={styles.pricingMission}>{COPY.mission}</p>
          <p className={styles.pricingLabel}>{cfg.pricingLabel}</p>
          <p className={styles.pricingSub}>{cfg.pricingSub}</p>
          <EmailCaptureForm
            styles={styles}
            submitLabel="Get rates →"
            confirmMessage="Thanks — we'll send rates over shortly."
            subject="Pricing request from super-conscious.studio"
            requestType="pricing"
          />
        </div>
      </section>

    </main>
  )
}

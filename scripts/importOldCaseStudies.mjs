import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = Object.fromEntries(
  readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const client = createClient({
  projectId: env.VITE_SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: env.VITE_SANITY_TOKEN,
  useCdn: false,
})

const key = () => randomBytes(6).toString('hex')

const CONTENT = {
  'arbitrum-openhouse': {
    tagline: 'Creating a launchpad for every Arbitrum builder.',
    summary: 'Arbitrum: Open House is a builder-first initiative designed to welcome new developers into the Arbitrum ecosystem and guide them from idea to launch. We partnered with the Arbitrum team to create the entire foundation for the program: naming and branding, the website, and social assets. The goal was to make Open House feel approachable yet aspirational, giving builders a clear reason to get involved and the confidence to take the next step. Our work combined a bold, event-ready identity with a flexible digital presence that could scale across channels.',
    services: ['Branding', 'Website', 'Character Design', 'Illustration Toolkit'],
    outcomes: [
      { category: 'Visibility', outcome: 'Branding, website, and social content helped drive significant awareness and registrations for the inaugural event.' },
      { category: 'Sign-Up Flow', outcome: 'Website design streamlined the registration process, reducing friction and increasing completed sign-ups.' },
      { category: 'Social Engagement', outcome: 'Campaign visuals and messaging elevated interaction rates across Arbitrum’s social channels during launch.' },
    ],
  },

  'arbitrum-marketing-dept-videos': {
    tagline: 'Turning crypto conversation into community participation.',
    summary: 'To launch Arbitrum’s Kaito Leaderboard, we created a high-energy announcement video that broke down the mechanics, sparked community engagement, and helped drive one of the protocol’s top-performing campaigns. Built around the idea of "Yap-to-Earn," the campaign rewarded creators for driving conversation around Arbitrum across socials. We helped turn a complex program into a clear, compelling story, scripting and producing a launch video that introduced the leaderboard, explained monthly themes, and invited the community to participate.',
    services: ['Motion', 'Social Video', 'Script'],
    outcomes: [
      { category: 'High Engagement', outcome: 'One of Arbitrum’s best-performing videos across social, helping drive strong awareness and onboarding for the campaign.' },
      { category: 'Clarity', outcome: 'Made the leaderboard mechanics clear, exciting, and accessible through visual storytelling.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Campaign', body: 'The result was one of Arbitrum’s most-watched campaign videos to date, blending clarity, creativity, and on-brand energy to fuel one of the year’s most engaging initiatives.' },
    ],
  },

  'world-within': {
    tagline: 'Bringing a World Within to life.',
    summary: 'World Within is a mission-driven platform building a fairer future through capital, culture, and community. They fund innovative companies, produce powerful stories, and convene communities to spark systems change that serves people and planet alike.',
    services: ['Brand Identity', 'Website', 'Animation', 'Marketing Strategy', 'Social'],
    outcomes: [
      { category: 'Business Impact', outcome: 'We launched a cohesive brand identity and website to give World Within a strong foundation. The brand built credibility with investors and partners and extended its reach through social media and storytelling.' },
      { category: 'Scalable Presence', outcome: 'Our work unified the brand across digital, social, and community channels. With a clear marketing strategy and flexible system, World Within is positioned for long-term growth and future campaigns.' },
      { category: 'Marketing Strategy', outcome: 'We developed a marketing strategy that aligned World Within’s mission with its audience, providing a clear roadmap for digital channels, social content, and campaigns.' },
    ],
  },

  'banzen': {
    tagline: 'A dispensary brand rooted in Coldwater, Michigan.',
    summary: 'Banzen is a cannabis dispensary built on the idea that cannabis can be premium, approachable, and rooted in community. Inspired by the role of a trail guide, Banzen acts as a specialist who helps customers navigate with confidence. They partnered with us to build a brand and website that brought this perspective to life while setting them apart from competitors.',
    services: ['Brand Identity', 'Website', 'Digital Assets'],
    outcomes: [
      { category: 'Local Relevance', outcome: 'Designed a brand identity that drew inspiration from Coldwater, Michigan, making the dispensary feel rooted in place and connected to its community.' },
      { category: 'Digital Experience', outcome: 'Created a clear, intuitive website that made it easy for customers to explore products, order online, and understand Banzen’s offerings.' },
      { category: 'Brand Perception', outcome: 'Positioned Banzen as a premium, trustworthy dispensary through a cohesive identity and digital presence that stood apart from competitors.' },
    ],
  },

  'path-projects': {
    tagline: 'Building a motion system for a fast-moving running brand.',
    summary: 'We partnered with Path Projects, a premium running apparel brand, to create a flexible animation toolkit that could scale across their digital platforms. The challenge was to maintain Path’s clean, distinctive aesthetic while giving their team the ability to quickly roll out motion content for campaigns, social channels, and email without reinventing assets each time.',
    services: ['Animation Toolkit', 'Social Templates', 'Campaign Assets'],
    outcomes: [
      { category: 'Faster Production', outcome: 'Modular motion assets the team could adapt and repurpose, keeping production fast while ensuring every piece felt consistent and premium.' },
      { category: 'Brand Expression', outcome: 'Built a flexible system of motion templates that kept every piece of content aligned with Path Projects’ premium, minimalist aesthetic.' },
      { category: 'Scalable Storytelling', outcome: 'Enabled the team to adapt and repurpose assets across social, web, and email, giving them a foundation to grow their marketing without extra strain.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The System', body: 'Our solution was a modular system of animated typography, product treatments, and branded transitions. The toolkit gave Path’s team a library of motion assets they could adapt and repurpose, keeping production fast while ensuring every piece of content felt consistent and premium.' },
      { heading: 'The Result', body: 'A streamlined creative process that saved time, strengthened brand cohesion, and gave Path Projects the ability to scale their storytelling with confidence.' },
    ],
  },

  'photon': {
    tagline: 'Rewriting the prescription network around people, not paperwork.',
    summary: 'Photon Health is a digital prescription platform that gives patients more choice, providers more efficiency, and healthcare teams more control. We partnered with Photon to lead a full rebrand and redesign of their marketing site, helping reposition them as a modern, patient-first alternative to legacy e-prescribing systems. The new brand balances technical credibility with human clarity, making Photon feel as intuitive and transparent as the experience it delivers.',
    services: ['Branding', 'Marketing Site', 'Messaging', 'Illustration Toolkit'],
    outcomes: [
      { category: 'Conversion Confidence', outcome: 'The redesigned marketing site made Photon’s value proposition clearer to both providers and partners, supporting faster decision-making.' },
      { category: 'Message Clarity', outcome: 'New brand messaging simplified a complex product story, helping audiences immediately understand what Photon does and why it matters.' },
      { category: 'Brand Perception', outcome: 'The rebrand positioned Photon as a modern, trustworthy healthcare partner, balancing technical credibility with patient-first clarity.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Work', body: 'From visual identity and messaging to UX and site design, our work helped clarify Photon’s value to both providers and partners, laying the foundation for broader adoption, stronger enterprise positioning, and future growth.' },
    ],
  },

  'print-parlor': {
    tagline: 'Creating a merch platform where quality comes first.',
    summary: 'Print Parlor is a custom merch company focused on making high-quality, design-led products for brands, artists, and everyday creators. We partnered with the team to build a brand that matched the craft of their work: thoughtful, elevated, and built to last. From a bold visual identity to a clean, conversion-focused website, we helped shape a business that treats merch like a creative medium, not just a transaction.',
    services: ['Branding', 'Marketing Site', 'Paid Social'],
    outcomes: [
      { category: 'Conversion Clarity', outcome: 'Redesigned the website experience to better guide users from product exploration to quote requests, supporting early sales and inbound growth.' },
      { category: 'Brand Perception', outcome: 'Positioned Print Parlor as a high-quality, design-forward merch partner, helping attract larger, design-savvy clients from launch.' },
      { category: 'Launch Execution', outcome: 'Delivered a full brand and marketing system that enabled Print Parlor to launch smoothly and start selling within weeks.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Product', body: 'Whether it’s soft-touch tees, embroidered hats, or fully custom pieces, Print Parlor puts quality and creativity front and center. Our work gave them a brand that looks as good as their product feels, and a platform to grow from.' },
    ],
  },

  'gigs': {
    tagline: 'Building a trusted brand in the gig economy.',
    summary: 'Gigs is a job platform built to make finding local gig work seamless, efficient, and empowering. With an intuitive interface, Gigs provides clear job descriptions, pay comparisons, and reviews from other workers, plus smart filters and helpful resources to make the search simple and effective. Whether you’re after flexibility, extra income, or your next big opportunity, Gigs helps you quickly connect with the best options in your area.',
    services: ['Brand Identity', 'Messaging', 'Product UI', 'Marketing'],
    outcomes: [
      { category: 'Funding', outcome: 'Three rounds of funding raised since launch, with the brand and product playing a central role in investor confidence.' },
      { category: 'User Engagement', outcome: 'Over 5 million job applications started and 200k completions, with users praising the platform’s transparency and approachable design.' },
      { category: 'Market Position', outcome: 'Positioned as a trusted leader in the gig economy, with a polished, user-first experience and a brand people could trust and love.' },
    ],
  },

  'gigs-content': {
    tagline: 'Designing a gig economy that looks like everyone.',
    summary: 'To help Gigs bring its platform to life, we created a library of 100 custom character illustrations representing the full spectrum of job types available on the platform: from dog walkers and delivery drivers to baristas and freelance designers. Each illustration was designed to be vibrant, inclusive, and instantly recognizable, helping users feel seen and represented while making the platform more engaging and human-centered. The collection now serves as a visual backbone across Gigs’ product, marketing, and social channels.',
    services: ['Character Design', 'Illustration Toolkit'],
    outcomes: [
      { category: 'Engagement', outcome: 'Character illustrations made job categories more scannable and visually engaging for users.' },
      { category: 'Clarity', outcome: 'Visualizing job types helped users quickly identify roles that matched their interests and experience.' },
      { category: 'Brand Personality', outcome: 'The illustrations added warmth, inclusivity, and personality, making the platform feel more relatable and human-centered.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Library', body: 'A library of 100 custom character illustrations representing the full spectrum of job types available on the Gigs platform.' },
    ],
  },

  'smallhold': {
    tagline: 'Growing the nation’s most recognizable mushroom brand.',
    summary: 'Smallhold is a mushroom company redefining how specialty produce is grown, distributed, and enjoyed, with sustainable, tech-enabled farms placed directly in urban environments. We’ve partnered with Smallhold since day one, helping shape the brand from its earliest stages to its nationwide retail success. Our work has spanned every step of their journey: developing the original brand identity and packaging system, designing investor decks, marketing content, product storytelling, and digital experiences.',
    services: ['Brand Identity', 'Packaging', 'Website', 'Illustration Toolkit', 'Marketing', 'Social'],
    outcomes: [
      { category: 'Retail Expansion', outcome: 'Expanded from local markets to nationwide retail, including placement in every Whole Foods across the U.S.' },
      { category: 'Brand Growth', outcome: 'Helped scale from early-stage startup to household name in specialty produce, with distinctive presence in hundreds of stores.' },
      { category: 'Sustained Partnership', outcome: 'Supported multi-year growth, evolving the brand across packaging, marketing, and storytelling as the business matured.' },
    ],
  },

  'tbt': {
    tagline: 'Bringing scientific rigor to the future of dermatology.',
    summary: 'TBT Pharma is a clinical-stage dermatology company developing novel topical therapies by repurposing proven treatments. We partnered with the founding team to bring clarity and credibility to their early-stage story: developing a brand identity, investor deck, and marketing site that positioned TBT as a serious player in the clinical dermatology space.',
    services: ['Brand Identity', 'Investor Deck', 'Marketing Site'],
    outcomes: [
      { category: 'Investor Readiness', outcome: 'Delivered a clear, compelling pitch deck that helped TBT communicate scientific rigor and commercial potential to early-stage investors.' },
      { category: 'Scientific Credibility', outcome: 'Developed a brand and website that gave TBT the polish and professionalism needed to compete in a highly technical, trust-driven space.' },
    ],
  },

  'heard': {
    tagline: 'Elevating user research with AI-powered insights.',
    summary: 'Heard is an AI-powered interview platform that helps product teams capture user insights faster, more accurately, and with less effort. With an intuitive interface, Heard automates interviews and transcriptions while surfacing key trends and actionable insights. Its clear analytics and approachable design empower teams to deeply understand their users and design products that resonate.',
    services: ['Brand Identity', 'Product UI', 'Marketing'],
    outcomes: [
      { category: 'Launch', outcome: 'Successfully launched MVP, with the platform earning praise for its transparency, efficiency, and user-centered approach.' },
      { category: 'Credibility', outcome: 'Established credibility in the UX research space and positioned Heard as a next-gen research tool.' },
      { category: 'Traction', outcome: 'Enabled early traction and investor confidence through a trustworthy, human-centered brand and seamless product experience.' },
    ],
  },

  'industry-standard': {
    tagline: 'Rebuilding a denim essential from the ground up.',
    summary: 'Industry Standard is a direct-to-consumer denim brand known for its clean fits, accessible pricing, and everyday essentials. We partnered with the team to lead a full-scale rebrand that honored the simplicity of the original while sharpening every detail for a more elevated and enduring presence. From custom hardware and refreshed typography to updated packaging, product photography, and a redesigned website, we helped evolve the brand’s visual and verbal identity across every touchpoint.',
    services: ['Brand Identity', 'Packaging', 'Website', 'Social'],
    outcomes: [
      { category: 'Business Impact', outcome: 'Refreshed brand system rolled out across 100% of customer touchpoints, from packaging to e-commerce.' },
      { category: 'User Experience', outcome: 'Improved product clarity and storytelling led to a more cohesive online shopping experience.' },
      { category: 'Positioning', outcome: 'Rebrand helped reposition Industry Standard as a premium everyday essential, without losing its minimalist roots.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Result', body: 'A brand that feels more intentional, more cohesive, and better positioned to grow, all while staying true to its no-fuss, quality-first ethos.' },
    ],
  },

  'transcend': {
    tagline: 'Crafting a breakthrough neuroscience brand to market.',
    summary: 'Transcend Therapeutics is a neuroscience-focused biotech company developing breakthrough treatments for PTSD and other neuropsychiatric conditions. With a science-first approach and a strong clinical pipeline, Transcend needed a brand that could communicate credibility to investors, clarity to partners, and purpose to prospective hires. We worked closely with their founding team to build a cohesive brand identity, develop fundraising and recruitment materials, and design a website that brought their mission to life.',
    services: ['Brand Identity', 'Messaging', 'Website', 'Social', 'Marketing'],
    outcomes: [
      { category: 'Business Impact', outcome: 'Successfully launched MVP, supported multiple fundraising rounds, and built early credibility with investors and researchers.' },
      { category: 'Scalable Presence', outcome: 'Aligned brand with clinical mission and positioned the company for long-term scientific traction.' },
      { category: 'Growth', outcome: 'Supported early growth and team expansion as Transcend scaled toward clinical milestones.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Foundation', body: 'From visual systems to messaging frameworks, our work helped lay the foundation for Transcend’s public presence, ensuring every touchpoint felt focused, trustworthy, and aligned with the company’s vision.' },
    ],
  },

  'yura': {
    tagline: 'Redefining the healthcare benefits experience.',
    summary: 'YURA is an AI-powered healthcare benefits platform helping employers reduce costs while empowering employees to make smarter care decisions. We partnered with YURA from the ground up, working across product development, branding, and marketing to help bring their vision to life. From shaping the product UX to defining the brand identity and building out investor materials, we acted as an embedded creative and strategic partner during their earliest stages.',
    services: ['Brand Identity', 'Product Design', 'Website', 'Illustration Toolkit', 'Marketing', 'Social'],
    outcomes: [
      { category: 'Business Impact', outcome: 'Helped launch from concept to product, including full brand, platform, and go-to-market strategy.' },
      { category: 'Product Development', outcome: 'Designed a seamless, user-friendly interface that simplifies complex healthcare choices and supports cost-saving navigation.' },
      { category: 'Growth Enablement', outcome: 'Developed foundational content and campaigns across web, pitch, and social, helping position YURA for early-stage adoption and fundraising.' },
    ],
    sectionsIfEmpty: [
      { heading: 'The Engagement', body: 'Our work included product design, naming, messaging, visual identity, website, pitch decks, social content, and ongoing marketing strategy. Together, we helped YURA turn a complex space into a clear, human-first experience that resonates with both employers and employees, and positioned the company to grow with clarity and confidence.' },
    ],
  },
}

// Sanity check: no em dashes
for (const [slug, c] of Object.entries(CONTENT)) {
  const all = JSON.stringify(c)
  if (all.includes('—')) {
    console.error(`⚠  em dash found in ${slug}`)
    process.exit(1)
  }
}
console.log('Em-dash check passed.')

const existing = await client.fetch(`*[_type == "project" && slug.current in $slugs]{_id, "slug": slug.current, "hasSections": defined(sections) && count(sections) > 0}`, { slugs: Object.keys(CONTENT) })
const docBySlug = new Map(existing.map(d => [d.slug, d]))

const missing = Object.keys(CONTENT).filter(s => !docBySlug.has(s))
if (missing.length) {
  console.error(`Missing Sanity docs: ${missing.join(', ')}`)
  console.error(`Run syncSanityProjects (or add Yura to projects.js) first.`)
  process.exit(1)
}

console.log(`\nWill patch ${existing.length} docs.`)
const toAddSections = existing.filter(d => CONTENT[d.slug].sectionsIfEmpty && !d.hasSections)
console.log(`Will add text sections to ${toAddSections.length} empty docs: ${toAddSections.map(d => d.slug).join(', ')}`)

if (!process.argv.includes('--apply')) {
  console.log(`\nDry run. Re-run with --apply.`)
  process.exit(0)
}

let tx = client.transaction()
for (const [slug, c] of Object.entries(CONTENT)) {
  const doc = docBySlug.get(slug)
  const set = {
    tagline: c.tagline,
    summary: c.summary,
    services: c.services,
    outcomes: c.outcomes.map(o => ({ _key: key(), _type: 'object', category: o.category, outcome: o.outcome })),
  }
  if (c.sectionsIfEmpty && !doc.hasSections) {
    set.sections = c.sectionsIfEmpty.map(s => ({
      _key: key(),
      _type: 'textSection',
      heading: s.heading,
      body: s.body,
    }))
  }
  tx = tx.patch(doc._id, { set })
}
await tx.commit()
console.log(`\nPatched ${existing.length} docs.`)

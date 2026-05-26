import { useEffect, useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'
import styles from './Capabilities.module.css'

// ── Packages ─────────────────────────────────────────────────────────────
const PACKAGES = [
  {
    id: 'nurture-engine',
    name: 'Nurture Engine',
    goal: 'Keep aware prospects engaged until they are ready to buy.',
    price: '$14,000',
    deliverables: [
      { icon: 'strategy', label: 'Social Strategy' },
      { icon: 'posts',    label: '12 Static Posts' },
      { icon: 'video',    label: '6 Short-Form Videos' },
      { icon: 'email',    label: 'Email Series' },
    ],
    target: 'Nurture',
    flow: [
      { icon: 'person', label: 'Unaware',   sub: 'No relationship with the brand',       deliverables: [] },
      { icon: 'eye',    label: 'Aware',     sub: 'Knows the brand, not yet ready',        deliverables: ['Social Strategy', '12 Static Posts'] },
      { icon: 'click',  label: 'Engaged',   sub: 'Opening emails, following socials',     deliverables: ['6 Short-Form Videos'] },
      { icon: 'search', label: 'Considered',sub: 'Comparing you to alternatives',         deliverables: ['Email Series'] },
      { icon: 'check',  label: 'Ready',     sub: 'Willing to take a meeting',             deliverables: [] },
    ],
    metrics: ['Email open rate', 'CTR', 'Social engagement', 'MQL velocity'],
    mediaSpend: 'Not required',
    cadence: 'Refresh every 6 months',
    who: 'B2B companies with 3-12 month sales cycles and prospects who know you but are not yet ready to act.',
    have: 'A consistent content cadence that keeps your brand present across social and email without relying on paid spend.',
  },
  {
    id: 'always-on',
    name: 'Always-On Demand Engine',
    goal: 'Continuous demand creation: ads, social, email, and video on a monthly cadence.',
    price: '$20,000/mo',
    deliverables: [
      { icon: 'ads',   label: 'Ad Production' },
      { icon: 'posts', label: '12 Static Posts' },
      { icon: 'email', label: 'Email Series' },
      { icon: 'video', label: '6 Short-Form Videos' },
    ],
    target: 'Demand',
    flow: [
      { icon: 'signal',   label: 'Reached',    sub: 'Sees the brand in feed or search', deliverables: ['Ad Production', '12 Static Posts'] },
      { icon: 'eye',      label: 'Interested', sub: 'Pauses, clicks, watches',          deliverables: ['6 Short-Form Videos'] },
      { icon: 'click',    label: 'Engaged',    sub: 'Follows, subscribes, returns',     deliverables: ['Email Series'] },
      { icon: 'calendar', label: 'Booked',     sub: 'Requests a demo or intro call',   deliverables: [] },
    ],
    metrics: ['Monthly reach', 'Engagement rate', 'MQLs per month', 'Cost per MQL'],
    mediaSpend: 'Recommended',
    cadence: 'Monthly, year-round',
    who: 'Growth-stage companies investing in ongoing demand generation and committing to a monthly production cycle.',
    have: 'A full-funnel content machine running every month, generating awareness and pushing prospects toward a conversation.',
  },
  {
    id: 'conversion-engine',
    name: 'Conversion Engine',
    goal: 'Turn the interest you have earned into signed customers.',
    price: '$11,500',
    deliverables: [
      { icon: 'landing', label: 'Landing Page' },
      { icon: 'copy',    label: 'Campaign Copy' },
      { icon: 'ads',     label: '10 Static Ads' },
      { icon: 'email',   label: 'Email Series' },
    ],
    target: 'Conversion',
    flow: [
      { icon: 'signal', label: 'Arrives',   sub: 'Paid or organic traffic lands',        deliverables: ['10 Static Ads', 'Campaign Copy'] },
      { icon: 'search', label: 'Considers', sub: 'Reads the offer, weighs the value',    deliverables: ['Landing Page'] },
      { icon: 'click',  label: 'Acts',      sub: 'Clicks the CTA',                       deliverables: ['Email Series'] },
      { icon: 'check',  label: 'Converted', sub: 'Form submitted or deal opened',        deliverables: [] },
    ],
    metrics: ['Landing page CVR', 'Cost per lead', 'Email CTR', 'Pipeline velocity'],
    mediaSpend: 'Recommended',
    cadence: '2-3 campaign cycles per year',
    who: 'Companies with existing brand awareness that are struggling to convert interest into action.',
    have: 'A complete conversion layer: landing page, copy, ads, and emails working together to move warm audiences forward.',
  },
  {
    id: 'lead-gen-engine',
    name: 'Lead Gen Engine',
    goal: 'A demand-gen system that turns attention into sales-ready pipeline.',
    price: '$22,000',
    deliverables: [
      { icon: 'strategy', label: 'Content Strategy' },
      { icon: 'report',   label: 'Industry Report' },
      { icon: 'landing',  label: 'Landing Page' },
      { icon: 'email',    label: 'Campaign Emails' },
      { icon: 'ads',      label: '10 Static Ads' },
    ],
    target: 'Lead Gen',
    flow: [
      { icon: 'person',   label: 'Unknown',   sub: 'No relationship with the brand',     deliverables: ['Content Strategy', '10 Static Ads'] },
      { icon: 'search',   label: 'Discovers', sub: 'Sees report or sponsored content',   deliverables: ['Industry Report'] },
      { icon: 'download', label: 'Downloads', sub: 'Trades email for the asset',         deliverables: ['Landing Page'] },
      { icon: 'star',     label: 'Qualified', sub: 'Sales-ready in the CRM',             deliverables: ['Campaign Emails'] },
    ],
    metrics: ['Lead volume', 'Cost per lead', 'MQL-to-SQL rate', 'Email list growth'],
    mediaSpend: 'Recommended',
    cadence: 'Once or twice per year',
    who: 'B2B companies that need to systematically generate qualified leads and can offer real research or thought leadership.',
    have: 'A lead gen engine built on credible content: a report that earns trust, a landing page that captures it, and ads and emails that drive it.',
  },
  {
    id: 'content-authority',
    name: 'Content Authority Pack',
    goal: 'Build authority with substantive long-form content distributed through owned channels.',
    price: '$26,000',
    deliverables: [
      { icon: 'strategy',   label: 'Content Strategy' },
      { icon: 'whitepaper', label: 'Whitepaper' },
      { icon: 'report',     label: 'Industry Report' },
      { icon: 'newsletter', label: 'Editorial Newsletter' },
      { icon: 'posts',      label: '12 Static Posts' },
    ],
    target: 'Authority',
    flow: [
      { icon: 'person',    label: 'Unknown',    sub: 'Not aware you exist',                   deliverables: ['Content Strategy', '12 Static Posts'] },
      { icon: 'search',    label: 'Discovers',  sub: 'Finds long-form content organically',   deliverables: ['Whitepaper', 'Industry Report'] },
      { icon: 'envelope',  label: 'Subscribes', sub: 'Opts in for the newsletter',            deliverables: ['Editorial Newsletter'] },
      { icon: 'megaphone', label: 'Advocates',  sub: 'Shares and refers others',              deliverables: [] },
    ],
    metrics: ['Organic traffic', 'Email subscribers', 'Share of voice', 'Backlinks earned'],
    mediaSpend: 'Not required',
    cadence: 'Annual baseline, quarterly additions',
    who: 'Companies in expert-driven categories where buyers research deeply before engaging and credibility is the primary purchase driver.',
    have: 'A body of substantive content that positions you as the category expert and drives organic traffic, email subscribers, and buyer credibility.',
  },
  {
    id: 'email-acquisition',
    name: 'Email Acquisition System',
    goal: 'Lead magnet, landing page, and email program engineered to grow your owned list.',
    price: '$26,000',
    deliverables: [
      { icon: 'ebook',      label: 'Ebook / Playbook' },
      { icon: 'landing',    label: 'Landing Page' },
      { icon: 'email',      label: '6 Emails' },
      { icon: 'newsletter', label: 'Newsletter System' },
      { icon: 'video',      label: '6 Short-Form Videos' },
    ],
    target: 'Acquisition',
    flow: [
      { icon: 'click',    label: 'Clicks ad',  sub: 'Arrives at the landing page',          deliverables: ['6 Short-Form Videos'] },
      { icon: 'download', label: 'Opts in',    sub: 'Downloads the lead magnet',            deliverables: ['Ebook / Playbook', 'Landing Page'] },
      { icon: 'bolt',     label: 'Activated',  sub: 'Enters the welcome sequence',          deliverables: ['6 Emails'] },
      { icon: 'envelope', label: 'Nurtured',   sub: 'Ongoing email relationship built',     deliverables: ['Newsletter System'] },
    ],
    metrics: ['List growth rate', 'Cost per lead', 'Email open rate', 'List-to-revenue'],
    mediaSpend: 'Not required',
    cadence: 'One-time build, ongoing management',
    who: 'Companies spending on paid channels who want to capture that attention in an owned asset that compounds over time.',
    have: 'A complete list-building system: a lead magnet that earns sign-ups, a landing page that converts, and an email program that activates them.',
  },
  {
    id: 'retention-engine',
    name: 'Retention Engine',
    goal: 'Keep the customers you have won and grow what they are worth.',
    price: '$25,000',
    deliverables: [
      { icon: 'lifecycle',  label: 'Lifecycle Program' },
      { icon: 'onboarding', label: 'Onboarding Content' },
      { icon: 'loyalty',    label: 'Loyalty Campaign' },
      { icon: 'newsletter', label: 'Editorial Newsletter' },
    ],
    target: 'Retention',
    flow: [
      { icon: 'person', label: 'Customer',  sub: 'Deal closed, clock is ticking',        deliverables: [] },
      { icon: 'check',  label: 'Onboarded', sub: 'Reached first value milestone',        deliverables: ['Onboarding Content', 'Lifecycle Program'] },
      { icon: 'click',  label: 'Engaged',   sub: 'Regular usage, strong satisfaction',   deliverables: ['Editorial Newsletter'] },
      { icon: 'shield', label: 'Retained',  sub: 'Renews and expands spend',             deliverables: ['Loyalty Campaign'] },
    ],
    metrics: ['Net revenue retention', 'Churn rate', 'NPS score', 'Expansion revenue'],
    mediaSpend: 'Not required',
    cadence: 'One-time program, ongoing',
    who: 'Companies where acquisition cost is high and the economics only work if customers stay and expand.',
    have: 'A full post-sale content system: onboarding that sets customers up for success, lifecycle emails that keep them engaged, and a loyalty campaign that rewards them for staying.',
  },
  {
    id: 'plg-activation',
    name: 'PLG Activation Kit',
    goal: 'Onboarding, lifecycle nurture, and self-serve assets to activate sign-ups.',
    price: '$28,000',
    deliverables: [
      { icon: 'onboarding', label: 'Onboarding Content' },
      { icon: 'lifecycle',  label: 'Lifecycle Program' },
      { icon: 'calculator', label: 'Interactive Calculator' },
      { icon: 'magnet',     label: 'Lead Magnet Bundle' },
    ],
    target: 'Activation',
    flow: [
      { icon: 'person',     label: 'Signs up',         sub: 'Free tier or trial started',          deliverables: ['Lead Magnet Bundle'] },
      { icon: 'bolt',       label: 'Activates',        sub: 'Reaches the aha moment',              deliverables: ['Onboarding Content'] },
      { icon: 'star',       label: 'Feature adoption', sub: 'Builds habits around the product',    deliverables: ['Lifecycle Program'] },
      { icon: 'check',      label: 'Converts',         sub: 'Upgrades to a paid plan',             deliverables: ['Interactive Calculator'] },
      { icon: 'arrows-out', label: 'Expands',          sub: 'Adds seats or features',              deliverables: [] },
    ],
    metrics: ['Activation rate', 'Time to value', 'Free-to-paid CVR', 'DAU/MAU'],
    mediaSpend: 'Not required',
    cadence: 'Once, at growth phase entry',
    who: 'Product-led growth companies with a free tier or trial where conversion from sign-up to paid is the primary business lever.',
    have: 'An activation system built for self-serve: onboarding that drives the aha moment, lifecycle emails that nudge toward conversion, and a calculator that makes the value case obvious.',
  },
  {
    id: 'plg-expansion',
    name: 'PLG Expansion Engine',
    goal: 'Retain and expand inside existing accounts through lifecycle, retention, and newsletter.',
    price: '$22,000',
    deliverables: [
      { icon: 'loyalty',    label: 'Loyalty Campaign' },
      { icon: 'lifecycle',  label: 'Lifecycle Program' },
      { icon: 'email',      label: '6 Emails' },
      { icon: 'newsletter', label: 'Editorial Newsletter' },
    ],
    target: 'Expansion',
    flow: [
      { icon: 'person',     label: 'Active user',  sub: 'Healthy usage, no churn signal',   deliverables: ['Lifecycle Program', 'Editorial Newsletter'] },
      { icon: 'shield',     label: 'Retained',     sub: 'Loyal, engaged with the product',  deliverables: ['Loyalty Campaign'] },
      { icon: 'star',       label: 'Upsell ready', sub: 'Sees the case for upgrading',      deliverables: ['6 Emails'] },
      { icon: 'arrows-out', label: 'Expanded',     sub: 'Higher tier or wider team use',    deliverables: [] },
    ],
    metrics: ['Net revenue retention', 'Expansion MRR', 'Churn rate', 'Seat growth'],
    mediaSpend: 'Not required',
    cadence: 'Refresh every quarter',
    who: 'PLG companies with a healthy user base looking to drive expansion revenue and reduce churn inside current accounts.',
    have: 'A retention and expansion system that keeps current users engaged, encourages upgrades, and surfaces the value that justifies staying and growing.',
  },
  {
    id: 'awareness-campaign',
    name: 'Awareness Campaign',
    goal: "Get in front of people who don't know you yet.",
    price: '$55,000',
    deliverables: [
      { icon: 'concept', label: 'Campaign Concept' },
      { icon: 'film',    label: 'Brand Film :60-:90' },
      { icon: 'report',  label: 'Industry Report' },
      { icon: 'ads',     label: '10 Static Ads' },
    ],
    target: 'Awareness',
    flow: [
      { icon: 'person', label: 'Unknown',  sub: 'Never heard of the brand',              deliverables: [] },
      { icon: 'signal', label: 'Exposed',  sub: 'Film and ads reach them',               deliverables: ['Campaign Concept', 'Brand Film :60-:90', '10 Static Ads'] },
      { icon: 'brain',  label: 'Recalls',  sub: 'Remembers the brand unprompted',        deliverables: ['Industry Report'] },
      { icon: 'search', label: 'Searches', sub: 'Looks you up after the campaign',       deliverables: [] },
    ],
    metrics: ['Brand recall', 'Share of voice', 'Inbound traffic', 'Social reach'],
    mediaSpend: 'Recommended',
    cadence: 'Once per brand moment or market entry',
    who: 'Companies entering a new market, repositioning an existing brand, or competing in a category where share of voice determines share of wallet.',
    have: 'A coordinated awareness moment built around a hero film and campaign concept. Content that earns reach organically and through paid, backed by research that earns credibility.',
  },
  {
    id: 'abm-toolkit',
    name: 'ABM Sales Toolkit',
    goal: 'Tightly designed assets to land named accounts.',
    price: '$30,000',
    deliverables: [
      { icon: 'deck',     label: 'Sales Deck (Full)' },
      { icon: 'film',     label: 'Case Study Film' },
      { icon: 'onepager', label: 'One-pager' },
      { icon: 'email',    label: '6 Emails' },
      { icon: 'ads',      label: '10 Static Ads' },
    ],
    target: 'ABM',
    flow: [
      { icon: 'crosshair', label: 'Targeted', sub: 'Named account identified',           deliverables: [] },
      { icon: 'signal',    label: 'Reached',  sub: 'Ad, email, or one-pager lands',      deliverables: ['10 Static Ads', 'One-pager'] },
      { icon: 'click',     label: 'Engaged',  sub: 'Watches the film, reads the deck',   deliverables: ['Case Study Film', 'Sales Deck (Full)'] },
      { icon: 'envelope',  label: 'Proposes', sub: 'Receives tailored follow-up',        deliverables: ['6 Emails'] },
      { icon: 'calendar',  label: 'Meets',    sub: 'Books the discovery call',           deliverables: [] },
    ],
    metrics: ['Meeting rate', 'Win rate', 'Deal velocity', 'ABM pipeline'],
    mediaSpend: 'Recommended',
    cadence: 'Per account list or sales cycle',
    who: 'Sales teams running account-based motions against a named target list who need creative that earns a meeting and closes one.',
    have: 'A complete ABM kit: deck that makes the pitch, film that proves the work, one-pager that leaves behind, and emails and ads that keep you present with the right people.',
  },
  {
    id: 'gtm-launch',
    name: 'GTM Launch Pack',
    goal: 'Bring a product or moment to market with one coordinated push.',
    price: '$54,000',
    deliverables: [
      { icon: 'strategy',     label: 'Video Strategy' },
      { icon: 'launch-film',  label: 'Product Launch Film' },
      { icon: 'landing',      label: 'Landing Page' },
      { icon: 'email',        label: 'Campaign Emails' },
      { icon: 'launch-pack',  label: 'Campaign Launch Pack' },
    ],
    target: 'Launch',
    flow: [
      { icon: 'clock',  label: 'Pre-launch', sub: 'Anticipation built before go-live',   deliverables: ['Video Strategy'] },
      { icon: 'rocket', label: 'Launch day', sub: 'Everything deploys at once',           deliverables: ['Product Launch Film', 'Landing Page', 'Campaign Launch Pack'] },
      { icon: 'signal', label: 'Awareness',  sub: 'Campaign earns reach and coverage',   deliverables: ['Campaign Emails'] },
      { icon: 'funnel', label: 'Pipeline',   sub: 'Inbound leads from new audience',     deliverables: [] },
    ],
    metrics: ['Launch day traffic', 'Week 1 inbound leads', 'Pipeline from launch', 'Brand search volume'],
    mediaSpend: 'Recommended',
    cadence: 'Once per major product launch',
    who: 'Companies bringing a new product or major initiative to market and needing everything to land at the same time across every channel.',
    have: 'A complete launch moment: strategy, hero film, landing page, email program, and a launch pack that deploys everything on day one.',
  },

  // ── Brand packages ────────────────────────────────────────────────────────
  {
    id: 'brand-pilot',
    name: 'Brand Pilot',
    goal: 'Low-risk first project: proof that working together works.',
    price: '$14,400',
    deliverables: [
      { icon: 'strategy', label: 'Brand Strategy' },
      { icon: 'sprint',   label: 'Brand Sprint' },
    ],
    target: 'Brand Strategy',
    flowLabel: 'How it works',
    flow: [
      { icon: 'search', label: 'Research',   sub: 'Market, competitors, and positioning mapped',   deliverables: [] },
      { icon: 'brain',  label: 'Strategy',   sub: 'Brand foundation and direction defined',        deliverables: ['Brand Strategy'] },
      { icon: 'bolt',   label: 'Sprint',     sub: 'First creative executions produced',            deliverables: ['Brand Sprint'] },
      { icon: 'check',  label: 'Delivered',  sub: 'Direction validated and ready to build on',     deliverables: [] },
    ],
    metrics: ['Brand clarity', 'Direction alignment', 'Creative confidence'],
    mediaSpend: 'Not required',
    cadence: 'One-time engagement',
    who: 'Companies that want to validate a working relationship before committing to a full engagement. Early-stage brands that need strategic direction before investing in a complete system.',
    have: 'A validated brand direction and a first piece of work that proves the approach. Strategy that grounds everything else, and a sprint that shows what the brand can become.',
  },
  {
    id: 'verbal-identity',
    name: 'Verbal Identity Kit',
    goal: 'Name, voice, and messaging framework: the verbal half of a brand system.',
    price: '$7,600',
    deliverables: [
      { icon: 'naming', label: 'Naming & Verbal Identity' },
      { icon: 'voice',  label: 'Copy Audit & Voice Guide' },
    ],
    target: 'Verbal Identity',
    flowLabel: 'How it works',
    flow: [
      { icon: 'search', label: 'Audit',      sub: 'Existing copy, tone, and naming reviewed',    deliverables: ['Copy Audit & Voice Guide'] },
      { icon: 'brain',  label: 'Define',     sub: 'Voice, messaging hierarchy, and name set',    deliverables: ['Naming & Verbal Identity'] },
      { icon: 'bolt',   label: 'Document',   sub: 'Voice guide written and packaged for the team', deliverables: [] },
      { icon: 'check',  label: 'Delivered',  sub: 'Framework ready to apply across every channel', deliverables: [] },
    ],
    metrics: ['Message consistency', 'Copy clarity', 'Team adoption rate'],
    mediaSpend: 'Not required',
    cadence: 'One-time engagement',
    who: 'Companies with an existing visual brand that have never formalized their voice, messaging, or naming. Teams writing inconsistently across channels.',
    have: 'A clear verbal foundation: a name that works, a voice guide the whole team can use, and a messaging framework that aligns every piece of copy across every channel.',
  },
  {
    id: 'brand-modernisation',
    name: 'Brand Modernisation',
    goal: 'Bring an established brand back in line with what the company has become.',
    price: '$27,200',
    deliverables: [
      { icon: 'strategy',      label: 'Brand Strategy' },
      { icon: 'brand-refresh', label: 'Brand Refresh' },
      { icon: 'deck-template', label: 'Deck Template System' },
    ],
    target: 'Brand Refresh',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',  label: 'Reposition',  sub: 'Strategy reframed for where the business is now', deliverables: ['Brand Strategy'] },
      { icon: 'bolt',   label: 'Refresh',     sub: 'Visual identity updated to match the ambition',   deliverables: ['Brand Refresh'] },
      { icon: 'check',  label: 'Systemise',   sub: 'Deck templates built so the brand travels',       deliverables: ['Deck Template System'] },
    ],
    metrics: ['Brand perception', 'Market credibility', 'Deck adoption rate'],
    mediaSpend: 'Not required',
    cadence: 'One-time engagement',
    who: 'Established companies that have outgrown their brand. The product or business has evolved but the brand still reflects who you were, not who you are now.',
    have: 'A modernised brand that matches the current ambition of the business, paired with a deck system that puts a credible face on every sales and investor conversation.',
  },
  {
    id: 'sales-deck-system',
    name: 'Sales Deck System',
    goal: 'Reusable deck system: strategy, master deck, and template kit.',
    price: '$14,700',
    deliverables: [
      { icon: 'strategy',      label: 'Deck Strategy & Narrative' },
      { icon: 'deck',          label: 'Sales Deck (Full)' },
      { icon: 'deck-template', label: 'Deck Template System' },
    ],
    target: 'Sales Enablement',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',  label: 'Narrative',    sub: 'Story arc and slide structure defined',       deliverables: ['Deck Strategy & Narrative'] },
      { icon: 'bolt',   label: 'Master deck',  sub: 'Full deck designed, written, and built',     deliverables: ['Sales Deck (Full)'] },
      { icon: 'check',  label: 'Systemised',   sub: 'Template kit handed off so the team can run', deliverables: ['Deck Template System'] },
    ],
    metrics: ['Deck consistency', 'Meeting close rate', 'Pitch time saved'],
    mediaSpend: 'Not required',
    cadence: 'One-time build',
    who: 'Companies that need a presentation system that can be reused, updated, and handed off without needing a designer every time. Teams that run a lot of meetings.',
    have: 'A master sales deck built on a strategy and narrative framework, and a template kit that lets the whole team build new decks without breaking the brand.',
  },
  {
    id: 'enterprise-sales-toolkit',
    name: 'Enterprise Sales Toolkit',
    goal: 'Branded sales enablement for high-stakes rooms.',
    price: '$25,900',
    deliverables: [
      { icon: 'strategy', label: 'Deck Strategy & Narrative' },
      { icon: 'deck',     label: 'Sales Deck (Full)' },
      { icon: 'film',     label: 'Case Study Film' },
      { icon: 'onepager', label: 'One-pager / Checklist' },
    ],
    target: 'Enterprise Sales',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',    label: 'Narrative',  sub: 'Pitch story and messaging framework built',  deliverables: ['Deck Strategy & Narrative'] },
      { icon: 'bolt',     label: 'Kit built',  sub: 'Deck, film, and one-pager produced',        deliverables: ['Sales Deck (Full)', 'Case Study Film', 'One-pager / Checklist'] },
      { icon: 'check',    label: 'Deployed',   sub: 'Full room kit ready for high-stakes meetings', deliverables: [] },
    ],
    metrics: ['Meeting win rate', 'Deal velocity', 'Enterprise pipeline'],
    mediaSpend: 'Not required',
    cadence: 'Per sales cycle',
    who: 'Teams selling to enterprise accounts where the buyer is senior, skeptical, and sizing you up on brand before they engage on product.',
    have: 'A complete sales room kit: the deck that makes the pitch, the film that proves the work, and the one-pager that leaves behind. Everything you need to earn and close a high-stakes meeting.',
  },
  {
    id: 'funding-round-pack',
    name: 'Funding Round Pack',
    goal: 'Investor-ready story and materials that hold up under scrutiny.',
    price: '$29,000',
    deliverables: [
      { icon: 'strategy',      label: 'Deck Strategy & Narrative' },
      { icon: 'deck',          label: 'Investor / Pitch Deck' },
      { icon: 'brand-refresh', label: 'Brand Refresh' },
    ],
    target: 'Fundraising',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',  label: 'Narrative',   sub: 'Investor story and brand positioning defined', deliverables: ['Deck Strategy & Narrative', 'Brand Refresh'] },
      { icon: 'bolt',   label: 'Deck built',  sub: 'Pitch deck designed, written, and stress-tested', deliverables: ['Investor / Pitch Deck'] },
      { icon: 'check',  label: 'Delivered',   sub: 'Materials ready for the room and the follow-up', deliverables: [] },
    ],
    metrics: ['Investor meeting rate', 'Round close rate', 'Valuation support'],
    mediaSpend: 'Not required',
    cadence: 'Per funding round',
    who: 'Companies preparing a seed, Series A, or Series B who need materials that hold up under investor scrutiny and tell a compelling story under pressure.',
    have: 'A pitch deck built on a clear narrative, a brand refresh that signals maturity to investors, and materials that hold up in the room and after it.',
  },
  {
    id: 'market-credibility',
    name: 'Market Credibility System',
    goal: 'A brand that makes you credible to bigger clients, partners, and investors.',
    price: '$41,700',
    deliverables: [
      { icon: 'strategy',      label: 'Brand Strategy' },
      { icon: 'brand-system',  label: 'Brand System' },
      { icon: 'deck-template', label: 'Deck Template System' },
    ],
    target: 'Market Position',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',  label: 'Strategy',      sub: 'Positioning defined for the tier you want to win', deliverables: ['Brand Strategy'] },
      { icon: 'bolt',   label: 'System built',  sub: 'Complete brand identity designed and documented',  deliverables: ['Brand System'] },
      { icon: 'check',  label: 'Deployed',      sub: 'Deck templates built and brand live in market',    deliverables: ['Deck Template System'] },
    ],
    metrics: ['Brand perception shift', 'Deal quality', 'Market tier access'],
    mediaSpend: 'Not required',
    cadence: 'One-time build',
    who: 'Companies competing for larger clients, partners, or investors who size you up on brand before they engage. Companies that are outcompeting their brand.',
    have: 'A brand system built for the tier you want to play in: strategy, complete identity system, and a deck template that puts a credible face on every touchpoint in the market.',
  },
  {
    id: 'brand-web-platform',
    name: 'Brand + Web Platform',
    goal: 'Brand platform paired with a CMS-managed marketing site and deck template system.',
    price: '$78,300',
    deliverables: [
      { icon: 'brand-platform', label: 'Brand Platform' },
      { icon: 'web',            label: 'Marketing Site' },
      { icon: 'cms',            label: 'CMS' },
      { icon: 'deck-template',  label: 'Deck Template System' },
    ],
    target: 'Full Platform',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',   label: 'Brand built',  sub: 'Identity, platform, and system defined',        deliverables: ['Brand Platform'] },
      { icon: 'bolt',    label: 'Site built',   sub: 'Marketing site designed, built, and launched',  deliverables: ['Marketing Site', 'CMS'] },
      { icon: 'check',   label: 'Systemised',   sub: 'Deck templates ensure brand travels everywhere', deliverables: ['Deck Template System'] },
    ],
    metrics: ['Site traffic', 'Brand coherence', 'Market presence'],
    mediaSpend: 'Not required',
    cadence: 'One-time build',
    who: 'Companies building their primary market presence from the ground up, or replacing a site and brand system that no longer represents where the business is headed.',
    have: 'A complete brand and web platform: brand identity, a CMS-managed marketing site, and a deck template system that keeps everything visually consistent across every channel.',
  },

  // ── Digital packages ──────────────────────────────────────────────────────
  {
    id: 'starter-web-presence',
    name: 'Starter Web Presence',
    goal: 'A professional web presence: better than nothing and ready to grow.',
    price: '$11,200',
    startsAt: true,
    deliverables: [
      { icon: 'sitemap', label: 'Web Strategy & Sitemap' },
      { icon: 'landing', label: 'Landing Page' },
      { icon: 'web',     label: 'Business Card Site' },
    ],
    target: 'Web Presence',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain', label: 'Strategy',  sub: 'Sitemap and content architecture defined',         deliverables: ['Web Strategy & Sitemap'] },
      { icon: 'bolt',  label: 'Built',     sub: 'Landing page and site designed and developed',     deliverables: ['Landing Page', 'Business Card Site'] },
      { icon: 'check', label: 'Live',      sub: 'Deployed and ready for traffic',                   deliverables: [] },
    ],
    metrics: ['Time to live', 'Page load speed', 'Inbound readiness'],
    mediaSpend: 'Not required',
    cadence: 'One-time build',
    who: 'New ventures, founders, or small companies that need a credible web presence before they can meaningfully pursue customers, partners, or investment.',
    have: 'A strategy-backed web presence: a sitemap that sets up future growth, a landing page built to convert, and a business card site that represents you professionally from day one.',
  },
  {
    id: 'marketing-site',
    name: 'Marketing Site',
    goal: 'Full marketing site with a CMS you can manage yourself.',
    price: '$21,100',
    deliverables: [
      { icon: 'sitemap', label: 'Web Strategy & Sitemap' },
      { icon: 'web',     label: 'Marketing Site' },
      { icon: 'cms',     label: 'CMS' },
    ],
    target: 'Marketing Site',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain', label: 'Strategy',   sub: 'Sitemap, content plan, and architecture defined',  deliverables: ['Web Strategy & Sitemap'] },
      { icon: 'bolt',  label: 'Built',      sub: 'Site designed, developed, and content entered',    deliverables: ['Marketing Site', 'CMS'] },
      { icon: 'check', label: 'Handed off', sub: 'CMS documented and team trained to manage it',    deliverables: [] },
    ],
    metrics: ['Organic traffic', 'Conversion rate', 'Page performance', 'CMS adoption'],
    mediaSpend: 'Not required',
    cadence: 'One-time build',
    who: 'Companies ready to build a proper marketing site they can manage and update without a developer for every content change.',
    have: 'A full marketing site built on a CMS you own: architected, designed, built, and handed off so your team can manage and update it independently.',
  },
  {
    id: 'microsite-build',
    name: 'Microsite Build',
    goal: 'A focused campaign microsite: 3-5 pages with custom interactions.',
    price: '$14,700',
    deliverables: [
      { icon: 'sitemap',   label: 'Web Strategy & Sitemap' },
      { icon: 'microsite', label: 'Microsite' },
    ],
    target: 'Campaign',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain',  label: 'Brief',    sub: 'Campaign goals, sitemap, and creative direction set', deliverables: ['Web Strategy & Sitemap'] },
      { icon: 'bolt',   label: 'Built',    sub: 'Designed and built with custom interactions',         deliverables: ['Microsite'] },
      { icon: 'rocket', label: 'Launched', sub: 'Deployed on its own URL for the campaign window',     deliverables: [] },
    ],
    metrics: ['Traffic to microsite', 'Engagement rate', 'Campaign conversion'],
    mediaSpend: 'Recommended',
    cadence: 'Per campaign or launch',
    who: 'Companies launching a campaign, product moment, or initiative that deserves its own focused digital home with its own creative direction.',
    have: 'A 3-5 page campaign microsite with custom interactions and its own URL, built and deployed for the campaign or launch window.',
  },
  {
    id: 'product-design-sprint',
    name: 'Product Design Sprint',
    goal: 'Take a product concept into a working interactive design.',
    price: '$17,400',
    deliverables: [
      { icon: 'discovery',  label: 'Product Discovery' },
      { icon: 'wireframes', label: 'UX Wireframes' },
      { icon: 'ui-design',  label: 'UI Design (Feature)' },
    ],
    target: 'Product Design',
    flowLabel: 'How it works',
    flow: [
      { icon: 'search', label: 'Discover',  sub: 'Problem space, users, and constraints mapped',     deliverables: ['Product Discovery'] },
      { icon: 'brain',  label: 'Wireframe', sub: 'User flows and structural layouts defined',         deliverables: ['UX Wireframes'] },
      { icon: 'bolt',   label: 'Design',    sub: 'High-fidelity UI produced and interaction-ready',  deliverables: ['UI Design (Feature)'] },
      { icon: 'check',  label: 'Handoff',   sub: 'Specs and assets ready for engineering',           deliverables: [] },
    ],
    metrics: ['Design-to-engineering handoff time', 'User test pass rate', 'Scope clarity'],
    mediaSpend: 'Not required',
    cadence: 'One-time sprint',
    who: 'Product teams with a concept or feature they need to design and validate before committing engineering time to a full build.',
    have: 'Discovery documentation, UX wireframes mapping the full user flow, and polished UI designs that are ready to hand straight to engineering.',
  },
  {
    id: 'interactive-experience',
    name: 'Interactive Experience',
    goal: 'Immersive 3D / WebGL experience: flagship interactive build.',
    price: '$30,000',
    deliverables: [
      { icon: 'sitemap',     label: 'Web Strategy & Sitemap' },
      { icon: 'interactive', label: 'Interactive Experience / WebGL' },
    ],
    target: 'Experience',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain', label: 'Concept',  sub: 'Creative concept and technical approach defined', deliverables: ['Web Strategy & Sitemap'] },
      { icon: 'bolt',  label: 'Built',    sub: '3D / WebGL experience developed and refined',    deliverables: ['Interactive Experience / WebGL'] },
      { icon: 'check', label: 'Launched', sub: 'Deployed as a flagship interactive asset',       deliverables: [] },
    ],
    metrics: ['Time on experience', 'Engagement depth', 'Brand recall', 'Share rate'],
    mediaSpend: 'Recommended',
    cadence: 'One-time build',
    who: 'Companies that need an immersive flagship web experience: 3D, WebGL, or advanced custom interactions that standard site builders cannot produce.',
    have: 'An immersive interactive experience built in WebGL or equivalent — a flagship digital asset designed to earn attention and signal creative ambition.',
  },
  {
    id: 'product-build',
    name: 'Product Build',
    goal: 'Discovery through working build: designed and shipped in one engagement.',
    price: '$36,700',
    deliverables: [
      { icon: 'discovery',  label: 'Product Discovery' },
      { icon: 'wireframes', label: 'UX Wireframes' },
      { icon: 'ui-design',  label: 'UI Design (Feature)' },
      { icon: 'code',       label: 'Design-to-Build' },
    ],
    target: 'Product Build',
    flowLabel: 'How it works',
    flow: [
      { icon: 'search', label: 'Discover',  sub: 'Users, flows, and constraints mapped',          deliverables: ['Product Discovery'] },
      { icon: 'brain',  label: 'Design',    sub: 'Wireframes and UI design produced',              deliverables: ['UX Wireframes', 'UI Design (Feature)'] },
      { icon: 'bolt',   label: 'Build',     sub: 'Product built from design specs',                deliverables: ['Design-to-Build'] },
      { icon: 'rocket', label: 'Ship',      sub: 'Working product in front of real users',         deliverables: [] },
    ],
    metrics: ['Time to ship', 'User activation rate', 'Build fidelity to design', 'Bug rate at launch'],
    mediaSpend: 'Not required',
    cadence: 'One-time engagement',
    who: 'Teams that need to go from concept to working product in a single engagement: discovery, design, and a real deployable build without handing off between vendors.',
    have: 'A designed and built product in front of real users: discovery, wireframes, UI design, and a working build shipped through one integrated engagement.',
  },
  {
    id: 'full-web-build',
    name: 'Full Web Build',
    goal: 'Large multi-template marketing site with a design system to extend it.',
    price: '$43,300',
    deliverables: [
      { icon: 'sitemap',       label: 'Web Strategy & Sitemap' },
      { icon: 'web',           label: 'Marketing Site' },
      { icon: 'cms',           label: 'CMS' },
      { icon: 'design-system', label: 'Design System' },
    ],
    target: 'Web Platform',
    flowLabel: 'How it works',
    flow: [
      { icon: 'brain', label: 'Strategy',    sub: 'Sitemap, design system, and architecture defined', deliverables: ['Web Strategy & Sitemap'] },
      { icon: 'bolt',  label: 'Built',       sub: 'Site designed and built across all templates',     deliverables: ['Marketing Site', 'CMS', 'Design System'] },
      { icon: 'check', label: 'Handed off',  sub: 'CMS and component library ready for the team',    deliverables: [] },
    ],
    metrics: ['Page performance', 'CMS adoption', 'Organic traffic', 'Template reuse rate'],
    mediaSpend: 'Not required',
    cadence: 'One-time build',
    who: 'Companies building a large multi-template web presence that needs to scale: new pages without breaking the design, and templates the team can reuse.',
    have: 'A complete web platform: large multi-template marketing site, CMS, and a design system with component library so future pages stay consistent without starting from scratch.',
  },
]

// ── Services ──────────────────────────────────────────────────────────────
const CONTENT_SERVICES = [
  {
    id: 'social', area: 'Social', num: 1,
    services: [
      {
        name: 'Social strategy & kickoff', hours: 16, price: '$2,200',
        who: 'Teams starting a social presence or resetting one that has drifted without a clear direction. Works as a foundation before any production begins.',
        have: 'A documented social strategy your team can execute from: content pillars, platform plan, posting cadence, and a 90-day content framework.',
        deliverables: [{ label: 'Strategy workshop' }, { label: 'Content pillars' }, { label: 'Platform plan' }, { label: '90-day framework' }],
        turnaround: '3-5 days', target: 'Social Strategy',
        metrics: ['Content clarity', 'Team alignment', 'Post consistency'],
        flow: [
          { icon: 'search', label: 'Audit',     sub: 'Existing channels, content, and competitors reviewed',   deliverables: [] },
          { icon: 'brain',  label: 'Workshop',  sub: 'Pillars, platforms, and formats defined together',       deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Strategy doc and 90-day framework handed off',           deliverables: [] },
        ],
      },
      {
        name: 'Static posts - batch of 4', hours: 9, price: '$900',
        who: 'Brands that need social content on demand without committing to a full production program. Useful as a top-up between larger production runs.',
        have: '4 designed, on-brand static posts formatted for your platform and ready to drop into your scheduling tool.',
        deliverables: [{ label: '4 static posts' }, { label: '1 platform format' }, { label: 'Export-ready files' }],
        turnaround: '2-3 days', target: 'Social Content',
        metrics: ['Post consistency', 'Brand accuracy', 'Time to publish'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Platform, brand assets, and post direction aligned',     deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '4 posts designed to brief and reviewed',                 deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Export-ready files sized and formatted for platform',    deliverables: [] },
        ],
      },
      {
        name: 'Static posts - batch of 8', hours: 17, price: '$1,700',
        who: 'Brands producing content at a steady cadence who want visual consistency across a month of posts. Ideal for monthly content drops.',
        have: '8 designed static posts with a consistent visual system, formatted and ready to schedule across the month.',
        deliverables: [{ label: '8 static posts' }, { label: '1 platform format' }, { label: 'Cohesive visual system' }, { label: 'Export-ready files' }],
        turnaround: '3-5 days', target: 'Social Content',
        metrics: ['Visual consistency', 'Monthly coverage', 'Post readiness'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Brand direction and visual system aligned upfront',      deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '8 posts designed as a cohesive set and reviewed',        deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Full set exported and ready to schedule',                deliverables: [] },
        ],
      },
      {
        name: 'Static posts - batch of 12', hours: 25, price: '$2,600',
        who: 'Brands running an active social program that need a reliable monthly content drop without building an in-house design team.',
        have: '12 posts built around a consistent visual system, formatted for up to 2 platforms, ready to schedule for the full month.',
        deliverables: [{ label: '12 static posts' }, { label: 'Up to 2 platforms' }, { label: 'Unified visual system' }, { label: 'Export-ready files' }],
        turnaround: '5-7 days', target: 'Social Content',
        metrics: ['Monthly post coverage', 'Cross-platform consistency', 'Publishing readiness'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'System direction and platform formats confirmed',        deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '12 posts designed as a unified visual system',           deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Full set exported per platform and ready to schedule',   deliverables: [] },
        ],
      },
      {
        name: 'Carousels - batch of 3', hours: 15, price: '$1,500',
        who: 'Brands using educational, how-to, or story-driven content that benefits from sequential slides. Common in B2B and thought-leadership programs.',
        have: '3 carousels of 5-8 slides each, on-brand and formatted for your platform, ready to post.',
        deliverables: [{ label: '3 carousels (5-8 slides)' }, { label: 'Cover + body + CTA slides' }, { label: 'Platform exports' }],
        turnaround: '3-5 days', target: 'Social Content',
        metrics: ['Swipe-through rate', 'Save rate', 'Engagement per post'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Topic, structure, and slide count per carousel defined',  deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '3 carousels designed slide by slide and reviewed',         deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'All slides exported per platform spec',                    deliverables: [] },
        ],
      },
      {
        name: 'Carousels - batch of 6', hours: 26, price: '$2,600',
        who: 'Brands that rely on carousel formats as a core part of their social strategy and need a reliable monthly batch.',
        have: '6 carousels of 5-8 slides each, built on a cohesive design system, formatted and ready to schedule.',
        deliverables: [{ label: '6 carousels (5-8 slides)' }, { label: 'Cohesive design system' }, { label: 'Platform exports' }],
        turnaround: '5-7 days', target: 'Social Content',
        metrics: ['Swipe-through rate', 'Save rate', 'Monthly carousel coverage'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Topics and visual system confirmed for all 6 carousels', deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '6 carousels designed as a cohesive batch and reviewed',  deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'All slides exported and ready to publish',                deliverables: [] },
        ],
      },
      {
        name: 'Illustrated posts - batch of 3', hours: 20, price: '$3,200',
        who: 'Brands that want a differentiated visual style not achievable with photography or standard design. Used for brand moments, campaigns, or editorial content.',
        have: '3 posts built around original custom illustration, on-brand and formatted for your platform.',
        deliverables: [{ label: '3 illustrated posts' }, { label: 'Custom artwork per post' }, { label: 'Platform-formatted exports' }],
        turnaround: '5-7 days', target: 'Social Content',
        metrics: ['Feed differentiation', 'Engagement rate', 'Brand recall'],
        flow: [
          { icon: 'brain', label: 'Concept',    sub: 'Illustration direction and style defined per brief',    deliverables: [] },
          { icon: 'bolt',  label: 'Illustrate', sub: 'Custom artwork created and integrated into posts',      deliverables: [] },
          { icon: 'check', label: 'Delivered',  sub: 'Final posts exported and formatted for platform',       deliverables: [] },
        ],
      },
      {
        name: 'Short-form video - batch of 3', hours: 25, price: '$3,600',
        who: 'Brands with existing video footage that needs editing into platform-native short-form content. No new shoot required.',
        have: '3 edited vertical videos with captions, sound design, and platform formatting applied. Ready to publish.',
        deliverables: [{ label: '3 vertical edits' }, { label: 'Captions' }, { label: 'Sound design' }, { label: 'Platform exports' }],
        turnaround: '5-7 days', target: 'Social Video',
        metrics: ['View rate', 'Watch time', 'Engagement rate'],
        flow: [
          { icon: 'search', label: 'Review',    sub: 'Existing footage reviewed and selects identified',      deliverables: [] },
          { icon: 'bolt',   label: 'Edit',      sub: 'Videos edited, captioned, and sound-designed',          deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Vertical exports ready to post per platform spec',      deliverables: [] },
        ],
      },
      {
        name: 'Short-form video - batch of 6', hours: 47, price: '$6,700',
        who: 'Brands running an active social video program that need a reliable monthly batch without shooting new content each time.',
        have: '6 edited vertical videos with captions and sound design, platform-formatted and ready to schedule across the month.',
        deliverables: [{ label: '6 vertical edits' }, { label: 'Captions' }, { label: 'Sound design' }, { label: 'Platform exports' }],
        turnaround: '1-2 weeks', target: 'Social Video',
        metrics: ['Monthly video coverage', 'View rate', 'Watch time'],
        flow: [
          { icon: 'search', label: 'Review',    sub: 'Existing footage reviewed and selects pulled',           deliverables: [] },
          { icon: 'bolt',   label: 'Edit',      sub: '6 videos edited, captioned, and sound-designed',         deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'All exports ready to schedule per platform',             deliverables: [] },
        ],
      },
      {
        name: 'Short-form video - shoot day', hours: 56, price: '$8,200',
        who: 'Brands that need fresh video content but do not have existing footage to work with. One efficient day on location produces a month of content.',
        have: '4-6 edited vertical videos shot and edited into platform-ready short-form content with captions and sound design.',
        deliverables: [{ label: '1 shoot day' }, { label: '4-6 vertical edits' }, { label: 'Captions + sound design' }, { label: 'Platform exports' }],
        turnaround: '1-2 weeks', target: 'Social Video',
        metrics: ['Content volume per shoot', 'View rate', 'Watch time'],
        flow: [
          { icon: 'brain',  label: 'Pre-pro',   sub: 'Shot list, location, and creative direction confirmed',  deliverables: [] },
          { icon: 'bolt',   label: 'Shoot',     sub: '1 day on location capturing all footage needed',         deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: '4-6 edited videos exported and ready to post',           deliverables: [] },
        ],
      },
      {
        name: 'Animated loops - batch of 3', hours: 22, price: '$3,100',
        who: 'Brands that want the engagement benefits of video without a shoot. Works well for product features, stats, or brand moments that benefit from motion.',
        have: '3 looping animated posts in 2D motion, on-brand and sized for your platform, ready to post.',
        deliverables: [{ label: '3 animated loops' }, { label: '2D motion design' }, { label: 'Platform-formatted exports' }],
        turnaround: '5-7 days', target: 'Social Content',
        metrics: ['View rate', 'Loop plays', 'Engagement vs static'],
        flow: [
          { icon: 'brain', label: 'Concept',   sub: 'Motion direction and loop format defined per brief',     deliverables: [] },
          { icon: 'bolt',  label: 'Animate',   sub: '3 loops built in 2D motion and reviewed',               deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Exported and sized for platform posting',                deliverables: [] },
        ],
      },
      {
        name: '3D animated posts - batch of 2', hours: 49, price: '$7,600',
        who: 'Brands investing in flagship social content that signals a high production standard. Used for product launches, campaign moments, or brand milestones.',
        have: '2 fully rendered 3D animated posts at 10-20 seconds each, formatted for social and ready to publish.',
        deliverables: [{ label: '2 x 3D animated posts' }, { label: '10-20s runtime each' }, { label: 'Platform-formatted exports' }],
        turnaround: '1-2 weeks', target: 'Social Content',
        metrics: ['View rate', 'Engagement rate', 'Brand perception lift'],
        flow: [
          { icon: 'brain', label: 'Concept',   sub: 'Creative direction and 3D treatment defined per brief',  deliverables: [] },
          { icon: 'bolt',  label: 'Produce',   sub: '3D assets modelled, animated, and rendered',             deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Final exports formatted for platform posting',            deliverables: [] },
        ],
      },
      {
        name: 'Campaign launch pack', hours: 68, price: '$8,300',
        who: 'Brands with a campaign launch moment that needs a complete creative pack rather than individual posts. Works for product launches, seasonal campaigns, or market moments.',
        have: '~10 coordinated assets, static and motion, built to a unified campaign direction and formatted for one platform.',
        deliverables: [{ label: '~10 campaign assets' }, { label: 'Static + motion mix' }, { label: 'Unified campaign system' }, { label: '1 platform formatted' }],
        turnaround: '2-3 weeks', target: 'Campaign',
        metrics: ['Campaign launch readiness', 'Asset coverage', 'Creative consistency'],
        flow: [
          { icon: 'brain',  label: 'Campaign brief', sub: 'Creative direction, formats, and timeline set',          deliverables: [] },
          { icon: 'bolt',   label: 'Production',     sub: 'Static and motion assets built as a coordinated system', deliverables: [] },
          { icon: 'rocket', label: 'Launch-ready',   sub: '~10 assets delivered, formatted, and ready to deploy',   deliverables: [] },
        ],
      },
      {
        name: 'Multi-platform launch', hours: 126, price: '$15,400',
        who: 'Brands running a major launch moment that needs to land simultaneously across multiple platforms with creative native to each channel.',
        have: '~20 campaign assets designed and formatted for 3 platforms, each one optimized for where it will appear, not just resized.',
        deliverables: [{ label: '~20 campaign assets' }, { label: '3 platform formats' }, { label: 'Format-native design' }, { label: 'Launch-ready delivery' }],
        turnaround: '4-6 weeks', target: 'Campaign',
        metrics: ['Cross-platform reach', 'Platform-native performance', 'Launch day coverage'],
        flow: [
          { icon: 'brain',  label: 'Campaign brief', sub: 'Creative direction defined across all 3 platforms',       deliverables: [] },
          { icon: 'bolt',   label: 'Production',     sub: '~20 assets built and format-tailored per channel',        deliverables: [] },
          { icon: 'rocket', label: 'Launch-ready',   sub: 'Full asset pack delivered per platform, ready to deploy', deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'longform-video', area: 'Long-form Video', num: 2,
    services: [
      {
        name: 'Video strategy & creative direction', hours: 20, price: '$2,900',
        who: 'Teams preparing to produce video who want a clear concept before committing budget to a shoot. Also used to align stakeholders on direction before production.',
        have: 'A complete creative brief: concept, script direction, visual references, and production guidance ready to hand to any production team.',
        deliverables: [{ label: 'Video concept' }, { label: 'Script direction' }, { label: 'Creative brief' }, { label: 'Visual references' }],
        turnaround: '3-5 days', target: 'Video Strategy',
        metrics: ['Concept clarity', 'Stakeholder alignment', 'Production readiness'],
        flow: [
          { icon: 'search', label: 'Discovery', sub: 'Goals, audience, tone, and channel requirements mapped',    deliverables: [] },
          { icon: 'brain',  label: 'Concept',   sub: 'Creative direction, script approach, and visuals defined',  deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Brief handed off ready for production',                     deliverables: [] },
        ],
      },
      {
        name: 'Brand film - :30 ad', hours: 114, price: '$17,000',
        who: 'Brands that need a short-format film for paid distribution, social, or presentations. Ideal for a brand awareness moment or tight campaign.',
        have: 'A complete :30 brand film shot, edited, color-graded, and sound-designed, ready for paid channels, social, or any other distribution context.',
        deliverables: [{ label: ':30 brand film' }, { label: '1 shoot day' }, { label: 'Full post-production' }, { label: 'Color grade + sound design' }],
        turnaround: '3-4 weeks', target: 'Brand Film',
        metrics: ['View rate', 'Brand recall', 'Completion rate'],
        flow: [
          { icon: 'brain',  label: 'Pre-production', sub: 'Concept, shot list, cast, and location confirmed',      deliverables: [] },
          { icon: 'bolt',   label: 'Shoot',          sub: '1 day on location, all footage captured',               deliverables: [] },
          { icon: 'check',  label: 'Post',           sub: 'Edited, color-graded, and sound-designed to delivery',  deliverables: [] },
        ],
      },
      {
        name: 'Brand film - :60-:90 hero', hours: 205, price: '$30,500',
        who: 'Brands making a significant investment in their primary brand film, used as the centrepiece of campaigns, website hero sections, or investor materials.',
        have: 'A premium :60-:90 brand film produced across 2 shoot days, multiple locations, with full post-production including color and sound design.',
        deliverables: [{ label: ':60-:90 hero film' }, { label: '2 shoot days' }, { label: 'Multi-location production' }, { label: 'Premium post-production' }],
        turnaround: '6-10 weeks', target: 'Brand Film',
        metrics: ['Brand impact', 'Completion rate', 'Campaign performance'],
        flow: [
          { icon: 'brain',  label: 'Pre-production', sub: 'Creative direction, locations, and schedule locked',    deliverables: [] },
          { icon: 'bolt',   label: 'Shoot',          sub: '2 days across multiple locations, full crew',           deliverables: [] },
          { icon: 'check',  label: 'Post',           sub: 'Full edit, color grade, and sound design to delivery',  deliverables: [] },
        ],
      },
      {
        name: 'Documentary short', hours: 260, price: '$38,900',
        who: 'Brands with a story worth telling at depth. Used for mission-driven content, founder stories, category leadership pieces, or long-form campaigns on YouTube.',
        have: 'A complete documentary short of 5-10 minutes produced over 2-3 shoot days with interviews, b-roll, and full post-production.',
        deliverables: [{ label: '5-10 min documentary' }, { label: '2-3 shoot days' }, { label: 'Interviews + b-roll' }, { label: 'Full post-production' }],
        turnaround: '10-14 weeks', target: 'Documentary',
        metrics: ['Watch time', 'Completion rate', 'Audience reach'],
        flow: [
          { icon: 'brain',  label: 'Development',  sub: 'Narrative arc, subjects, and shoot plan developed',      deliverables: [] },
          { icon: 'bolt',   label: 'Production',   sub: '2-3 shoot days: interviews and b-roll captured',          deliverables: [] },
          { icon: 'check',  label: 'Post',         sub: 'Edited into full narrative, graded, and sound-designed',  deliverables: [] },
        ],
      },
      {
        name: 'Founder / customer story', hours: 90, price: '$13,300',
        who: 'Brands that want to put a human face on the company or demonstrate real customer outcomes through a testimonial-format film.',
        have: 'A ~3 minute founder or customer story film, shot in one day, with a clear narrative arc ready for website, social, or sales use.',
        deliverables: [{ label: '~3 min story film' }, { label: '1 shoot day' }, { label: 'Interview + b-roll' }, { label: 'Full post-production' }],
        turnaround: '3-4 weeks', target: 'Story Film',
        metrics: ['Engagement rate', 'Watch time', 'Conversion from film'],
        flow: [
          { icon: 'brain',  label: 'Pre-production', sub: 'Subject, narrative angle, and shot plan confirmed',     deliverables: [] },
          { icon: 'bolt',   label: 'Shoot',          sub: '1 day: interview and supporting b-roll captured',        deliverables: [] },
          { icon: 'check',  label: 'Post',           sub: 'Edited, graded, and sound-designed to delivery',         deliverables: [] },
        ],
      },
      {
        name: 'Case study film', hours: 110, price: '$16,200',
        who: 'Sales and marketing teams that need social proof in video form, used in sales decks, website case study pages, and paid retargeting campaigns.',
        have: 'A ~2 min case study film with interview footage and b-roll across locations, edited into a clear before-and-after narrative.',
        deliverables: [{ label: '~2 min case study film' }, { label: 'Multi-location shoot' }, { label: 'Interview + b-roll' }, { label: 'Full post-production' }],
        turnaround: '3-5 weeks', target: 'Case Study',
        metrics: ['Sales enablement impact', 'View rate', 'Conversion lift'],
        flow: [
          { icon: 'brain',  label: 'Pre-production', sub: 'Client briefed, locations confirmed, narrative framed',  deliverables: [] },
          { icon: 'bolt',   label: 'Shoot',          sub: 'Interview and b-roll captured across locations',          deliverables: [] },
          { icon: 'check',  label: 'Post',           sub: 'Edited into a result-first narrative, graded + sound',    deliverables: [] },
        ],
      },
      {
        name: 'Product launch film', hours: 238, price: '$36,000',
        who: 'Teams launching a product that needs a hero film communicating the product story, the value, and the brand all at once.',
        have: 'A :60-:90 product launch film combining 3D and live action, fully post-produced with motion design, color grade, and sound design.',
        deliverables: [{ label: ':60-:90 launch film' }, { label: '3D + live action hybrid' }, { label: 'Full motion design' }, { label: 'Premium post-production' }],
        turnaround: '8-12 weeks', target: 'Product Launch',
        metrics: ['Launch day views', 'Completion rate', 'Pipeline from launch'],
        flow: [
          { icon: 'brain',  label: 'Pre-production', sub: 'Creative concept, 3D direction, and shoot plan locked',   deliverables: [] },
          { icon: 'bolt',   label: 'Production',     sub: 'Live action shot + 3D elements produced in parallel',      deliverables: [] },
          { icon: 'check',  label: 'Post',           sub: 'Composited, graded, motion-designed, and sound-designed',  deliverables: [] },
        ],
      },
      {
        name: 'Ad campaign - TVC + cutdowns', hours: 186, price: '$27,600',
        who: 'Brands running a paid video campaign across TV and digital that need one concept cut into platform-appropriate lengths without losing impact.',
        have: 'A :30 hero spot and all cutdowns (:15 and :06) fully produced, formatted for broadcast and digital channel specifications.',
        deliverables: [{ label: ':30 hero TVC' }, { label: ':15 cutdown' }, { label: ':06 cutdown' }, { label: 'Broadcast + digital specs' }],
        turnaround: '6-10 weeks', target: 'Ad Campaign',
        metrics: ['Ad recall', 'View-through rate', 'Campaign reach'],
        flow: [
          { icon: 'brain',  label: 'Pre-production', sub: 'Campaign concept, script, and production plan locked', deliverables: [] },
          { icon: 'bolt',   label: 'Production',     sub: 'Hero :30 shot and produced end-to-end',                deliverables: [] },
          { icon: 'check',  label: 'Cutdowns',       sub: ':15 and :06 versions edited and formatted to spec',    deliverables: [] },
        ],
      },
      {
        name: 'Sizzle reel / explainer', hours: 84, price: '$11,700',
        who: 'Brands that need a polished video to explain a product, service, or company without commissioning a full live-action production.',
        have: 'A 60-90s motion-graphics-driven video using existing assets, fully edited with sound design and a voiceover-ready mix.',
        deliverables: [{ label: '60-90s sizzle / explainer' }, { label: 'Motion graphics' }, { label: 'Sound design' }, { label: 'Voiceover-ready mix' }],
        turnaround: '2-4 weeks', target: 'Explainer',
        metrics: ['Completion rate', 'Concept comprehension', 'Sales enablement use'],
        flow: [
          { icon: 'brain',  label: 'Script + brief', sub: 'Narrative structure and motion direction defined',      deliverables: [] },
          { icon: 'bolt',   label: 'Motion design',  sub: 'Motion graphics built over script and reviewed',        deliverables: [] },
          { icon: 'check',  label: 'Delivered',      sub: 'Sound-designed and exported to final specs',            deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'performance-ads', area: 'Performance Ads', num: 3,
    services: [
      {
        name: 'Ad concept & strategy', hours: 14, price: '$2,000',
        who: 'Performance teams starting a new campaign or breaking out of a creative rut. Useful before commissioning any ads to make sure the strategy behind the creative is sound.',
        have: 'A performance creative strategy document: audience definition, hooks, messaging angles, and a testing framework to guide ad production.',
        deliverables: [{ label: 'Performance creative strategy' }, { label: 'Hook and angle library' }, { label: 'Testing framework' }, { label: 'Messaging hierarchy' }],
        turnaround: '3-5 days', target: 'Performance Strategy',
        metrics: ['Creative clarity', 'Hook diversity', 'Testing readiness'],
        flow: [
          { icon: 'search', label: 'Audit',     sub: 'Existing ads, performance data, and audience reviewed',   deliverables: [] },
          { icon: 'brain',  label: 'Strategy',  sub: 'Hooks, angles, and testing approach defined',             deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Creative strategy doc handed off ready for production',   deliverables: [] },
        ],
      },
      {
        name: 'Static ad set - batch of 5', hours: 15, price: '$1,500',
        who: 'Teams running paid campaigns that need a fresh batch of static creative without investing in a full production run. Useful for testing new hooks or refreshing existing campaigns.',
        have: '5 static ads designed for performance, sized for your channel, with copy and creative variations built in for testing.',
        deliverables: [{ label: '5 static ads' }, { label: '1 channel format' }, { label: 'Copy variations' }, { label: 'Platform-sized exports' }],
        turnaround: '3-4 days', target: 'Performance Ads',
        metrics: ['CTR', 'CPC', 'ROAS'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Channel, hook, and creative direction confirmed',           deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '5 ads designed with copy and variation built in',           deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Platform-sized exports ready to upload and test',           deliverables: [] },
        ],
      },
      {
        name: 'Static ad set - batch of 10', hours: 29, price: '$2,900',
        who: 'Performance teams that test systematically and need enough creative variation to identify what works before scaling spend.',
        have: '10 ads across multiple formats and creative angles, with intentional A/B variations that give the algorithm something meaningful to optimize against.',
        deliverables: [{ label: '10 static ads' }, { label: 'Multi-format' }, { label: 'A/B creative variations' }, { label: 'Platform exports per format' }],
        turnaround: '5-7 days', target: 'Performance Ads',
        metrics: ['CTR by variant', 'CPC', 'ROAS', 'Creative learning'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Channels, formats, and A/B test angles confirmed',          deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '10 ads built with intentional variation across angles',     deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'All formats exported, labelled, and ready to test',         deliverables: [] },
        ],
      },
      {
        name: 'Video ad - short', hours: 23, price: '$3,300',
        who: 'Performance teams that want video ads without a shoot. Works from existing brand films, product footage, or social content cut down to a performance length.',
        have: 'A 6-15s video ad edited, captioned, and optimized for your paid channel, ready to upload and run.',
        deliverables: [{ label: '6-15s video ad' }, { label: 'Captions' }, { label: 'Sound design' }, { label: 'Platform-optimized export' }],
        turnaround: '3-5 days', target: 'Performance Video',
        metrics: ['View-through rate', 'CTR', 'CPC'],
        flow: [
          { icon: 'search', label: 'Review',    sub: 'Existing footage reviewed for usable selects',                  deliverables: [] },
          { icon: 'bolt',   label: 'Edit',      sub: 'Video cut to 6-15s performance format with caption + sound',    deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Exported and ready to run on paid channel',                     deliverables: [] },
        ],
      },
      {
        name: 'Video ad set - batch of 3', hours: 37, price: '$5,200',
        who: 'Performance teams running video ads across multiple platforms who need creative that is native to each channel, not just a generic resize.',
        have: '3 video ads platform-tailored for where they will run, with captions and sound design optimized per channel.',
        deliverables: [{ label: '3 video ads' }, { label: 'Platform-native formats' }, { label: 'Captions' }, { label: 'Sound design per platform' }],
        turnaround: '1-2 weeks', target: 'Performance Video',
        metrics: ['View-through rate', 'CTR per platform', 'ROAS'],
        flow: [
          { icon: 'brain',  label: 'Brief',     sub: 'Platforms, formats, and source footage confirmed',             deliverables: [] },
          { icon: 'bolt',   label: 'Edit',      sub: '3 ads cut and tailored per platform format',                   deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'All 3 versions exported and ready to upload',                  deliverables: [] },
        ],
      },
      {
        name: 'Display ad campaign', hours: 29, price: '$3,100',
        who: 'Teams running programmatic or display campaigns that need a full banner set without managing individual asset production. Covers every placement in one go.',
        have: 'A complete IAB banner set in all standard sizes, built from one cohesive creative concept, ready to upload to your DSP or ad network.',
        deliverables: [{ label: 'Full IAB banner set' }, { label: 'All standard sizes' }, { label: '1 creative concept' }, { label: 'Ad network-ready exports' }],
        turnaround: '5-7 days', target: 'Display Ads',
        metrics: ['CTR', 'Impression-to-click rate', 'Display coverage'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Creative concept, messaging, and brand assets confirmed',    deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: 'Master concept adapted across all IAB sizes',               deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Complete banner set exported and ready to upload',           deliverables: [] },
        ],
      },
      {
        name: 'Always-on ad production', hours: 70, price: '$8,300',
        who: 'Performance teams running ongoing paid programs that need a reliable monthly creative supply. Prevents creative fatigue and gives the algorithm new angles to optimize against.',
        have: '~20 new ad variations per month, produced to a consistent brief and ready to rotate into live campaigns.',
        deliverables: [{ label: '~20 ad variations / month' }, { label: 'Static + motion mix' }, { label: 'Iterative testing framework' }, { label: 'Monthly delivery' }],
        turnaround: 'Monthly cadence', target: 'Always-On Ads',
        metrics: ['Creative refresh rate', 'Ad fatigue reduction', 'ROAS over time'],
        flow: [
          { icon: 'brain',  label: 'Monthly brief', sub: 'Hooks, angles, and formats set for the month',              deliverables: [] },
          { icon: 'bolt',   label: 'Production',    sub: '~20 variations produced against the testing matrix',         deliverables: [] },
          { icon: 'check',  label: 'Delivered',     sub: 'Full batch delivered ready to rotate into campaigns',        deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'email-newsletter', area: 'Email & Newsletter', num: 4,
    services: [
      {
        name: 'Email strategy & template plan', hours: 10, price: '$1,300',
        who: 'Teams building an email program from scratch or resetting one that has no clear structure. Useful before commissioning templates or writing any email sequences.',
        have: 'A documented email strategy: audience segmentation, cadence recommendations, content types by goal, and a template plan to build from.',
        deliverables: [{ label: 'Email strategy document' }, { label: 'Audience segmentation' }, { label: 'Cadence plan' }, { label: 'Template plan' }],
        turnaround: '3-4 days', target: 'Email Strategy',
        metrics: ['Strategy clarity', 'Program structure', 'Team alignment'],
        flow: [
          { icon: 'search', label: 'Audit',     sub: 'Existing email program and audience reviewed',              deliverables: [] },
          { icon: 'brain',  label: 'Define',    sub: 'Audience, cadence, content types, and template plan set',   deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Strategy document handed off ready to build from',          deliverables: [] },
        ],
      },
      {
        name: 'Emails - batch of 3', hours: 15, price: '$1,500',
        who: 'Teams that need email content on demand without running a full production program. Works as a top-up for campaign sequences, announcements, or promotional sends.',
        have: '3 fully designed emails coded and ready to import into your email service provider, on-brand and reviewed.',
        deliverables: [{ label: '3 designed emails' }, { label: 'ESP-ready code' }, { label: 'Brand-led design' }, { label: 'Copy-integrated' }],
        turnaround: '3-5 days', target: 'Email',
        metrics: ['Email readiness', 'Brand consistency', 'Open rate'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Goal, audience, and content for each email confirmed',       deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '3 emails designed, copy-integrated, and reviewed',           deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'ESP-ready code handed off for import and scheduling',        deliverables: [] },
        ],
      },
      {
        name: 'Emails - batch of 6', hours: 28, price: '$2,800',
        who: 'Teams running a campaign sequence or regular email program who need a reliable batch of send-ready emails.',
        have: '6 fully designed emails coded for your ESP, built as a cohesive set and ready to load and schedule.',
        deliverables: [{ label: '6 designed emails' }, { label: 'ESP-ready code' }, { label: 'Cohesive design system' }, { label: 'Copy-integrated' }],
        turnaround: '5-7 days', target: 'Email',
        metrics: ['Open rate', 'Click rate', 'Campaign readiness'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Sequence, goal, and content plan confirmed for all 6',       deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: '6 emails designed as a set and reviewed',                    deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Full batch coded and ready to import',                       deliverables: [] },
        ],
      },
      {
        name: 'Newsletter template system', hours: 42, price: '$5,100',
        who: 'Teams running a regular newsletter who want a modular, reusable template system rather than designing each issue from scratch.',
        have: 'A modular newsletter template with 4-6 component variants that can be assembled into any issue without breaking the design.',
        deliverables: [{ label: 'Modular newsletter template' }, { label: '4-6 component variants' }, { label: 'ESP-coded' }, { label: 'Team handoff documentation' }],
        turnaround: '1-2 weeks', target: 'Newsletter',
        metrics: ['Template adoption rate', 'Issue production speed', 'Design consistency'],
        flow: [
          { icon: 'brain', label: 'Architecture', sub: 'Template structure and component types defined',            deliverables: [] },
          { icon: 'bolt',  label: 'Build',        sub: 'Modular template built and all variants coded in ESP',      deliverables: [] },
          { icon: 'check', label: 'Handed off',   sub: 'Template documented and team trained to use it',            deliverables: [] },
        ],
      },
      {
        name: 'Campaign email series', hours: 22, price: '$2,200',
        who: 'Teams running a campaign, product launch, or lead nurture program that needs a short drip sequence rather than a full lifecycle program.',
        have: 'A 3-5 email drip series with copy, design, and send logic mapped, coded for your ESP and ready to activate.',
        deliverables: [{ label: '3-5 email sequence' }, { label: 'Copy + design' }, { label: 'Send logic mapped' }, { label: 'ESP-ready code' }],
        turnaround: '5-7 days', target: 'Campaign Email',
        metrics: ['Open rate by email', 'Click rate', 'Sequence completion rate'],
        flow: [
          { icon: 'brain', label: 'Sequence brief', sub: 'Goal, audience, and email-by-email plan mapped',          deliverables: [] },
          { icon: 'bolt',  label: 'Write + design', sub: '3-5 emails written, designed, and reviewed',              deliverables: [] },
          { icon: 'check', label: 'Delivered',      sub: 'Coded for ESP with send logic documented',                deliverables: [] },
        ],
      },
      {
        name: 'Launch announcement email', hours: 24, price: '$2,800',
        who: 'Brands launching a product, feature, or campaign who want a polished email moment to match the investment in the launch itself.',
        have: 'A launch hero email with custom illustration and 2 follow-ups, all designed, copy-integrated, coded, and ready to schedule.',
        deliverables: [{ label: 'Hero launch email' }, { label: 'Custom illustration' }, { label: '2 follow-up emails' }, { label: 'ESP-ready code' }],
        turnaround: '5-7 days', target: 'Launch Email',
        metrics: ['Open rate', 'Click rate', 'Revenue from launch send'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Launch details, audience, and email structure confirmed',      deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: 'Hero email with illustration + 2 follow-ups designed',         deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'All 3 emails coded and ready to schedule for launch',          deliverables: [] },
        ],
      },
      {
        name: 'Editorial newsletter design', hours: 52, price: '$6,400',
        who: 'Brands starting a newsletter or migrating from a poorly-designed one. The design system does the heavy lifting so every issue looks polished without starting from scratch.',
        have: 'A recurring editorial newsletter design system and the first 3 issues produced, ready to send. Includes full ESP coding and team documentation.',
        deliverables: [{ label: 'Newsletter design system' }, { label: 'First 3 issues produced' }, { label: 'ESP-coded template' }, { label: 'Team documentation' }],
        turnaround: '2-3 weeks', target: 'Editorial Newsletter',
        metrics: ['Open rate', 'Click rate', 'Subscriber growth', 'Issue production time'],
        flow: [
          { icon: 'brain',  label: 'System design', sub: 'Layout, typography, and content components defined',        deliverables: [] },
          { icon: 'bolt',   label: 'Build + issues', sub: 'Design system built and first 3 issues produced',          deliverables: [] },
          { icon: 'check',  label: 'Handed off',    sub: 'Coded template + docs handed off to run independently',     deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'lifecycle', area: 'Lifecycle & Retention', num: 5,
    services: [
      {
        name: 'Lifecycle email program', hours: 56, price: '$6,400',
        who: 'Companies with a customer base that receives little or no systematic email communication after sign-up or purchase. Lifecycle programs prevent churn before it happens.',
        have: 'A complete lifecycle program with onboarding, nurture, and win-back flows: each email mapped, written, designed, and coded for your ESP.',
        deliverables: [{ label: 'Onboarding flow' }, { label: 'Nurture flow' }, { label: 'Win-back flow' }, { label: 'All emails coded + mapped' }],
        turnaround: '2-3 weeks', target: 'Lifecycle',
        metrics: ['Activation rate', 'Churn reduction', 'Win-back rate'],
        flow: [
          { icon: 'brain',  label: 'Map',           sub: 'Customer journey, triggers, and flow logic mapped',       deliverables: [] },
          { icon: 'bolt',   label: 'Write + design', sub: 'All emails written, designed, and reviewed',              deliverables: [] },
          { icon: 'check',  label: 'Delivered',      sub: 'Coded for ESP with triggers and logic documented',        deliverables: [] },
        ],
      },
      {
        name: 'Customer onboarding content', hours: 50, price: '$5,700',
        who: 'SaaS companies and service businesses where the customer experience after sign-up determines whether they stay. Poor onboarding is the most preventable cause of churn.',
        have: 'A complete onboarding content system: welcome emails, in-product messaging, guides, and checklist content that walks customers from sign-up to their first result.',
        deliverables: [{ label: 'Welcome email sequence' }, { label: 'In-product moments' }, { label: 'Onboarding guides' }, { label: 'Checklist content' }],
        turnaround: '2-3 weeks', target: 'Onboarding',
        metrics: ['Time to first value', 'Onboarding completion rate', 'Early churn rate'],
        flow: [
          { icon: 'search', label: 'Map journey',    sub: 'Onboarding steps, drop-off points, and content gaps identified', deliverables: [] },
          { icon: 'bolt',   label: 'Write + design', sub: 'Welcome emails, guides, and in-product moments produced',         deliverables: [] },
          { icon: 'check',  label: 'Delivered',      sub: 'All content coded and handed off for deployment',                 deliverables: [] },
        ],
      },
      {
        name: 'Loyalty / retention campaign', hours: 55, price: '$6,600',
        who: 'Companies seeing elevated churn, declining engagement, or a segment of customers going quiet. Also used proactively as an annual loyalty initiative.',
        have: 'A complete retention campaign: re-engagement sequence, loyalty reward creative, and supporting assets designed and ready to activate.',
        deliverables: [{ label: 'Re-engagement sequence' }, { label: 'Loyalty reward creative' }, { label: 'Supporting assets' }, { label: 'Campaign strategy' }],
        turnaround: '2-3 weeks', target: 'Retention',
        metrics: ['Re-engagement rate', 'Churn reduction', 'NPS lift'],
        flow: [
          { icon: 'brain',  label: 'Strategy',    sub: 'Audience segments, triggers, and loyalty mechanic defined',   deliverables: [] },
          { icon: 'bolt',   label: 'Production',  sub: 'Email sequence and loyalty creative produced',                 deliverables: [] },
          { icon: 'check',  label: 'Delivered',   sub: 'Campaign assets coded and ready to activate',                 deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'editorial', area: 'Editorial / Lead Magnets', num: 6,
    services: [
      {
        name: 'Content strategy & brief', hours: 12, price: '$1,700',
        who: 'Teams commissioning a report, guide, whitepaper, or any long-form content piece who want to get the strategy right before production starts.',
        have: 'A complete content brief: topic, audience, narrative arc, key arguments, structure, and success metrics, everything a writer or designer needs to produce the piece.',
        deliverables: [{ label: 'Content strategy' }, { label: 'Audience definition' }, { label: 'Narrative arc' }, { label: 'Structural outline' }],
        turnaround: '3-4 days', target: 'Content Strategy',
        metrics: ['Brief clarity', 'Production readiness', 'Stakeholder alignment'],
        flow: [
          { icon: 'search', label: 'Research',  sub: 'Topic, audience, and competitive content reviewed',         deliverables: [] },
          { icon: 'brain',  label: 'Brief',     sub: 'Narrative arc and structure defined and written up',         deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Content brief handed off ready for production',             deliverables: [] },
        ],
      },
      {
        name: 'One-pager / checklist', hours: 8, price: '$800',
        who: 'Sales teams that need a polished leave-behind, marketers creating a quick lead magnet, or anyone needing a designed document that represents the brand in a single page.',
        have: 'A designed, brand-led one-pager or checklist as a print-ready and screen-ready PDF, ready to use immediately.',
        deliverables: [{ label: '1-page designed PDF' }, { label: 'Print-ready version' }, { label: 'Screen-optimized version' }],
        turnaround: '2-3 days', target: 'Sales Enablement',
        metrics: ['Download rate', 'Sales use rate', 'Brand consistency'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Content, format, and use case confirmed',                    deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: 'One-pager designed, copy integrated, and reviewed',           deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'PDF handed off in print and screen versions',                 deliverables: [] },
        ],
      },
      {
        name: 'Short guide', hours: 25, price: '$2,900',
        who: 'Brands creating a practical how-to guide, checklist-led resource, or first entry in a lead magnet library. Works well as a top-of-funnel opt-in.',
        have: 'A 5-10 page designed guide as a PDF with light illustration, fully laid out, copy-integrated, and ready to distribute or gate.',
        deliverables: [{ label: '5-10 page designed guide' }, { label: 'Light illustration' }, { label: 'PDF (print + screen)' }],
        turnaround: '5-7 days', target: 'Lead Magnet',
        metrics: ['Download rate', 'Email list growth', 'Content engagement'],
        flow: [
          { icon: 'brain', label: 'Brief + outline', sub: 'Structure and content mapped before design begins',      deliverables: [] },
          { icon: 'bolt',  label: 'Design',          sub: 'Guide laid out with illustration and copy integrated',   deliverables: [] },
          { icon: 'check', label: 'Delivered',       sub: 'PDF handed off in print and screen versions',             deliverables: [] },
        ],
      },
      {
        name: 'Ebook / playbook', hours: 57, price: '$6,900',
        who: 'Brands creating a flagship content asset for lead generation, thought leadership, or sales enablement. The kind of resource someone saves and shares.',
        have: 'A fully designed 15-30 page ebook or playbook with custom layout, pull quotes, illustrations, and supporting graphics, a premium-feeling content asset ready to gate or distribute.',
        deliverables: [{ label: '15-30 page ebook/playbook' }, { label: 'Custom layout design' }, { label: 'Pull quotes + graphics' }, { label: 'PDF (print + screen)' }],
        turnaround: '2-3 weeks', target: 'Lead Magnet',
        metrics: ['Download rate', 'Lead quality', 'Time-on-content'],
        flow: [
          { icon: 'brain', label: 'Outline',   sub: 'Structure, narrative, and content planned section by section',  deliverables: [] },
          { icon: 'bolt',  label: 'Design',    sub: 'Custom layout built with all content integrated',               deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Final PDF handed off in all versions',                           deliverables: [] },
        ],
      },
      {
        name: 'Whitepaper', hours: 39, price: '$4,600',
        who: 'B2B companies in expert-led categories where buyers do serious research before engaging. Whitepapers work as gated downloads, analyst outreach tools, and conference materials.',
        have: 'A fully produced 10-20 page whitepaper with editorial design, structured argument, and a professional look that holds up in the rooms where it matters.',
        deliverables: [{ label: '10-20 page whitepaper' }, { label: 'Editorial layout design' }, { label: 'PDF (print + digital)' }],
        turnaround: '1-2 weeks', target: 'Thought Leadership',
        metrics: ['Download rate', 'Analyst engagement', 'Lead quality'],
        flow: [
          { icon: 'brain', label: 'Argument',       sub: 'Thesis, structure, and section plan defined',                 deliverables: [] },
          { icon: 'bolt',  label: 'Write + design', sub: 'Whitepaper written and laid out in editorial format',          deliverables: [] },
          { icon: 'check', label: 'Delivered',      sub: 'Final PDF handed off for gating or distribution',              deliverables: [] },
        ],
      },
      {
        name: 'Industry report', hours: 85, price: '$10,400',
        who: 'Companies with original data or a strong point of view on a category that want to publish a report others reference and share. The strongest B2B lead magnets available.',
        have: 'A fully produced 20-40 page industry report with custom data visualizations, charts, editorial design, and a layout that invites reading from cover to cover.',
        deliverables: [{ label: '20-40 page industry report' }, { label: 'Custom data visualizations' }, { label: 'Charts + infographics' }, { label: 'Custom layout' }],
        turnaround: '3-4 weeks', target: 'Thought Leadership',
        metrics: ['Downloads', 'Media coverage', 'Backlinks', 'Lead quality'],
        flow: [
          { icon: 'brain', label: 'Research + brief', sub: 'Data, narrative, and structure defined',                  deliverables: [] },
          { icon: 'bolt',  label: 'Design + produce', sub: 'Charts, data viz, and full layout built',                 deliverables: [] },
          { icon: 'check', label: 'Delivered',        sub: 'Report handed off in all formats for distribution',        deliverables: [] },
        ],
      },
      {
        name: 'Template kit', hours: 27, price: '$2,900',
        who: 'Brands whose audience has a workflow where templates provide immediate utility. Works as a lead magnet, a content upgrade, or a standalone product.',
        have: 'A kit of 5-10 branded, usable templates in Notion, Figma, or Google Slides, packaged and ready to gate or share.',
        deliverables: [{ label: '5-10 branded templates' }, { label: 'Notion/Figma/Slides format' }, { label: 'Usage guide' }, { label: 'Packaged for distribution' }],
        turnaround: '5-7 days', target: 'Lead Magnet',
        metrics: ['Download rate', 'Template use rate', 'Email list growth'],
        flow: [
          { icon: 'brain', label: 'Brief',     sub: 'Template types, platform, and audience confirmed',              deliverables: [] },
          { icon: 'bolt',  label: 'Build',     sub: '5-10 templates built in the agreed platform and reviewed',      deliverables: [] },
          { icon: 'check', label: 'Delivered', sub: 'Kit packaged and ready for gating or distribution',             deliverables: [] },
        ],
      },
      {
        name: 'Lead magnet bundle', hours: 81, price: '$9,900',
        who: 'Brands running a list-building campaign who need everything to work together. The guide alone does not grow a list: the full system does.',
        have: 'A complete lead generation system: designed guide, converting landing page, 3-email follow-up sequence, and 4 social posts to drive traffic to it.',
        deliverables: [{ label: 'Designed guide (lead magnet)' }, { label: 'Landing page' }, { label: '3-email follow-up sequence' }, { label: '4 social posts' }],
        turnaround: '3-4 weeks', target: 'Lead Generation',
        metrics: ['Lead volume', 'Cost per lead', 'Email open rate', 'List growth'],
        flow: [
          { icon: 'brain',  label: 'Strategy',    sub: 'Lead magnet topic, funnel, and distribution plan defined',   deliverables: [] },
          { icon: 'bolt',   label: 'Production',  sub: 'Guide, page, emails, and social posts produced in parallel', deliverables: [] },
          { icon: 'check',  label: 'Delivered',   sub: 'Full system handed off ready to activate',                   deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'copy-scripts', area: 'Copy & Scripts', num: 7,
    services: [
      {
        name: 'Campaign copy', hours: 10, price: '$1,400',
        who: 'Marketing teams that have a campaign concept but need the copy written. Works as a standalone service or as input into a broader production run.',
        have: 'A campaign copy document with headlines, taglines, and body copy written for every asset in the campaign, reviewed and ready to hand to design.',
        deliverables: [{ label: 'Campaign headlines' }, { label: 'Taglines' }, { label: 'Body copy per asset' }, { label: 'Copy document' }],
        turnaround: '3-4 days', target: 'Campaign Copy',
        metrics: ['Copy clarity', 'Message consistency', 'Design handoff readiness'],
        flow: [
          { icon: 'brain',  label: 'Brief',     sub: 'Campaign goal, audience, tone, and asset list confirmed',     deliverables: [] },
          { icon: 'bolt',   label: 'Write',     sub: 'All copy written across headlines, taglines, and body',        deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Copy document handed off ready for design and production',     deliverables: [] },
        ],
      },
      {
        name: 'Website copy', hours: 21, price: '$2,900',
        who: 'Companies building or redesigning a website who need copy that works: structured for scanning, written for conversion, and on-brand throughout.',
        have: 'Fully written copy for 5-8 website pages, structured around conversion goals and written in a consistent brand voice, ready to hand to development.',
        deliverables: [{ label: '5-8 pages of website copy' }, { label: 'Header + body + CTA per page' }, { label: 'SEO structure' }, { label: 'Copy document' }],
        turnaround: '5-7 days', target: 'Website Copy',
        metrics: ['Page conversion rate', 'Bounce rate', 'Copy clarity'],
        flow: [
          { icon: 'search', label: 'Audit',     sub: 'Existing copy, site goals, and audience reviewed',             deliverables: [] },
          { icon: 'bolt',   label: 'Write',     sub: '5-8 pages written and structured for conversion',              deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Final copy document handed off ready for build',               deliverables: [] },
        ],
      },
      {
        name: 'Long-form content piece', hours: 12, price: '$1,700',
        who: 'Brands that need a well-written, substantive piece of content for their blog, a publication, or a newsletter. Written to be read and shared, not ghostwritten filler.',
        have: 'A fully written, edited long-form content piece ready to publish: structured, on-brand, and written at a standard that represents the company well.',
        deliverables: [{ label: 'Long-form content piece' }, { label: 'Structured + edited draft' }, { label: 'Publication-ready copy' }],
        turnaround: '3-5 days', target: 'Thought Leadership',
        metrics: ['Time on page', 'Shares', 'Backlinks earned'],
        flow: [
          { icon: 'brain',  label: 'Brief',     sub: 'Topic, angle, audience, and length confirmed',                deliverables: [] },
          { icon: 'bolt',   label: 'Write',     sub: 'Piece researched, written, and edited',                       deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Publication-ready copy handed off',                           deliverables: [] },
        ],
      },
      {
        name: 'Ad & social copy - batch', hours: 12, price: '$1,600',
        who: 'Performance teams or social managers who need a bank of copy options to test and deploy, rather than writing individual units in-house.',
        have: '~15 short-form copy units written for your channels: ad headlines, social captions, and CTAs ready to pair with creative or schedule directly.',
        deliverables: [{ label: '~15 copy units' }, { label: 'Multi-channel format' }, { label: 'Headlines + captions + CTAs' }, { label: 'Copy document' }],
        turnaround: '2-3 days', target: 'Short-form Copy',
        metrics: ['Copy variety', 'A/B test readiness', 'Channel coverage'],
        flow: [
          { icon: 'brain',  label: 'Brief',     sub: 'Channels, formats, tone, and objectives confirmed',           deliverables: [] },
          { icon: 'bolt',   label: 'Write',     sub: '~15 copy units written across all specified formats',         deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Copy document handed off ready to pair with creative',        deliverables: [] },
        ],
      },
      {
        name: 'Scriptwriting', hours: 11, price: '$1,600',
        who: 'Teams producing a video, animation, or motion piece who need a script before production begins. Works for brand films, explainers, product demos, or social video.',
        have: 'A fully written script with scene-by-scene direction, timing notes, and a voiceover-ready final draft handed off to production.',
        deliverables: [{ label: 'Final script' }, { label: 'Scene breakdown' }, { label: 'Timing notes' }, { label: 'Voiceover-ready draft' }],
        turnaround: '3-4 days', target: 'Video Production',
        metrics: ['Script clarity', 'Production readiness', 'Message accuracy'],
        flow: [
          { icon: 'brain',  label: 'Brief',     sub: 'Video goal, length, tone, and scene structure agreed',        deliverables: [] },
          { icon: 'bolt',   label: 'Write',     sub: 'Script written with timing and direction included',           deliverables: [] },
          { icon: 'check',  label: 'Delivered', sub: 'Final script handed off ready for production',                deliverables: [] },
        ],
      },
    ],
  },
  {
    id: 'ai-content', area: 'AI Content', num: 8,
    services: [
      {
        name: 'AI-generated content batch', hours: 24, price: '$2,800',
        who: 'Teams that need more content faster without sacrificing brand accuracy. Works for social, copy, or visual content where volume is the constraint.',
        have: 'A batch of AI-assisted content assets, social posts, copy units, or visual content, human-directed and quality-controlled to meet your brand standard.',
        deliverables: [{ label: 'AI-assisted content batch' }, { label: 'Human quality control' }, { label: 'Brand-aligned output' }, { label: 'Export-ready files' }],
        turnaround: '5-7 days', target: 'AI Content',
        metrics: ['Production volume', 'Brand accuracy rate', 'Time saved vs manual'],
        flow: [
          { icon: 'brain',  label: 'Brief + setup',  sub: 'Content type, volume, and brand parameters defined',       deliverables: [] },
          { icon: 'bolt',   label: 'AI + human QC',  sub: 'AI generates at scale; humans direct and quality-control', deliverables: [] },
          { icon: 'check',  label: 'Delivered',      sub: 'Approved content batch handed off ready to use',           deliverables: [] },
        ],
      },
      {
        name: 'AI creative pipeline setup', hours: 70, price: '$10,200',
        who: 'Content and marketing teams that want to produce more output without adding headcount. The pipeline does the heavy lifting; the team directs and approves.',
        have: 'A custom AI content pipeline built for your team: tools configured, prompts engineered, workflows documented, and team trained to operate it independently.',
        deliverables: [{ label: 'Custom AI pipeline' }, { label: 'Prompt library' }, { label: 'Workflow documentation' }, { label: 'Team training' }],
        turnaround: '2-3 weeks', target: 'AI Pipeline',
        metrics: ['Content output increase', 'Production time reduction', 'Team adoption rate'],
        flow: [
          { icon: 'search', label: 'Audit',      sub: 'Current workflow, tools, and content types reviewed',          deliverables: [] },
          { icon: 'bolt',   label: 'Build',      sub: 'Pipeline built: tools configured, prompts engineered',         deliverables: [] },
          { icon: 'check',  label: 'Handed off', sub: 'Team trained and documentation handed off to run it',          deliverables: [] },
        ],
      },
    ],
  },
]

const BRAND_SERVICES = [
  {
    id: 'identity-foundation',
    area: 'Identity Foundation',
    num: 1,
    services: [
      {
        name: 'Brand strategy',
        hours: 26,
        price: '$3,800',
        who: 'Founders and brand leaders who need a clear strategic foundation before visual work begins. Best for teams that feel misaligned on positioning or messaging.',
        have: 'A concise strategy document covering positioning, audience, and brand voice. Ready to brief designers, writers, and agencies.',
        deliverables: [
          { label: 'Positioning statement' },
          { label: 'Target audience profiles' },
          { label: 'Brand voice principles' },
          { label: 'Competitive landscape summary' },
        ],
        turnaround: '1-2 weeks',
        target: 'Strategy',
        metrics: ['Message clarity score', 'Team alignment rating', 'Brief-to-execution speed'],
        flow: [
          { icon: 'search', label: 'Discovery', sub: 'Stakeholder interviews, competitive audit, and audience research', deliverables: [] },
          { icon: 'strategy', label: 'Synthesis', sub: 'Distill findings into positioning territory and brand pillars', deliverables: ['Positioning statement', 'Competitive landscape summary'] },
          { icon: 'check', label: 'Delivery', sub: 'Present final strategy document and walk through application', deliverables: ['Target audience profiles', 'Brand voice principles'] },
        ],
      },
      {
        name: 'Brand sprint',
        hours: 84,
        price: '$10,500',
        who: 'Early-stage companies or teams launching a new product line who need brand fundamentals fast. Ideal when you have weeks, not months.',
        have: 'A complete starter brand kit: strategy, logo, color, type, and basic usage guidelines. Enough to launch and communicate consistently.',
        deliverables: [
          { label: 'Brand strategy doc' },
          { label: 'Logo suite (primary + lockups)' },
          { label: 'Color and type system' },
          { label: 'Usage guidelines PDF' },
        ],
        turnaround: '3-4 weeks',
        target: 'Startup',
        metrics: ['Time to launch', 'Brand consistency score', 'Stakeholder sign-off speed'],
        flow: [
          { icon: 'search', label: 'Align', sub: 'Rapid discovery session to lock strategy, audience, and creative direction', deliverables: ['Brand strategy doc'] },
          { icon: 'eye', label: 'Design', sub: 'Logo and visual identity development across two focused rounds', deliverables: ['Logo suite (primary + lockups)', 'Color and type system'] },
          { icon: 'check', label: 'Package', sub: 'Compile all assets and guidelines for handoff', deliverables: ['Usage guidelines PDF'] },
        ],
      },
      {
        name: 'Brand system',
        hours: 254,
        price: '$32,100',
        who: 'Growing companies that need a full-scale brand identity built to last. Best for teams preparing for a market push, fundraise, or major relaunch.',
        have: 'A comprehensive brand system including strategy, full visual identity, messaging framework, and a brand guidelines document your whole team can use.',
        deliverables: [
          { label: 'Full brand guidelines document' },
          { label: 'Logo suite and asset library' },
          { label: 'Messaging and tone-of-voice framework' },
          { label: 'Template starter kit' },
        ],
        turnaround: '8-12 weeks',
        target: 'Scale-up',
        metrics: ['Brand recognition lift', 'Internal adoption rate', 'Asset reuse rate'],
        flow: [
          { icon: 'search', label: 'Research', sub: 'Deep-dive discovery including stakeholder interviews, audience research, and competitive analysis', deliverables: ['Messaging and tone-of-voice framework'] },
          { icon: 'eye', label: 'Build', sub: 'Strategy, visual identity, and messaging developed in parallel with structured feedback loops', deliverables: ['Logo suite and asset library'] },
          { icon: 'check', label: 'Deliver', sub: 'Guidelines document, asset library, and templates packaged for internal rollout', deliverables: ['Full brand guidelines document', 'Template starter kit'] },
        ],
      },
      {
        name: 'Brand platform',
        hours: 428,
        price: '$54,300',
        who: 'Established organizations undergoing transformation, expansion, or a full rebrand. Suited for companies with complex audiences and multi-channel needs.',
        have: 'An enterprise-grade brand platform covering every dimension of brand: strategy, identity, messaging, campaign direction, and governance documentation.',
        deliverables: [
          { label: 'Brand strategy and positioning' },
          { label: 'Full visual identity system' },
          { label: 'Campaign concept and creative direction' },
          { label: 'Brand governance and rollout plan' },
        ],
        turnaround: '14-20 weeks',
        target: 'Enterprise',
        metrics: ['Brand equity index', 'Cross-channel consistency', 'Campaign launch readiness'],
        flow: [
          { icon: 'search', label: 'Discover', sub: 'Comprehensive research phase: stakeholder workshops, market mapping, and audience segmentation', deliverables: ['Brand strategy and positioning'] },
          { icon: 'strategy', label: 'Create', sub: 'Full identity, messaging, and campaign concept development with iterative client reviews', deliverables: ['Full visual identity system', 'Campaign concept and creative direction'] },
          { icon: 'check', label: 'Govern', sub: 'Finalize governance documentation and plan enterprise rollout', deliverables: ['Brand governance and rollout plan'] },
        ],
      },
      {
        name: 'Brand refresh',
        hours: 144,
        price: '$17,600',
        who: 'Brands that have solid foundations but look dated or feel misaligned with where the business has grown. Not a rebrand, but a meaningful evolution.',
        have: 'An updated identity that feels current and cohesive, with revised guidelines, refreshed assets, and a clear before-and-after story for stakeholders.',
        deliverables: [
          { label: 'Refreshed logo and mark' },
          { label: 'Updated color and type system' },
          { label: 'Revised brand guidelines' },
          { label: 'Asset migration guide' },
        ],
        turnaround: '5-8 weeks',
        target: 'Evolution',
        metrics: ['Audience perception shift', 'Asset adoption speed', 'Design system coverage'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review existing brand assets, identify gaps, and establish refresh scope', deliverables: [] },
          { icon: 'eye', label: 'Refresh', sub: 'Update identity elements with two structured rounds of creative review', deliverables: ['Refreshed logo and mark', 'Updated color and type system'] },
          { icon: 'check', label: 'Handoff', sub: 'Deliver revised guidelines and migration guide for consistent rollout', deliverables: ['Revised brand guidelines', 'Asset migration guide'] },
        ],
      },
      {
        name: 'Naming & verbal identity',
        hours: 33,
        price: '$4,800',
        who: 'Companies launching a new brand, product, or sub-brand that need a name and voice built together. Especially useful when the name needs to carry strategic weight.',
        have: 'A vetted brand name, tagline candidates, and a verbal identity guide that gives your team the words and tone to communicate consistently.',
        deliverables: [
          { label: 'Name candidates with rationale' },
          { label: 'Tagline options' },
          { label: 'Verbal identity guide' },
          { label: 'Trademark screening report' },
        ],
        turnaround: '2-3 weeks',
        target: 'Naming',
        metrics: ['Name recall score', 'Trademark clearance rate', 'Voice consistency rating'],
        flow: [
          { icon: 'search', label: 'Define', sub: 'Brand positioning and naming criteria workshop to align on strategic direction', deliverables: [] },
          { icon: 'copy', label: 'Generate', sub: 'Name exploration across multiple territories with trademark screening', deliverables: ['Name candidates with rationale', 'Tagline options', 'Trademark screening report'] },
          { icon: 'check', label: 'Finalize', sub: 'Lock name and deliver verbal identity guide', deliverables: ['Verbal identity guide'] },
        ],
      },
      {
        name: 'Copy audit & voice guide',
        hours: 19,
        price: '$2,700',
        who: 'Teams whose copy feels inconsistent across channels, or who are onboarding new writers and need a shared standard. Works well before a content push.',
        have: 'A documented audit of your current copy with specific recommendations, plus a practical voice guide your team can use immediately.',
        deliverables: [
          { label: 'Copy audit report' },
          { label: 'Brand voice guide' },
          { label: 'Tone-of-voice examples (do/avoid)' },
        ],
        turnaround: '1-2 weeks',
        target: 'Voice',
        metrics: ['Copy consistency score', 'Onboarding time for new writers', 'Voice guide adoption rate'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review existing copy across key channels and identify voice inconsistencies', deliverables: ['Copy audit report'] },
          { icon: 'copy', label: 'Build', sub: 'Develop voice principles with annotated examples', deliverables: ['Tone-of-voice examples (do/avoid)'] },
          { icon: 'check', label: 'Deliver', sub: 'Package and present the voice guide with a walkthrough for the team', deliverables: ['Brand voice guide'] },
        ],
      },
      {
        name: 'Moodboard & creative territories',
        hours: 24,
        price: '$3,100',
        who: 'Teams at the start of a creative project who need to align on visual direction before design begins. Saves rounds of revision downstream.',
        have: 'Two to three distinct creative territory moodboards with rationale, plus a recommended direction and brief for the production team.',
        deliverables: [
          { label: 'Creative territory moodboards (x3)' },
          { label: 'Direction rationale' },
          { label: 'Creative brief for production' },
        ],
        turnaround: '3-5 days',
        target: 'Direction',
        metrics: ['Stakeholder alignment score', 'Revision rounds saved', 'Brief-to-production speed'],
        flow: [
          { icon: 'search', label: 'Explore', sub: 'Research and gather visual references across three distinct creative directions', deliverables: [] },
          { icon: 'eye', label: 'Present', sub: 'Present moodboards with direction rationale for team feedback', deliverables: ['Creative territory moodboards (x3)', 'Direction rationale'] },
          { icon: 'check', label: 'Brief', sub: 'Lock chosen direction and write the creative brief for production', deliverables: ['Creative brief for production'] },
        ],
      },
    ],
  },
  {
    id: 'sales-decks',
    area: 'Sales & Decks',
    num: 2,
    services: [
      {
        name: 'Deck strategy & narrative',
        hours: 12,
        price: '$1,700',
        who: 'Teams with a deck that already exists but isn\'t landing. Useful before a redesign so the story is airtight before design begins.',
        have: 'A reordered narrative outline with slide-by-slide messaging guidance and the key argument clearly articulated.',
        deliverables: [
          { label: 'Narrative structure document' },
          { label: 'Slide-by-slide messaging guide' },
          { label: 'Recommended flow diagram' },
        ],
        turnaround: '3-5 days',
        target: 'Strategy',
        metrics: ['Meeting-to-next-step rate', 'Stakeholder comprehension score', 'Deck completion rate'],
        flow: [
          { icon: 'search', label: 'Review', sub: 'Audit current deck for narrative gaps and structural issues', deliverables: [] },
          { icon: 'strategy', label: 'Restructure', sub: 'Rebuild the story arc with clear argument and slide purpose defined for each section', deliverables: ['Narrative structure document', 'Recommended flow diagram'] },
          { icon: 'check', label: 'Guide', sub: 'Deliver slide-by-slide messaging brief for the design team', deliverables: ['Slide-by-slide messaging guide'] },
        ],
      },
      {
        name: 'Deck refresh',
        hours: 15,
        price: '$1,500',
        who: 'Teams with a solid deck that just looks dated or off-brand. Fast lift to bring it in line with current brand standards.',
        have: 'A visually refreshed deck with updated typography, color, and layout applied consistently across all slides.',
        deliverables: [
          { label: 'Refreshed slide deck file' },
          { label: 'Slide master / template' },
          { label: 'Brand-aligned asset replacements' },
        ],
        turnaround: '3-5 days',
        target: 'Refresh',
        metrics: ['Visual consistency score', 'Brand compliance rate', 'Presenter confidence rating'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review all slides for brand alignment and identify refresh priorities', deliverables: [] },
          { icon: 'eye', label: 'Redesign', sub: 'Apply updated brand treatment to layout, type, color, and imagery', deliverables: ['Brand-aligned asset replacements'] },
          { icon: 'check', label: 'Deliver', sub: 'Hand off final deck and editable slide master', deliverables: ['Refreshed slide deck file', 'Slide master / template'] },
        ],
      },
      {
        name: 'Sales deck (short)',
        hours: 26,
        price: '$2,800',
        who: 'Sales teams that need a concise, visually sharp leave-behind or intro deck. Typically 8-12 slides built for top-of-funnel conversations.',
        have: 'A polished short-form sales deck that communicates the core offer, differentiators, and next step clearly and quickly.',
        deliverables: [
          { label: 'Designed deck (8-12 slides)' },
          { label: 'Editable source file' },
          { label: 'PDF export' },
        ],
        turnaround: '1-2 weeks',
        target: 'Sales',
        metrics: ['Prospect engagement rate', 'Slide-read-through rate', 'Meeting conversion rate'],
        flow: [
          { icon: 'strategy', label: 'Brief', sub: 'Align on story, audience, use case, and key messages', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Build and refine deck across two creative rounds', deliverables: ['Designed deck (8-12 slides)'] },
          { icon: 'check', label: 'Deliver', sub: 'Final files and PDF ready for sales team use', deliverables: ['Editable source file', 'PDF export'] },
        ],
      },
      {
        name: 'Sales deck (full)',
        hours: 60,
        price: '$7,100',
        who: 'Sales teams preparing for major deals or strategic partnerships that require a comprehensive, deeply designed deck. Usually 20-35 slides.',
        have: 'A high-production sales deck with custom visuals, strong narrative, and a clear call to action. Built to close.',
        deliverables: [
          { label: 'Fully designed deck (20-35 slides)' },
          { label: 'Custom data visualizations' },
          { label: 'Editable source file' },
          { label: 'PDF and presentation-ready export' },
        ],
        turnaround: '3-5 weeks',
        target: 'Sales',
        metrics: ['Win rate lift', 'Deal size influence', 'Presenter confidence score'],
        flow: [
          { icon: 'strategy', label: 'Narrative', sub: 'Story architecture session to define argument, structure, and slide purpose', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Full deck production with custom visuals and three rounds of refinement', deliverables: ['Fully designed deck (20-35 slides)', 'Custom data visualizations'] },
          { icon: 'check', label: 'Deliver', sub: 'Package all files for immediate use in live presentations and async sharing', deliverables: ['Editable source file', 'PDF and presentation-ready export'] },
        ],
      },
      {
        name: 'Investor / pitch deck',
        hours: 77,
        price: '$9,700',
        who: 'Founders preparing for a fundraise who need a deck that tells a compelling story to sophisticated investors. Seed through Series B.',
        have: 'A pitch-ready investor deck with a tight narrative, strong visual identity, and the data presented clearly enough to hold a room.',
        deliverables: [
          { label: 'Investor deck (12-20 slides)' },
          { label: 'Narrative and messaging framework' },
          { label: 'Data slide design' },
          { label: 'Editable source file' },
        ],
        turnaround: '4-6 weeks',
        target: 'Fundraise',
        metrics: ['Investor meeting conversion', 'Deck-to-term-sheet rate', 'Follow-up request rate'],
        flow: [
          { icon: 'search', label: 'Story', sub: 'Define the investment thesis, market narrative, and key proof points', deliverables: ['Narrative and messaging framework'] },
          { icon: 'eye', label: 'Design', sub: 'Build the deck with investor-optimized flow and clear data visualization', deliverables: ['Investor deck (12-20 slides)', 'Data slide design'] },
          { icon: 'check', label: 'Refine', sub: 'Final polish rounds and delivery of presentation-ready and leave-behind formats', deliverables: ['Editable source file'] },
        ],
      },
      {
        name: 'Keynote / event deck',
        hours: 70,
        price: '$8,700',
        who: 'Speakers and executives presenting at conferences, company events, or industry stages who need a high-production deck that performs live.',
        have: 'A visually compelling stage-ready deck with slide animations, speaker notes, and a narrative arc designed to hold an audience.',
        deliverables: [
          { label: 'Stage-ready presentation deck' },
          { label: 'Speaker notes document' },
          { label: 'Slide animation guide' },
          { label: 'Backup PDF version' },
        ],
        turnaround: '3-5 weeks',
        target: 'Events',
        metrics: ['Audience engagement score', 'Social share rate post-event', 'Speaker confidence rating'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Map the talk arc, key moments, and visual treatment with the presenter', deliverables: [] },
          { icon: 'eye', label: 'Build', sub: 'Design full deck with animation and stage-optimized layout', deliverables: ['Stage-ready presentation deck', 'Slide animation guide'] },
          { icon: 'check', label: 'Prep', sub: 'Final deck, speaker notes, and backup exports delivered before the event', deliverables: ['Speaker notes document', 'Backup PDF version'] },
        ],
      },
      {
        name: 'Webinar slide deck',
        hours: 30,
        price: '$3,400',
        who: 'Marketing and demand-gen teams running educational webinars or virtual events who need a deck that reads well on screen and keeps audiences engaged.',
        have: 'A clean, screen-optimized webinar deck with consistent visual structure and enough flexibility for the presenter to riff.',
        deliverables: [
          { label: 'Webinar slide deck' },
          { label: 'Slide master template' },
          { label: 'PDF export for follow-up distribution' },
        ],
        turnaround: '1-2 weeks',
        target: 'Content',
        metrics: ['Attendee retention rate', 'Post-webinar content downloads', 'Presenter-to-slide sync rating'],
        flow: [
          { icon: 'strategy', label: 'Outline', sub: 'Brief on webinar structure, audience level, and key takeaways per section', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Build screen-optimized deck with two rounds of review', deliverables: ['Webinar slide deck'] },
          { icon: 'check', label: 'Package', sub: 'Deliver final deck, reusable template, and PDF for post-event distribution', deliverables: ['Slide master template', 'PDF export for follow-up distribution'] },
        ],
      },
      {
        name: 'Deck template system',
        hours: 50,
        price: '$5,800',
        who: 'Teams that produce decks regularly and need a system anyone can use. Eliminates the one-off design requests and keeps everything on-brand.',
        have: 'A fully designed slide master with 20+ layout options, brand-locked styles, and a usage guide so the team can build decks independently.',
        deliverables: [
          { label: 'Slide master with 20+ layouts' },
          { label: 'Brand-locked color and type styles' },
          { label: 'Icon and asset library' },
          { label: 'Deck usage guide' },
        ],
        turnaround: '3-4 weeks',
        target: 'System',
        metrics: ['Self-serve deck rate', 'Brand consistency score', 'Design request volume reduction'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review existing deck patterns and identify the full range of layout needs', deliverables: [] },
          { icon: 'eye', label: 'Build', sub: 'Design the master template with all layouts, styles, and asset library', deliverables: ['Slide master with 20+ layouts', 'Brand-locked color and type styles', 'Icon and asset library'] },
          { icon: 'check', label: 'Enable', sub: 'Deliver template and run a team walkthrough using the usage guide', deliverables: ['Deck usage guide'] },
        ],
      },
      {
        name: 'Board / leadership deck',
        hours: 42,
        price: '$4,900',
        who: 'Executives presenting to boards, investors, or leadership teams on a regular cadence who need decks that are precise, credible, and efficient.',
        have: 'A polished board-ready deck with clear data presentation, executive summary structure, and a reusable format for recurring meetings.',
        deliverables: [
          { label: 'Board meeting deck' },
          { label: 'Reusable slide framework' },
          { label: 'Data visualization set' },
          { label: 'Executive summary template' },
        ],
        turnaround: '2-3 weeks',
        target: 'Leadership',
        metrics: ['Board meeting efficiency', 'Data clarity rating', 'Deck reuse rate'],
        flow: [
          { icon: 'search', label: 'Brief', sub: 'Understand board audience, recurring structure, and key metrics to track', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Build the deck with credibility-first layout and clear data hierarchy', deliverables: ['Board meeting deck', 'Data visualization set'] },
          { icon: 'check', label: 'Systematize', sub: 'Deliver reusable framework and executive summary template for future meetings', deliverables: ['Reusable slide framework', 'Executive summary template'] },
        ],
      },
    ],
  },
  {
    id: 'campaign-concepts',
    area: 'Campaign Concepts',
    num: 3,
    services: [
      {
        name: 'Campaign strategy & concepts',
        hours: 16,
        price: '$2,400',
        who: 'Marketing teams kicking off a campaign who need a strategic foundation and at least one creative direction before execution begins.',
        have: 'A campaign brief with clear objectives, a defined audience, and two to three conceptual territories to choose from.',
        deliverables: [
          { label: 'Campaign strategy brief' },
          { label: 'Concept territories (x2-3)' },
          { label: 'Recommended direction rationale' },
        ],
        turnaround: '3-5 days',
        target: 'Strategy',
        metrics: ['Concept approval speed', 'Campaign clarity score', 'Brief-to-execution time'],
        flow: [
          { icon: 'search', label: 'Discover', sub: 'Stakeholder brief, audience research, and competitive scan', deliverables: ['Campaign strategy brief'] },
          { icon: 'strategy', label: 'Concept', sub: 'Develop multiple creative territories with visual and verbal direction', deliverables: ['Concept territories (x2-3)'] },
          { icon: 'check', label: 'Recommend', sub: 'Present territories with rationale and recommended direction for client decision', deliverables: ['Recommended direction rationale'] },
        ],
      },
      {
        name: 'Concept sprint',
        hours: 56,
        price: '$7,500',
        who: 'Teams that need a fully developed campaign concept fast. Good for time-sensitive launches or when you need something strong to get internal buy-in.',
        have: 'One fully developed campaign concept with moodboard, messaging, and sample executions across at least two formats.',
        deliverables: [
          { label: 'Campaign concept document' },
          { label: 'Creative moodboard' },
          { label: 'Sample executions (x2 formats)' },
          { label: 'Messaging framework' },
        ],
        turnaround: '2-3 weeks',
        target: 'Sprint',
        metrics: ['Internal approval rate', 'Concept-to-production speed', 'Stakeholder enthusiasm score'],
        flow: [
          { icon: 'search', label: 'Brief', sub: 'Fast-tracked discovery: objectives, audience, and creative parameters', deliverables: [] },
          { icon: 'eye', label: 'Concept', sub: 'Develop and present the campaign concept with moodboard and messaging', deliverables: ['Campaign concept document', 'Creative moodboard', 'Messaging framework'] },
          { icon: 'check', label: 'Execute', sub: 'Apply concept to two sample formats for stakeholder sign-off', deliverables: ['Sample executions (x2 formats)'] },
        ],
      },
      {
        name: 'Campaign concept',
        hours: 86,
        price: '$11,200',
        who: 'Brand and marketing teams preparing a full campaign that needs a concept strong enough to run across multiple channels and formats.',
        have: 'A complete campaign concept with strategy, creative direction, messaging, and executions across three or more formats ready for production.',
        deliverables: [
          { label: 'Campaign strategy and brief' },
          { label: 'Full creative concept' },
          { label: 'Multi-format executions (x3+)' },
          { label: 'Campaign playbook' },
        ],
        turnaround: '4-6 weeks',
        target: 'Campaign',
        metrics: ['Cross-channel consistency score', 'Campaign reach', 'Engagement rate vs. benchmark'],
        flow: [
          { icon: 'search', label: 'Research', sub: 'Audience insight, competitive audit, and strategy alignment workshop', deliverables: ['Campaign strategy and brief'] },
          { icon: 'eye', label: 'Develop', sub: 'Full creative concept development with messaging and multiple execution directions', deliverables: ['Full creative concept', 'Multi-format executions (x3+)'] },
          { icon: 'check', label: 'Package', sub: 'Compile campaign playbook for production and media teams', deliverables: ['Campaign playbook'] },
        ],
      },
      {
        name: 'Pitch / new business concept',
        hours: 72,
        price: '$9,400',
        who: 'Agencies and teams building a speculative concept to win new business. Needs to be sharp, persuasive, and production-ready enough to demonstrate capability.',
        have: 'A compelling pitch concept with creative direction, strategic rationale, and at least two sample executions ready to present to the prospective client.',
        deliverables: [
          { label: 'Pitch strategy document' },
          { label: 'Creative concept with rationale' },
          { label: 'Sample executions (x2)' },
          { label: 'Pitch deck integration' },
        ],
        turnaround: '3-4 weeks',
        target: 'New Biz',
        metrics: ['Pitch win rate', 'Concept differentiation score', 'Client recall of key idea'],
        flow: [
          { icon: 'search', label: 'Analyze', sub: 'Prospect research, brief interpretation, and competitive positioning', deliverables: ['Pitch strategy document'] },
          { icon: 'strategy', label: 'Concept', sub: 'Develop the pitch idea with messaging and visual creative direction', deliverables: ['Creative concept with rationale'] },
          { icon: 'check', label: 'Present', sub: 'Build sample executions and integrate concept into the pitch deck', deliverables: ['Sample executions (x2)', 'Pitch deck integration'] },
        ],
      },
    ],
  },
  {
    id: 'print-physical',
    area: 'Print & Physical',
    num: 4,
    services: [
      {
        name: 'Brand book / printed report',
        hours: 83,
        price: '$10,200',
        who: 'Organizations that need a high-quality printed piece to communicate identity, results, or values. Common for annual reports, brand books, and impact reports.',
        have: 'A print-ready document with cohesive layout, custom typography, photography direction, and files prepped for your chosen print vendor.',
        deliverables: [
          { label: 'Print-ready PDF' },
          { label: 'Designed layout file' },
          { label: 'Print spec sheet' },
          { label: 'Digital interactive version' },
        ],
        turnaround: '5-7 weeks',
        target: 'Editorial',
        metrics: ['Stakeholder impression score', 'Print run completion rate', 'Digital download rate'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Define content structure, print specs, and visual treatment', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Layout design with typography, imagery, and data visualization across all sections', deliverables: ['Designed layout file'] },
          { icon: 'check', label: 'Deliver', sub: 'Prepress check, print-ready PDF, and digital version packaged for distribution', deliverables: ['Print-ready PDF', 'Print spec sheet', 'Digital interactive version'] },
        ],
      },
      {
        name: 'Editorial / magazine spread',
        hours: 52,
        price: '$6,500',
        who: 'Brands producing editorial content for print or digital magazines, content series, or sponsored features that need professional layout and typographic design.',
        have: 'A fully designed editorial spread or series with print-ready files, image placement, and a reusable template for future issues.',
        deliverables: [
          { label: 'Designed spread layouts' },
          { label: 'Print-ready files' },
          { label: 'Reusable editorial template' },
        ],
        turnaround: '2-4 weeks',
        target: 'Editorial',
        metrics: ['Reader engagement score', 'Brand recall in editorial context', 'Template reuse rate'],
        flow: [
          { icon: 'search', label: 'Brief', sub: 'Content review, editorial tone, and layout format definition', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Spread layouts designed with typographic hierarchy and image direction', deliverables: ['Designed spread layouts', 'Reusable editorial template'] },
          { icon: 'check', label: 'Deliver', sub: 'Final print-ready files with prepress review', deliverables: ['Print-ready files'] },
        ],
      },
      {
        name: 'Packaging (single SKU)',
        hours: 59,
        price: '$7,400',
        who: 'Product brands launching or redesigning a single product package. Covers structural dieline setup through final print-ready artwork.',
        have: 'A fully designed, print-ready packaging file for one SKU with structural dieline, all faces designed, and vendor-ready specs.',
        deliverables: [
          { label: 'Packaging design (all faces)' },
          { label: 'Structural dieline file' },
          { label: 'Print-ready artwork' },
          { label: 'Mockup renders' },
        ],
        turnaround: '3-5 weeks',
        target: 'Packaging',
        metrics: ['Shelf standout score', 'Print approval rate', 'Consumer purchase intent lift'],
        flow: [
          { icon: 'search', label: 'Spec', sub: 'Define structural requirements, print method, and brand direction for the package', deliverables: ['Structural dieline file'] },
          { icon: 'eye', label: 'Design', sub: 'Design all faces of the package with two rounds of revision', deliverables: ['Packaging design (all faces)', 'Mockup renders'] },
          { icon: 'check', label: 'Prep', sub: 'Prepare and QC print-ready artwork for vendor submission', deliverables: ['Print-ready artwork'] },
        ],
      },
      {
        name: 'Packaging (product line)',
        hours: 126,
        price: '$15,500',
        who: 'Consumer brands designing packaging across a family of products. Ensures visual consistency across SKUs while allowing for product-specific differentiation.',
        have: 'A cohesive packaging system across the full product line, with print-ready files for every SKU and a packaging design guide for future additions.',
        deliverables: [
          { label: 'Packaging design system' },
          { label: 'Print-ready files (all SKUs)' },
          { label: 'Packaging design guide' },
          { label: 'Mockup render set' },
        ],
        turnaround: '7-10 weeks',
        target: 'Packaging',
        metrics: ['Range coherence score', 'SKU differentiation clarity', 'Print-ready approval rate'],
        flow: [
          { icon: 'search', label: 'System', sub: 'Define the shared design language across the line and per-SKU differentiation rules', deliverables: ['Packaging design guide'] },
          { icon: 'eye', label: 'Design', sub: 'Design lead SKU first, then extend system across remaining products', deliverables: ['Packaging design system', 'Mockup render set'] },
          { icon: 'check', label: 'Deliver', sub: 'Print-ready files for all SKUs with prepress review completed', deliverables: ['Print-ready files (all SKUs)'] },
        ],
      },
      {
        name: 'Print ads (batch of 3)',
        hours: 22,
        price: '$2,400',
        who: 'Marketing teams running print campaigns who need a small batch of ads adapted to different formats while keeping a consistent creative direction.',
        have: 'Three print-ready ads in specified sizes, on-brand, with consistent visual hierarchy and messaging.',
        deliverables: [
          { label: 'Print ad designs (x3)' },
          { label: 'Print-ready files' },
          { label: 'Copy and headline variants' },
        ],
        turnaround: '1-2 weeks',
        target: 'Advertising',
        metrics: ['Ad recall rate', 'Brand recognition in placement', 'Response rate'],
        flow: [
          { icon: 'search', label: 'Brief', sub: 'Define placements, specs, key message, and visual direction for the batch', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Design all three ads with one round of revision', deliverables: ['Print ad designs (x3)', 'Copy and headline variants'] },
          { icon: 'check', label: 'Deliver', sub: 'Print-ready files packaged per publication spec', deliverables: ['Print-ready files'] },
        ],
      },
      {
        name: 'Print ad campaign',
        hours: 62,
        price: '$7,300',
        who: 'Brands running a sustained print presence across multiple publications or formats who need a campaign built for consistency and impact over time.',
        have: 'A complete print ad campaign with multiple formats, a creative concept, and all assets print-ready for your media schedule.',
        deliverables: [
          { label: 'Campaign concept and rationale' },
          { label: 'Full ad suite (multiple formats)' },
          { label: 'Print-ready files' },
          { label: 'Campaign usage guide' },
        ],
        turnaround: '3-5 weeks',
        target: 'Advertising',
        metrics: ['Brand awareness lift', 'Campaign reach', 'Ad consistency across placements'],
        flow: [
          { icon: 'strategy', label: 'Concept', sub: 'Develop the campaign idea and visual direction for the full print run', deliverables: ['Campaign concept and rationale'] },
          { icon: 'eye', label: 'Produce', sub: 'Design all format variations with two rounds of review', deliverables: ['Full ad suite (multiple formats)'] },
          { icon: 'check', label: 'Deliver', sub: 'Print-ready files and usage guide for the media team', deliverables: ['Print-ready files', 'Campaign usage guide'] },
        ],
      },
      {
        name: 'OOH (batch of 3 placements)',
        hours: 26,
        price: '$2,800',
        who: 'Brands placing out-of-home ads across a small number of formats (billboard, transit, etc.) who need fast, production-ready creative.',
        have: 'Three OOH-ready designs adapted for their specific placements, print-ready and approved for vendor submission.',
        deliverables: [
          { label: 'OOH designs (x3 placements)' },
          { label: 'Print-ready files per spec' },
          { label: 'Placement mockups' },
        ],
        turnaround: '1-2 weeks',
        target: 'OOH',
        metrics: ['Impression volume', 'Brand recall in placement context', 'Production turnaround time'],
        flow: [
          { icon: 'search', label: 'Spec', sub: 'Gather all placement specs, sizes, and production requirements', deliverables: [] },
          { icon: 'eye', label: 'Design', sub: 'Design all three placements optimized for their specific context and viewing distance', deliverables: ['OOH designs (x3 placements)', 'Placement mockups'] },
          { icon: 'check', label: 'Deliver', sub: 'Print-ready files submitted per vendor spec', deliverables: ['Print-ready files per spec'] },
        ],
      },
      {
        name: 'OOH campaign',
        hours: 88,
        price: '$11,000',
        who: 'Brands running a coordinated out-of-home campaign across multiple markets or placement types who need a unified creative system.',
        have: 'A full OOH campaign with a central concept, all placements designed, production files ready, and a campaign guide for media buyers.',
        deliverables: [
          { label: 'OOH campaign concept' },
          { label: 'Full placement suite' },
          { label: 'Production-ready files' },
          { label: 'Campaign guide for media buyers' },
        ],
        turnaround: '5-7 weeks',
        target: 'OOH',
        metrics: ['Campaign reach', 'Brand awareness lift in target markets', 'Production-on-time rate'],
        flow: [
          { icon: 'strategy', label: 'Concept', sub: 'Develop the campaign idea with OOH-specific constraints and market context', deliverables: ['OOH campaign concept'] },
          { icon: 'eye', label: 'Produce', sub: 'Design all placements across formats with two rounds of revision', deliverables: ['Full placement suite'] },
          { icon: 'check', label: 'Deliver', sub: 'Production files and campaign guide packaged for media buyers and vendors', deliverables: ['Production-ready files', 'Campaign guide for media buyers'] },
        ],
      },
    ],
  },
  {
    id: 'ai-brand',
    area: 'AI for Brand',
    num: 5,
    services: [
      {
        name: 'AI brand training & guidelines',
        hours: 38,
        price: '$5,700',
        who: 'Brand and content teams who want AI writing tools to stay on-brand without constant editing. Best for teams already using ChatGPT, Claude, or similar tools.',
        have: 'A set of tested AI prompts, a training corpus, and a guidelines document so your team can generate on-brand content reliably.',
        deliverables: [
          { label: 'Brand-trained prompt library' },
          { label: 'AI usage guidelines document' },
          { label: 'Tone-of-voice training corpus' },
          { label: 'Team quickstart guide' },
        ],
        turnaround: '2-3 weeks',
        target: 'AI Ops',
        metrics: ['On-brand output rate', 'Editing time per AI draft', 'Team adoption rate'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review brand voice, existing copy, and current AI tool usage patterns', deliverables: ['Tone-of-voice training corpus'] },
          { icon: 'bolt', label: 'Build', sub: 'Develop and test prompt library and AI usage guidelines against real brand scenarios', deliverables: ['Brand-trained prompt library', 'AI usage guidelines document'] },
          { icon: 'check', label: 'Enable', sub: 'Deliver quickstart guide and run team onboarding session', deliverables: ['Team quickstart guide'] },
        ],
      },
      {
        name: 'AI consulting & training',
        hours: 26,
        price: '$3,900',
        who: 'Leadership and creative teams who want to understand how AI fits into their workflow without the hype. Focused on practical application and workflow integration.',
        have: 'A tailored AI workflow audit, a recommended toolset, and a team training session with practical exercises they can use immediately.',
        deliverables: [
          { label: 'AI workflow audit report' },
          { label: 'Recommended tool stack' },
          { label: 'Team training session (recorded)' },
        ],
        turnaround: '1-2 weeks',
        target: 'Training',
        metrics: ['Workflow efficiency gain', 'Tool adoption rate', 'Team confidence score'],
        flow: [
          { icon: 'search', label: 'Assess', sub: 'Audit current workflows and identify the highest-value AI integration points', deliverables: ['AI workflow audit report'] },
          { icon: 'bolt', label: 'Recommend', sub: 'Define the right tool stack and practical use cases for the team', deliverables: ['Recommended tool stack'] },
          { icon: 'check', label: 'Train', sub: 'Run a live training session with recorded replay and follow-up Q&A', deliverables: ['Team training session (recorded)'] },
        ],
      },
    ],
  },
];

const DIGITAL_SERVICES = [
  {
    id: 'product-design',
    area: 'Product Design',
    num: 1,
    services: [
      {
        name: 'Product discovery',
        hours: 39,
        price: '$5,100',
        who: 'Product teams and founders before a design or build sprint who need to align on what to build and why. Prevents costly rework downstream.',
        have: 'A discovery report with validated user needs, a prioritized feature list, and a product brief ready to hand to designers or developers.',
        deliverables: [
          { label: 'Discovery research report' },
          { label: 'User needs summary' },
          { label: 'Prioritized feature brief' },
          { label: 'Product design recommendations' },
        ],
        turnaround: '2-3 weeks',
        target: 'Discovery',
        metrics: ['Feature prioritization accuracy', 'Design sprint velocity', 'Stakeholder alignment score'],
        flow: [
          { icon: 'search', label: 'Research', sub: 'User interviews, competitive review, and technical constraints mapping', deliverables: ['Discovery research report', 'User needs summary'] },
          { icon: 'strategy', label: 'Synthesize', sub: 'Distill findings into prioritized opportunities and design principles', deliverables: ['Prioritized feature brief'] },
          { icon: 'check', label: 'Brief', sub: 'Deliver product design recommendations and brief for the design phase', deliverables: ['Product design recommendations'] },
        ],
      },
      {
        name: 'UX wireframes',
        hours: 49,
        price: '$5,700',
        who: 'Product teams that need to validate user flows and information architecture before committing to high-fidelity design. Reduces revision cycles significantly.',
        have: 'A complete wireframe set covering all key screens and user flows, annotated for engineering and ready for stakeholder review.',
        deliverables: [
          { label: 'Wireframe set (all key screens)' },
          { label: 'User flow diagrams' },
          { label: 'Interaction annotations' },
          { label: 'Prototype for testing' },
        ],
        turnaround: '2-3 weeks',
        target: 'UX',
        metrics: ['User task completion rate', 'Flow revision rounds', 'Prototype test pass rate'],
        flow: [
          { icon: 'search', label: 'Map', sub: 'Define user flows, screen inventory, and interaction patterns', deliverables: ['User flow diagrams'] },
          { icon: 'eye', label: 'Wire', sub: 'Build wireframes for all screens with interaction annotations', deliverables: ['Wireframe set (all key screens)', 'Interaction annotations'] },
          { icon: 'click', label: 'Test', sub: 'Assemble clickable prototype and run a validation pass before handoff', deliverables: ['Prototype for testing'] },
        ],
      },
      {
        name: 'UI design (feature)',
        hours: 60,
        price: '$6,600',
        who: 'Product teams adding a new feature to an existing product who need UI design that fits the established system without starting from scratch.',
        have: 'Fully designed UI screens for the new feature, component specs, and a handoff file ready for engineering.',
        deliverables: [
          { label: 'Feature UI screens' },
          { label: 'Component specifications' },
          { label: 'Design system extension notes' },
          { label: 'Dev handoff file' },
        ],
        turnaround: '3-4 weeks',
        target: 'Product',
        metrics: ['Design-to-dev handoff quality', 'Feature launch speed', 'Design QA pass rate'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review existing design system and define how the new feature fits within it', deliverables: ['Design system extension notes'] },
          { icon: 'eye', label: 'Design', sub: 'UI design for all feature screens with two rounds of review', deliverables: ['Feature UI screens', 'Component specifications'] },
          { icon: 'check', label: 'Handoff', sub: 'Prepare dev handoff file with redlines, specs, and assets', deliverables: ['Dev handoff file'] },
        ],
      },
      {
        name: 'Full product UI',
        hours: 184,
        price: '$22,500',
        who: 'Teams building a new product or doing a complete redesign who need end-to-end UI design across all surfaces. Includes design system creation.',
        have: 'A complete, production-ready UI design system with all screens designed, a component library, and a dev handoff file organized for engineering.',
        deliverables: [
          { label: 'Full UI design (all screens)' },
          { label: 'Design system and component library' },
          { label: 'Prototype' },
          { label: 'Dev handoff file' },
        ],
        turnaround: '10-14 weeks',
        target: 'Product',
        metrics: ['Design system coverage', 'Time to production', 'Accessibility compliance rate'],
        flow: [
          { icon: 'search', label: 'Architect', sub: 'Define design system foundation, screen inventory, and component strategy', deliverables: ['Design system and component library'] },
          { icon: 'eye', label: 'Design', sub: 'UI design across all screens in phased sprints with structured client reviews', deliverables: ['Full UI design (all screens)', 'Prototype'] },
          { icon: 'check', label: 'Handoff', sub: 'Organize and deliver dev handoff with specs, assets, and annotation', deliverables: ['Dev handoff file'] },
        ],
      },
      {
        name: 'Design-to-build (Claude Code)',
        hours: 144,
        price: '$19,300',
        who: 'Startups and teams that need design and front-end built together, not in sequence. We design and build in parallel using Claude Code for accelerated output.',
        have: 'A deployed, working front-end built from the design, with clean component code, responsive layouts, and a codebase ready to hand to your engineering team.',
        deliverables: [
          { label: 'Shipped front-end codebase' },
          { label: 'Component library (coded)' },
          { label: 'Design source file' },
          { label: 'Deployment and handoff notes' },
        ],
        turnaround: '6-9 weeks',
        target: 'Build',
        metrics: ['Design-to-ship time', 'Component reuse rate', 'Code handoff quality score'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Define tech stack, component strategy, and design-to-build workflow', deliverables: [] },
          { icon: 'bolt', label: 'Build', sub: 'Design and code developed in parallel with weekly review checkpoints', deliverables: ['Shipped front-end codebase', 'Component library (coded)', 'Design source file'] },
          { icon: 'check', label: 'Deliver', sub: 'Deploy, QA, and hand off with full documentation', deliverables: ['Deployment and handoff notes'] },
        ],
      },
      {
        name: 'Prototyping',
        hours: 42,
        price: '$4,700',
        who: 'Teams that need to test an idea, sell a concept internally, or run user testing before investing in full design or build.',
        have: 'A high-fidelity interactive prototype that simulates the key experience, ready for user testing or stakeholder presentation.',
        deliverables: [
          { label: 'High-fidelity prototype' },
          { label: 'Interaction specification notes' },
          { label: 'Test script (if user testing)' },
        ],
        turnaround: '1-2 weeks',
        target: 'Validation',
        metrics: ['Test task completion rate', 'Stakeholder sign-off speed', 'Prototype-to-build accuracy'],
        flow: [
          { icon: 'search', label: 'Scope', sub: 'Define prototype goals, key flows, and fidelity requirements', deliverables: [] },
          { icon: 'click', label: 'Build', sub: 'Assemble high-fidelity prototype with realistic interactions', deliverables: ['High-fidelity prototype', 'Interaction specification notes'] },
          { icon: 'check', label: 'Test', sub: 'Run the prototype through a structured review or user test and deliver findings', deliverables: ['Test script (if user testing)'] },
        ],
      },
    ],
  },
  {
    id: 'web-builds',
    area: 'Web Builds',
    num: 2,
    services: [
      {
        name: 'Web strategy & sitemap',
        hours: 21,
        price: '$2,900',
        who: 'Teams planning a new site or significant redesign who need to define structure and purpose before any design begins.',
        have: 'A validated sitemap, page-by-page purpose definitions, and a content strategy brief ready to guide the design phase.',
        deliverables: [
          { label: 'Site architecture and sitemap' },
          { label: 'Page purpose definitions' },
          { label: 'Content strategy brief' },
        ],
        turnaround: '3-5 days',
        target: 'Strategy',
        metrics: ['Information architecture clarity score', 'Design sprint velocity', 'Content coverage rate'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review existing site (if any), business goals, and user journeys', deliverables: [] },
          { icon: 'strategy', label: 'Structure', sub: 'Define sitemap, navigation, and page-level purpose for each section', deliverables: ['Site architecture and sitemap', 'Page purpose definitions'] },
          { icon: 'check', label: 'Brief', sub: 'Deliver content strategy brief to guide copywriting and design', deliverables: ['Content strategy brief'] },
        ],
      },
      {
        name: 'Business card site',
        hours: 27,
        price: '$3,400',
        who: 'Freelancers, consultants, and small businesses that need a simple, professional presence online. One to three pages, fast to launch.',
        have: 'A live, mobile-responsive site with your core information, contact method, and brand applied cleanly across every page.',
        deliverables: [
          { label: 'Designed and built site (1-3 pages)' },
          { label: 'Mobile-responsive layout' },
          { label: 'Basic SEO setup' },
          { label: 'Deployment and domain connection' },
        ],
        turnaround: '1-2 weeks',
        target: 'Presence',
        metrics: ['Time to launch', 'Mobile usability score', 'Contact conversion rate'],
        flow: [
          { icon: 'search', label: 'Brief', sub: 'Define page content, brand direction, and hosting requirements', deliverables: [] },
          { icon: 'eye', label: 'Build', sub: 'Design and develop the site with mobile-first layout and brand application', deliverables: ['Designed and built site (1-3 pages)', 'Mobile-responsive layout'] },
          { icon: 'check', label: 'Launch', sub: 'SEO setup, deployment, and domain connection', deliverables: ['Basic SEO setup', 'Deployment and domain connection'] },
        ],
      },
      {
        name: 'Landing page',
        hours: 39,
        price: '$4,900',
        who: 'Teams running campaigns, product launches, or lead generation who need a single conversion-focused page built fast.',
        have: 'A live landing page optimized for conversion with analytics connected, mobile-ready, and integrated with your CRM or email platform.',
        deliverables: [
          { label: 'Designed and built landing page' },
          { label: 'Form and CRM integration' },
          { label: 'Analytics setup' },
          { label: 'Mobile-responsive layout' },
        ],
        turnaround: '1-2 weeks',
        target: 'Conversion',
        metrics: ['Conversion rate', 'Bounce rate', 'Form submission rate'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Define conversion goal, audience, and page content hierarchy', deliverables: [] },
          { icon: 'landing', label: 'Build', sub: 'Design and develop the page with conversion-optimized layout and copy', deliverables: ['Designed and built landing page', 'Mobile-responsive layout'] },
          { icon: 'check', label: 'Integrate', sub: 'Connect forms, CRM, and analytics before launch', deliverables: ['Form and CRM integration', 'Analytics setup'] },
        ],
      },
      {
        name: 'Marketing site',
        hours: 112,
        price: '$15,000',
        who: 'Growing companies that need a full marketing site to support sales and brand awareness. Typically 5-10 pages with polished design and performance-optimized build.',
        have: 'A live marketing site with all pages built, optimized for performance and SEO, and deployed to your hosting environment.',
        deliverables: [
          { label: 'Full site design and build (5-10 pages)' },
          { label: 'Mobile-responsive layouts' },
          { label: 'SEO foundation setup' },
          { label: 'Analytics and performance setup' },
        ],
        turnaround: '6-9 weeks',
        target: 'Marketing',
        metrics: ['Organic traffic growth', 'Lead conversion rate', 'Page load speed score'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Sitemap, content strategy, and design direction defined before build begins', deliverables: [] },
          { icon: 'eye', label: 'Design & Build', sub: 'Design and develop all pages with responsive layouts and performance in mind', deliverables: ['Full site design and build (5-10 pages)', 'Mobile-responsive layouts'] },
          { icon: 'check', label: 'Launch', sub: 'SEO setup, analytics integration, and final QA before deployment', deliverables: ['SEO foundation setup', 'Analytics and performance setup'] },
        ],
      },
      {
        name: 'Marketing site + CMS',
        hours: 133,
        price: '$18,200',
        who: 'Teams that need a full marketing site and want to update content themselves without touching code. Includes CMS setup and team training.',
        have: 'A live marketing site connected to a headless CMS, with your team able to update pages, blog posts, and assets independently.',
        deliverables: [
          { label: 'Full site design and build' },
          { label: 'Headless CMS setup and schema' },
          { label: 'Editor training session' },
          { label: 'CMS documentation' },
        ],
        turnaround: '7-10 weeks',
        target: 'Marketing',
        metrics: ['Content update frequency', 'Editor adoption rate', 'Time to publish new content'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Sitemap, CMS schema design, and content workflow definition', deliverables: ['Headless CMS setup and schema'] },
          { icon: 'eye', label: 'Build', sub: 'Site design and development with CMS integration wired throughout', deliverables: ['Full site design and build'] },
          { icon: 'check', label: 'Enable', sub: 'Train the team, deliver documentation, and launch', deliverables: ['Editor training session', 'CMS documentation'] },
        ],
      },
      {
        name: 'Big marketing site + CMS',
        hours: 198,
        price: '$26,900',
        who: 'Companies with complex content needs, multiple audience segments, or large page counts who need an enterprise-grade marketing site with a robust CMS.',
        have: 'A full-scale marketing site with CMS, component-driven architecture, and documentation built to support a large team managing content at scale.',
        deliverables: [
          { label: 'Full site design and build (10+ pages)' },
          { label: 'Component-driven CMS system' },
          { label: 'Design system documentation' },
          { label: 'Editor and admin training' },
        ],
        turnaround: '12-16 weeks',
        target: 'Enterprise',
        metrics: ['Content publishing velocity', 'Site performance score', 'CMS coverage rate'],
        flow: [
          { icon: 'search', label: 'Architect', sub: 'Site architecture, component strategy, and CMS schema planned in detail', deliverables: ['Component-driven CMS system'] },
          { icon: 'eye', label: 'Build', sub: 'Full site design and development in phased sprints with regular reviews', deliverables: ['Full site design and build (10+ pages)', 'Design system documentation'] },
          { icon: 'check', label: 'Launch', sub: 'QA, performance optimization, team training, and deployment', deliverables: ['Editor and admin training'] },
        ],
      },
      {
        name: 'Shopify store',
        hours: 184,
        price: '$25,100',
        who: 'Product brands launching or redesigning a Shopify storefront who need a custom design, not a stock theme. Includes full Shopify setup and launch.',
        have: 'A live, custom-designed Shopify store with product catalog, collections, checkout optimizations, and essential apps configured.',
        deliverables: [
          { label: 'Custom Shopify theme design and build' },
          { label: 'Product catalog setup' },
          { label: 'App configuration (payments, reviews, etc.)' },
          { label: 'Launch QA and go-live support' },
        ],
        turnaround: '10-14 weeks',
        target: 'Ecommerce',
        metrics: ['Conversion rate', 'Average order value', 'Cart abandonment rate'],
        flow: [
          { icon: 'search', label: 'Plan', sub: 'Store architecture, product taxonomy, and design direction defined upfront', deliverables: [] },
          { icon: 'eye', label: 'Design & Build', sub: 'Custom theme design and Shopify development with all pages and templates', deliverables: ['Custom Shopify theme design and build', 'Product catalog setup'] },
          { icon: 'check', label: 'Launch', sub: 'App configuration, QA, and go-live support through first week', deliverables: ['App configuration (payments, reviews, etc.)', 'Launch QA and go-live support'] },
        ],
      },
      {
        name: 'Microsite',
        hours: 88,
        price: '$11,800',
        who: 'Teams launching campaigns, events, or products that warrant a standalone site separate from the main marketing site. Typically short-lived or campaign-specific.',
        have: 'A live, purpose-built microsite with custom design, all content live, and analytics connected for campaign tracking.',
        deliverables: [
          { label: 'Microsite design and build' },
          { label: 'Mobile-responsive layout' },
          { label: 'Campaign analytics setup' },
          { label: 'Deployment and domain setup' },
        ],
        turnaround: '4-6 weeks',
        target: 'Campaign',
        metrics: ['Campaign conversion rate', 'Unique visitor count', 'Time on site'],
        flow: [
          { icon: 'search', label: 'Brief', sub: 'Define microsite purpose, content, conversion goal, and campaign context', deliverables: [] },
          { icon: 'eye', label: 'Build', sub: 'Custom design and development optimized for the campaign objective', deliverables: ['Microsite design and build', 'Mobile-responsive layout'] },
          { icon: 'check', label: 'Launch', sub: 'Analytics setup, deployment, and domain connection', deliverables: ['Campaign analytics setup', 'Deployment and domain setup'] },
        ],
      },
      {
        name: 'Web design refresh',
        hours: 76,
        price: '$9,700',
        who: 'Companies with a functioning site that looks dated or no longer reflects the brand. A refresh updates the design without rebuilding the full site.',
        have: 'An updated site with refreshed visual design applied across all pages, improved UX on key pages, and a faster, cleaner experience.',
        deliverables: [
          { label: 'Refreshed page designs (all pages)' },
          { label: 'Updated component styles' },
          { label: 'Mobile-responsive QA' },
          { label: 'Deployed updates' },
        ],
        turnaround: '4-6 weeks',
        target: 'Refresh',
        metrics: ['Bounce rate improvement', 'Design consistency score', 'User satisfaction rating'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Review all existing pages, identify UX and visual issues, and scope refresh priorities', deliverables: [] },
          { icon: 'eye', label: 'Refresh', sub: 'Apply updated design treatment across all pages with two rounds of review', deliverables: ['Refreshed page designs (all pages)', 'Updated component styles'] },
          { icon: 'check', label: 'Deploy', sub: 'Mobile QA and deployment of all updates', deliverables: ['Mobile-responsive QA', 'Deployed updates'] },
        ],
      },
      {
        name: 'Design system / component library',
        hours: 104,
        price: '$13,500',
        who: 'Product and marketing teams that build web experiences regularly and need a shared design system to ensure consistency and speed across teams.',
        have: 'A fully documented component library with design tokens, usage guidelines, and coded components ready to plug into your existing stack.',
        deliverables: [
          { label: 'Design token system' },
          { label: 'Component library (design)' },
          { label: 'Coded component library' },
          { label: 'Usage documentation' },
        ],
        turnaround: '6-9 weeks',
        target: 'System',
        metrics: ['Component reuse rate', 'Design-to-dev handoff speed', 'Cross-team consistency score'],
        flow: [
          { icon: 'search', label: 'Audit', sub: 'Inventory existing patterns, identify inconsistencies, and define token structure', deliverables: ['Design token system'] },
          { icon: 'eye', label: 'Build', sub: 'Design and code all components with systematic coverage across states and variants', deliverables: ['Component library (design)', 'Coded component library'] },
          { icon: 'check', label: 'Document', sub: 'Write usage guidelines and publish the design system for team adoption', deliverables: ['Usage documentation'] },
        ],
      },
    ],
  },
  {
    id: 'interactive',
    area: 'Interactive',
    num: 3,
    services: [
      {
        name: 'Interactive experience / WebGL',
        hours: 177,
        price: '$27,100',
        who: 'Brands that want a signature digital experience: immersive, motion-rich, or 3D. Best for launches, flagship sites, or experience-led marketing.',
        have: 'A live, high-performance interactive experience built with WebGL or advanced web animation, optimized for performance and cross-browser compatibility.',
        deliverables: [
          { label: 'Interactive experience (live)' },
          { label: 'Performance optimization report' },
          { label: 'Cross-browser QA sign-off' },
          { label: 'Source code and handoff notes' },
        ],
        turnaround: '10-14 weeks',
        target: 'Experience',
        metrics: ['Time on experience', 'Social share rate', 'Performance score (Lighthouse)'],
        flow: [
          { icon: 'search', label: 'Concept', sub: 'Define the interactive concept, technical approach, and performance constraints', deliverables: [] },
          { icon: 'bolt', label: 'Build', sub: 'Prototype and iterate on the interactive experience with weekly reviews', deliverables: ['Interactive experience (live)', 'Performance optimization report'] },
          { icon: 'check', label: 'QA & Launch', sub: 'Cross-browser testing, performance optimization, and deployment', deliverables: ['Cross-browser QA sign-off', 'Source code and handoff notes'] },
        ],
      },
      {
        name: 'Interactive calculator / quiz',
        hours: 44,
        price: '$5,700',
        who: 'Marketing teams that want a lead-gen or engagement tool embedded on their site. Calculators, quizzes, and self-assessments drive high engagement and qualified leads.',
        have: 'A live, designed, and functional calculator or quiz with results logic, lead capture, and CRM integration.',
        deliverables: [
          { label: 'Designed and built interactive tool' },
          { label: 'Results logic and scoring' },
          { label: 'Lead capture and CRM integration' },
          { label: 'Embed-ready code' },
        ],
        turnaround: '3-4 weeks',
        target: 'Lead Gen',
        metrics: ['Completion rate', 'Lead capture rate', 'Qualified lead conversion rate'],
        flow: [
          { icon: 'search', label: 'Design Logic', sub: 'Define question set, scoring logic, results states, and lead capture flow', deliverables: ['Results logic and scoring'] },
          { icon: 'click', label: 'Build', sub: 'Design and develop the tool with all states, results, and integrations', deliverables: ['Designed and built interactive tool', 'Lead capture and CRM integration'] },
          { icon: 'check', label: 'Deploy', sub: 'QA all paths, package embed code, and connect analytics', deliverables: ['Embed-ready code'] },
        ],
      },
    ],
  },
  {
    id: 'ai-products',
    area: 'AI Products',
    num: 4,
    services: [
      {
        name: 'Custom AI tool / agent',
        hours: 88,
        price: '$13,600',
        who: 'Teams with a specific, repeatable workflow that AI can handle better and faster. Best when there is a clear input, process, and output that happens regularly.',
        have: 'A custom AI tool or agent built for your workflow, tested on real data, with a simple interface your team can use without technical help.',
        deliverables: [
          { label: 'Custom AI tool or agent (deployed)' },
          { label: 'Workflow integration documentation' },
          { label: 'User guide and training' },
          { label: 'Source code handoff' },
        ],
        turnaround: '5-8 weeks',
        target: 'AI Build',
        metrics: ['Workflow time saved per week', 'Output quality score', 'Tool adoption rate'],
        flow: [
          { icon: 'search', label: 'Scope', sub: 'Define the workflow, inputs, outputs, and model requirements for the tool', deliverables: [] },
          { icon: 'bolt', label: 'Build', sub: 'Develop and iterate on the AI tool with real workflow testing', deliverables: ['Custom AI tool or agent (deployed)', 'Workflow integration documentation'] },
          { icon: 'check', label: 'Deploy', sub: 'User testing, refinement, training session, and code handoff', deliverables: ['User guide and training', 'Source code handoff'] },
        ],
      },
      {
        name: 'AI workflow audit',
        hours: 30,
        price: '$4,500',
        who: 'Teams who sense there are AI wins hiding in their workflow but don\'t know where to start. Produces a prioritized roadmap, not just a list of tools.',
        have: 'A workflow audit report with specific automation opportunities ranked by impact and effort, plus a recommended implementation sequence.',
        deliverables: [
          { label: 'Workflow audit report' },
          { label: 'AI opportunity map (by team/process)' },
          { label: 'Prioritized implementation roadmap' },
        ],
        turnaround: '1-2 weeks',
        target: 'AI Ops',
        metrics: ['Opportunities identified', 'Estimated hours saved per week', 'Roadmap adoption rate'],
        flow: [
          { icon: 'search', label: 'Map', sub: 'Interview key team members and document current workflows in detail', deliverables: ['Workflow audit report'] },
          { icon: 'bolt', label: 'Analyze', sub: 'Identify AI automation opportunities and score by impact and implementation effort', deliverables: ['AI opportunity map (by team/process)'] },
          { icon: 'check', label: 'Recommend', sub: 'Deliver prioritized roadmap with recommended next steps and tooling', deliverables: ['Prioritized implementation roadmap'] },
        ],
      },
    ],
  },
];

// ── SVG Icons ─────────────────────────────────────────────────────────────
function DeliverableIcon({ type }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'strategy': return (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="4" r="2"/>
        <line x1="12" y1="6" x2="12" y2="10"/>
        <line x1="12" y1="10" x2="7" y2="14"/>
        <line x1="12" y1="10" x2="17" y2="14"/>
        <circle cx="7" cy="16.5" r="2"/>
        <circle cx="17" cy="16.5" r="2"/>
      </svg>
    )
    case 'posts': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <polyline points="3,16 8,11 12,15 15,12 21,16"/>
        <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    )
    case 'video': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="7" width="15" height="10" rx="1.5"/>
        <polyline points="17,10 22,7 22,17 17,14"/>
      </svg>
    )
    case 'email': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <polyline points="2,4 12,13 22,4"/>
      </svg>
    )
    case 'ads': return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="5.5"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    )
    case 'landing': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="3" width="20" height="16" rx="2"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <circle cx="5.5" cy="5.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="8.5" cy="5.5" r="1" fill="currentColor" stroke="none"/>
        <line x1="7" y1="12" x2="17" y2="12"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    )
    case 'copy': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M17 3a2.83 2.83 0 014 4L7.5 20.5 3 22l1.5-4.5z"/>
      </svg>
    )
    case 'report': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="3" y="13" width="4" height="8"/>
        <rect x="10" y="8" width="4" height="13"/>
        <rect x="17" y="4" width="4" height="17"/>
        <line x1="2" y1="21" x2="22" y2="21"/>
      </svg>
    )
    case 'whitepaper': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="7" y1="12" x2="17" y2="12"/>
        <line x1="7" y1="15" x2="17" y2="15"/>
        <line x1="7" y1="18" x2="12" y2="18"/>
      </svg>
    )
    case 'newsletter': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="3" y="5" width="18" height="16" rx="1.5"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="7" y1="14" x2="17" y2="14"/>
        <line x1="7" y1="17" x2="14" y2="17"/>
      </svg>
    )
    case 'ebook': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    )
    case 'lifecycle': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M21 12a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 0114.6-7"/>
        <polyline points="21,3 21,9 15,9"/>
      </svg>
    )
    case 'onboarding': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <polyline points="16,11 18,13 22,9"/>
      </svg>
    )
    case 'loyalty': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    )
    case 'calculator': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <rect x="7" y="5" width="10" height="5" rx="0.5"/>
        <circle cx="8.5" cy="14.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="14.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="14.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="8.5" cy="18.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="18.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    )
    case 'magnet': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M6 4v7a6 6 0 0012 0V4"/>
        <line x1="4" y1="4" x2="8" y2="4"/>
        <line x1="16" y1="4" x2="20" y2="4"/>
      </svg>
    )
    case 'concept': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M9 18h6M10 22h4M12 2a7 7 0 015.29 11.47c-.9.97-1.29 2.03-1.29 3.03v.5H8v-.5c0-1-.39-2.06-1.29-3.03A7 7 0 0112 2z"/>
      </svg>
    )
    case 'film': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="2" width="20" height="20" rx="2"/>
        <rect x="7" y="2" width="3" height="5"/>
        <rect x="14" y="2" width="3" height="5"/>
        <rect x="7" y="17" width="3" height="5"/>
        <rect x="14" y="17" width="3" height="5"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    )
    case 'deck': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <line x1="6" y1="8" x2="14" y2="8"/>
        <line x1="6" y1="11" x2="10" y2="11"/>
      </svg>
    )
    case 'onepager': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="4" y="2" width="16" height="20" rx="1.5"/>
        <line x1="8" y1="7" x2="16" y2="7"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="16" x2="13" y2="16"/>
      </svg>
    )
    case 'launch-film': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    )
    case 'launch-pack': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polyline points="21,8 21,21 3,21 3,8"/>
        <rect x="1" y="3" width="22" height="5" rx="1"/>
        <line x1="10" y1="12" x2="14" y2="12"/>
      </svg>
    )
    case 'sprint': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polyline points="13,2 13,9 19,9 11,22 11,15 5,15 13,2"/>
      </svg>
    )
    case 'naming': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polyline points="4,7 4,4 20,4 20,7"/>
        <line x1="9" y1="20" x2="15" y2="20"/>
        <line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    )
    case 'voice': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    )
    case 'brand-refresh': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polyline points="1,4 1,10 7,10"/>
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      </svg>
    )
    case 'deck-template': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
    case 'brand-system': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polygon points="12,2 2,7 12,12 22,7"/>
        <polyline points="2,17 12,22 22,17"/>
        <polyline points="2,12 12,17 22,12"/>
      </svg>
    )
    case 'brand-platform': return (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="5" r="3"/>
        <line x1="12" y1="8" x2="12" y2="20"/>
        <path d="M5 11H2a10 10 0 0020 0h-3"/>
      </svg>
    )
    case 'web': return (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    )
    case 'cms': return (
      <svg viewBox="0 0 24 24" {...s}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    )
    case 'sitemap': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="9" y="2" width="6" height="4" rx="0.5"/>
        <line x1="12" y1="6" x2="12" y2="10"/>
        <line x1="4" y1="10" x2="20" y2="10"/>
        <rect x="2" y="10" width="6" height="4" rx="0.5"/>
        <rect x="9" y="10" width="6" height="4" rx="0.5"/>
        <rect x="16" y="10" width="6" height="4" rx="0.5"/>
      </svg>
    )
    case 'microsite': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="5" y="2" width="14" height="20" rx="1.5"/>
        <line x1="5" y1="7" x2="19" y2="7"/>
        <line x1="8" y1="11" x2="16" y2="11"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>
      </svg>
    )
    case 'discovery': return (
      <svg viewBox="0 0 24 24" {...s}>
        <circle cx="7" cy="15" r="4"/>
        <circle cx="17" cy="15" r="4"/>
        <path d="M7 11V7a1 1 0 012 0v4"/>
        <path d="M17 11V7a1 1 0 00-2 0v4"/>
        <line x1="11" y1="15" x2="13" y2="15"/>
      </svg>
    )
    case 'wireframes': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="3" width="20" height="18" rx="2"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <rect x="4" y="11" width="7" height="7" rx="0.5"/>
        <line x1="13" y1="11" x2="20" y2="11"/>
        <line x1="13" y1="14" x2="20" y2="14"/>
        <line x1="13" y1="17" x2="17" y2="17"/>
      </svg>
    )
    case 'ui-design': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="3" width="20" height="15" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="18" x2="12" y2="21"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <circle cx="7" cy="5.5" r="0.8" fill="currentColor" stroke="none"/>
        <circle cx="10" cy="5.5" r="0.8" fill="currentColor" stroke="none"/>
        <circle cx="13" cy="5.5" r="0.8" fill="currentColor" stroke="none"/>
      </svg>
    )
    case 'interactive': return (
      <svg viewBox="0 0 24 24" {...s}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    )
    case 'code': return (
      <svg viewBox="0 0 24 24" {...s}>
        <polyline points="16,18 22,12 16,6"/>
        <polyline points="8,6 2,12 8,18"/>
      </svg>
    )
    case 'design-system': return (
      <svg viewBox="0 0 24 24" {...s}>
        <rect x="2" y="3" width="20" height="6" rx="1"/>
        <rect x="2" y="13" width="9" height="8" rx="1"/>
        <rect x="13" y="13" width="9" height="8" rx="1"/>
      </svg>
    )
    default: return null
  }
}

// ── Flow diagram ──────────────────────────────────────────────────────────
function FlowIcon({ type }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (type) {
    case 'person':    return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    case 'eye':       return <svg viewBox="0 0 24 24" {...s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    case 'click':     return <svg viewBox="0 0 24 24" {...s}><path d="M5 3l14 9-7 1-4 7z"/></svg>
    case 'search':    return <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    case 'check':     return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg>
    case 'signal':    return <svg viewBox="0 0 24 24" {...s}><path d="M2 12c0-5.52 4.48-10 10-10s10 4.48 10 10"/><path d="M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6"/><path d="M10 12c0-1.1.9-2 2-2s2 .9 2 2"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>
    case 'calendar':  return <svg viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9,16 11,18 15,14"/></svg>
    case 'download':  return <svg viewBox="0 0 24 24" {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
    case 'star':      return <svg viewBox="0 0 24 24" {...s}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
    case 'envelope':  return <svg viewBox="0 0 24 24" {...s}><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
    case 'megaphone': return <svg viewBox="0 0 24 24" {...s}><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>
    case 'bolt':      return <svg viewBox="0 0 24 24" {...s}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>
    case 'shield':    return <svg viewBox="0 0 24 24" {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    case 'arrows-out':return <svg viewBox="0 0 24 24" {...s}><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
    case 'brain':     return <svg viewBox="0 0 24 24" {...s}><path d="M9.5 2A2.5 2.5 0 007 4.5V5a3 3 0 000 6v.5A2.5 2.5 0 009.5 14h5A2.5 2.5 0 0017 11.5V11a3 3 0 000-6v-.5A2.5 2.5 0 0014.5 2h-5z"/><path d="M7 8h10M12 2v12"/></svg>
    case 'crosshair': return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/><circle cx="12" cy="12" r="3"/></svg>
    case 'clock':     return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
    case 'rocket':    return <svg viewBox="0 0 24 24" {...s}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
    case 'funnel':    return <svg viewBox="0 0 24 24" {...s}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>
    default: return null
  }
}

function FlowDiagram({ steps }) {
  return (
    <div className={styles.flowDiagram}>
      {steps.map((step, i) => (
        <div key={i} className={styles.flowItem}>
          <div className={styles.flowStep}>
            <div className={styles.flowStepHeader}>
              <div className={styles.flowStepIcon}><FlowIcon type={step.icon} /></div>
              <div className={styles.flowStepText}>
                <span className={styles.flowStepLabel}>{step.label}</span>
                {step.sub && <span className={styles.flowStepSub}>{step.sub}</span>}
              </div>
            </div>
            {step.deliverables && step.deliverables.length > 0 && (
              <div className={styles.flowStepDelivs}>
                {step.deliverables.map((d, j) => (
                  <span key={j} className={styles.flowStepDeliv}>{d}</span>
                ))}
              </div>
            )}
          </div>
          {i < steps.length - 1 && <div className={styles.flowLine} aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}

// ── Slide components ──────────────────────────────────────────────────────
const PROD_TIERS = [
  { name: 'Repurpose',         desc: 'No new production. Recut and adapt existing footage.',            shoot: false, mult: 0.3  },
  { name: 'Self-shot / UGC',   desc: 'Client captures on phone or webcam. We direct and edit.',        shoot: false, mult: 0.4  },
  { name: 'Run-and-gun',       desc: 'One operator, one camera, minimal setup.',                       shoot: true,  mult: 0.65 },
  { name: 'Studio / produced', desc: 'Full crew, lighting, studio or location. Our baseline.',         shoot: true,  mult: 1.0  },
  { name: 'Hybrid',            desc: 'A produced shoot combined with significant motion or 3D work.',  shoot: true,  mult: 1.2  },
  { name: 'Animation',         desc: 'No shoot. 2D motion and illustration led.',                      shoot: false, mult: 1.1  },
  { name: '3D / premium',      desc: '3D-led, or high-end live action with full production.',          shoot: true,  mult: 1.4  },
]

const MAX_MULT = 1.4

function PkgTiersSlide() {
  return (
    <section className={styles.pkgTiersSlide}>
      <div className={styles.pkgTiersLeft}>
        <p className={styles.pkgIntroEyebrow}>Appendix</p>
        <h2 className={styles.pkgIntroHeadline}>Production<br />tiers.</h2>
        <p className={styles.pkgIntroBody}>
          Every video deliverable is scoped against one of these seven tiers. The tier determines creative hours across direction, editing, and motion. Shoot logistics, crew, location, and talent are quoted separately from the production fee.
        </p>
        <p className={styles.pkgMediaNote}>
          Multipliers are relative to Studio / produced as the 1.0x baseline. Services that include a shoot flag will carry additional line items for physical production costs.
        </p>
      </div>
      <div className={styles.pkgTiersRight}>
        <div className={styles.pkgTiersTable}>
          <div className={styles.pkgTiersHeader}>
            <span>Tier</span>
            <span>What it means</span>
            <span>Shoot</span>
            <span>Creative scale</span>
          </div>
          {PROD_TIERS.map((t) => {
            const isBaseline = t.mult === 1.0
            const fillPct = (t.mult / MAX_MULT) * 100
            return (
              <div key={t.name} className={`${styles.pkgTiersRow}${isBaseline ? ' ' + styles.isBaseline : ''}`}>
                <div className={styles.pkgTiersName}>
                  {t.name}
                  {isBaseline && <span className={styles.pkgTiersBaselinePip}>baseline</span>}
                </div>
                <div className={styles.pkgTiersDesc}>{t.desc}</div>
                <div className={`${styles.pkgTiersShoot}${t.shoot ? ' ' + styles.hasShoot : ''}`}>
                  {t.shoot ? 'Yes' : 'No'}
                </div>
                <div className={styles.pkgTiersScale}>
                  <div className={styles.pkgTiersBar}>
                    <div className={styles.pkgTiersBarFill} style={{ width: `${fillPct}%` }} />
                  </div>
                  <span className={styles.pkgTiersMult}>{t.mult}x</span>
                </div>
              </div>
            )
          })}
        </div>
        <p className={styles.pkgTiersNote}>
          Repurpose and UGC tiers apply only when existing footage is available or client-captured. Run-and-gun and above require a scheduled shoot day. Hybrid and 3D tiers involve both production and significant post-production teams working in parallel.
        </p>
      </div>
    </section>
  )
}

function PkgMediaSlide() {
  const ratios = [
    { tier: 'ABM / Targeted',           ratio: '~0.5 : 1', note: 'Precise targeting reduces wasted spend' },
    { tier: 'Demand gen / Conversion',  ratio: '~1 : 1',   note: 'Match what you spent on creative' },
    { tier: 'Awareness / Launch',       ratio: '~2 : 1+',  note: 'Reach is the objective, invest accordingly' },
  ]
  const platforms = [
    { name: 'LinkedIn',     use: 'Demand gen, ABM, retargeting',              b2b: '$3,000–$10,000 / mo', b2c: '—'                   },
    { name: 'Meta',         use: 'Awareness, lead gen, retargeting',           b2b: '$1,000–$5,000 / mo',  b2c: '$500–$3,000 / mo'    },
    { name: 'TikTok',       use: 'Awareness, reach, creator-led content',      b2b: '—',                   b2c: '$500–$2,500 / mo'    },
    { name: 'YouTube',      use: 'Brand film distribution, reach campaigns',   b2b: '$1,500–$5,000 / mo',  b2c: '$1,000–$4,000 / mo'  },
    { name: 'Programmatic', use: 'Display, ABM, named account targeting',      b2b: '$3,000–$8,000 / mo',  b2c: '$1,500–$5,000 / mo'  },
  ]
  const recommended = [
    'Always-On Demand Engine',
    'Conversion Engine',
    'Lead Gen Engine',
    'Awareness Campaign',
    'ABM Sales Toolkit',
    'GTM Launch Pack',
  ]
  return (
    <section className={styles.pkgMediaSlide}>
      <div className={styles.pkgMediaLeft}>
        <p className={styles.pkgIntroEyebrow}>Appendix</p>
        <h2 className={styles.pkgIntroHeadline}>A note on<br />media spend.</h2>
        <p className={styles.pkgIntroBody}>
          Six of these packages include a media spend recommendation. This is separate from the production fee and covers the cost of distributing the work through paid channels. We scope and build the creative. You control the budget. The figures below are based on what we see across client work in both B2B and B2C programs, not published platform benchmarks.
        </p>
        <div className={styles.pkgMediaRatios}>
          <div className={styles.pkgMediaRatioHeader}>
            <span>Objective type</span>
            <span>Media : Creative</span>
            <span>Why</span>
          </div>
          {ratios.map((r, i) => (
            <div key={i} className={styles.pkgMediaRatioRow}>
              <span className={styles.pkgMediaRatioTier}>{r.tier}</span>
              <span className={styles.pkgMediaRatioValue}>{r.ratio}</span>
              <span className={styles.pkgMediaRatioNote}>{r.note}</span>
            </div>
          ))}
        </div>
        <p className={styles.pkgMediaNote}>
          These are directional guidelines, not fixed rules. Ratios shift based on audience size, market maturity, and how much existing brand equity you have. We do not manage ad accounts by default. Campaign setup and ongoing management can be added as a separate scope.
        </p>
      </div>
      <div className={styles.pkgMediaRight}>
        <div className={styles.pkgMediaSection}>
          <p className={styles.bsDetailLabel}>Platform guidance</p>
          <div className={styles.pkgMediaPlatforms}>
            {platforms.map((p, i) => (
              <div key={i} className={styles.pkgMediaPlatform}>
                <p className={styles.pkgMediaPlatformName}>{p.name}</p>
                <p className={styles.pkgMediaPlatformUse}>{p.use}</p>
                <div className={styles.pkgMediaPlatformRangeGroup}>
                  <div className={styles.pkgMediaPlatformRangeLine}>
                    <span className={styles.pkgMediaPlatformRangeLabel}>B2B</span>
                    <span className={styles.pkgMediaPlatformRange}>{p.b2b}</span>
                  </div>
                  <div className={styles.pkgMediaPlatformRangeLine}>
                    <span className={styles.pkgMediaPlatformRangeLabel}>B2C</span>
                    <span className={styles.pkgMediaPlatformRange}>{p.b2c}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.pkgMediaNote}>Ranges are estimates based on campaigns across both B2B and B2C programs. Actual minimums vary by platform, audience size, and objective.</p>
        </div>
        <div className={styles.pkgMediaSection}>
          <p className={styles.bsDetailLabel}>Packages that recommend spend</p>
          <div className={styles.pkgMediaTags}>
            {recommended.map((name, i) => (
              <span key={i} className={styles.pkgMediaTag}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PkgIntroSlide() {
  return (
    <section className={styles.pkgIntroSlide}>
      <div className={styles.pkgIntroLeft}>
        <p className={styles.pkgIntroEyebrow}>Creative Production Catalog</p>
        <h2 className={styles.pkgIntroHeadline}>Built from the briefs<br />we hear most often.</h2>
        <p className={styles.pkgIntroBody}>
          These 27 packages span content programs, brand systems, and digital products. Each starts with a proven scope, a clear goal, and a defined set of deliverables.
          From there, the work is shaped around your market, your audience, and what you are trying to accomplish.
        </p>
      </div>
      <div className={styles.pkgIntroRight}>
        <div className={styles.pkgIntroCard}>
          <p className={styles.pkgIntroCardLabel}>The goal</p>
          <p className={styles.pkgIntroCardBody}>Each package targets a specific funnel stage: awareness, demand, conversion, or retention. The goal drives the scope.</p>
        </div>
        <div className={styles.pkgIntroCard}>
          <p className={styles.pkgIntroCardLabel}>The deliverables</p>
          <p className={styles.pkgIntroCardBody}>A fixed set of assets mapped to where they serve your buyer in the journey. Format and volume adjust to fit your program.</p>
        </div>
        <div className={styles.pkgIntroCard}>
          <p className={styles.pkgIntroCardLabel}>The cadence</p>
          <p className={styles.pkgIntroCardBody}>A recommended rhythm for when and how often to run the program: monthly retainer, one-time engagement, or per campaign cycle.</p>
        </div>
      </div>
    </section>
  )
}

function PkgCoverSlide() {
  return (
    <section className={styles.coverSlide}>
      <video className={styles.coverVideo} src="https://cdn.sanity.io/files/ppq16wpu/production/6d752bbf01b6f5301b48d62598d4e1ee51a44251.mp4" autoPlay loop muted playsInline aria-hidden="true"/>
      <svg className={styles.coverLogo} viewBox="0 0 168 24" xmlns="http://www.w3.org/2000/svg" aria-label="Super Conscious" role="img">
        <path d="M132.995 4.23605C133.69 4.23605 134.242 3.72599 134.242 2.99733C134.242 2.26868 133.69 1.73499 132.995 1.73499C132.3 1.73499 131.772 2.26868 131.772 2.99733C131.772 3.72599 132.3 4.23605 132.995 4.23605Z" fill="currentColor"/>
        <path d="M81.4989 1.03586H81.5029V1.03192C83.232 1.03192 84.2954 2.49317 85.0654 4.23209C85.3628 4.90364 85.5144 5.66774 85.5144 5.66774L85.9359 5.58897L85.4317 0.0984497L85.0339 0.12602C85.0615 0.606539 84.902 0.927542 84.3742 0.927542C83.7144 0.927542 82.6333 0.447023 81.2882 0.447023C75.9848 0.447023 70.9453 7.31608 70.9453 13.4624C70.9453 17.151 73.1352 19.1814 75.6697 19.1814C78.2042 19.1814 81.1582 17.017 83.1374 13.9705L82.7672 13.7046C80.8136 16.2707 78.8364 17.3932 77.1211 17.3932C74.8268 17.3932 73.3478 15.7901 73.3478 12.716C73.3478 7.07582 77.3318 1.03782 81.5009 1.03782L81.4989 1.03586Z" fill="currentColor"/>
        <path d="M9.64172 0.968934C11.0931 0.968934 12.834 1.90437 14.1515 5.96515L14.5729 5.88637L13.5725 0.0866699L13.1747 0.114241C13.2023 0.541587 13.0172 0.86259 12.4874 0.86259C11.8277 0.86259 10.8509 0.409642 9.66338 0.409642C7.07764 0.409642 4.78139 2.57395 4.78139 5.38025C4.78139 7.01087 5.49232 8.42682 6.6818 9.73643L7.44787 10.5931C8.7949 12.0898 9.61218 13.425 9.61218 15.0832C9.61218 17.1943 8.13517 18.5827 6.10084 18.5827C4.06652 18.5827 2.30396 17.1648 0.931326 12.6235L0.509888 12.7023L1.27596 19.142L1.67377 19.0888C1.67377 18.7147 1.80571 18.3937 2.36107 18.3937C3.20591 18.3937 4.4722 19.142 6.08115 19.142C8.87761 19.142 11.6504 16.897 11.6504 13.8228C11.6504 11.9775 10.6224 10.6975 9.14347 9.01369L8.3518 8.10582C7.18989 6.79621 6.58333 5.59491 6.58333 4.20259C6.58333 2.25294 7.98156 0.968934 9.64369 0.968934H9.64172Z" fill="currentColor"/>
        <path d="M116.959 9.10035C117.276 8.73996 117.309 8.05857 117.02 7.56426C116.567 6.78637 115.832 6.43583 115.013 6.29995C113.607 6.06757 112.295 6.28616 111.295 7.44807C110.364 8.52924 110.48 9.78174 110.905 11.0264C111.262 12.0721 111.707 13.0843 112.055 14.132C112.248 14.7149 112.392 15.3333 112.433 15.9458C112.487 16.763 112.392 17.8521 111.774 18.0096C111.134 18.1731 110.206 17.4366 109.781 16.6941C109.597 16.3771 109.45 16.0344 109.237 15.741C108.904 15.2801 108.347 15.1443 107.876 15.3569C107.725 15.4239 107.593 15.5224 107.482 15.6405C107.299 15.8414 107.124 16.0482 106.919 16.2274C105.925 17.0998 104.968 17.4543 104.613 17.4543C104.591 17.4543 104.572 17.4503 104.55 17.4484C104.536 17.4444 104.523 17.4425 104.509 17.4366C104.505 17.4366 104.501 17.4326 104.497 17.4326C104.393 17.3893 104.298 17.2751 104.298 17.0427C104.298 16.6055 104.637 15.8099 104.924 15.2014L107.423 10.0771C107.855 9.20275 108.262 8.159 108.262 7.45595C108.262 6.80016 107.88 6.21724 106.968 6.21724C105.818 6.21724 104.956 7.11722 103.038 9.78765L99.0044 15.3904H98.6952L100.999 9.88415C101.311 9.13186 101.72 8.13537 101.72 7.45595C101.72 6.77653 101.297 6.21724 100.542 6.21724C100.521 6.21724 100.495 6.22117 100.474 6.22117V6.21724C99.1698 6.21724 98.0001 7.68636 96.7476 9.5789C96.332 10.2032 95.9716 10.7979 95.7077 11.178C94.9791 12.2848 94.2701 13.4447 93.4253 14.4688H93.1594L93.2264 14.3427C93.2382 14.3191 94.469 11.9992 94.6601 10.4868C94.6758 10.3292 94.6876 10.1855 94.6935 10.0496C94.7959 7.75726 93.5139 6.21724 91.5012 6.21724C89.6245 6.21724 87.789 7.5682 86.0383 10.2347C85.9674 10.343 85.9162 10.4198 85.8866 10.4592L85.8807 10.4671C85.5479 11.0795 84.9591 12.2316 84.6913 13.171C84.5554 13.7342 84.4746 14.3014 84.451 14.8489C84.3486 17.151 85.5932 18.6379 87.6216 18.6379C90.0873 18.6379 92.608 16.4519 93.9767 14.5003C94.7447 13.5255 95.3966 12.46 96.0799 11.4222C96.3635 11.0126 96.7889 10.3056 97.2714 9.59268C97.9193 8.71436 98.3782 8.13931 98.7208 7.80058C99.6681 7.55048 99.7094 7.67652 99.7094 7.85376C99.7094 8.26535 99.3491 9.04324 99.1108 9.60253L95.5404 18.2932C95.8515 18.2932 96.2119 18.244 96.525 18.244C96.8145 18.244 97.2675 18.2932 97.5806 18.2932L103.453 10.1126C105.107 7.83012 105.539 7.3693 105.897 7.3693C106.135 7.3693 106.279 7.56426 106.279 7.85376C106.279 8.29095 105.968 8.97037 105.487 9.96686L103.063 14.9946C102.815 15.5165 102.516 16.2097 102.374 16.8083C102.311 17.0191 102.272 17.218 102.272 17.3972C102.272 18.1002 102.703 18.6359 103.471 18.6359H103.495C104.048 18.63 104.609 18.4547 105.174 18.1061C105.738 17.7595 106.659 17.0722 107.226 16.5307C107.234 16.5661 107.236 16.5996 107.248 16.637C107.386 17.09 107.656 17.5626 108 17.8698C108.68 18.4783 109.554 18.6064 110.328 18.6359C113.172 18.6674 114.775 16.5661 114.054 13.8248C113.772 12.7594 113.327 11.7412 112.989 10.6876C112.794 10.0811 112.53 9.36227 112.431 8.73405C112.327 8.07235 112.268 7.13101 113.132 6.86318C113.664 6.69775 114.042 6.81395 114.613 7.99161C114.732 8.23581 114.925 8.59226 115.094 8.79116C115.287 9.01764 115.517 9.2579 115.779 9.36424C116.201 9.5336 116.638 9.47255 116.967 9.09444L116.959 9.10035ZM92.868 9.2835C92.6907 13.167 89.8194 18.1258 87.7437 18.1278C86.7236 18.1278 86.2234 17.3026 86.2943 15.7469C86.4578 12.1548 89.1715 6.8553 91.3949 6.8553C92.417 6.8553 92.9408 7.71787 92.8699 9.28547L92.868 9.2835Z" fill="currentColor"/>
        <path d="M35.0107 6.22507H34.991C34.9891 6.22507 34.9871 6.22507 34.9851 6.22507H34.9654H34.9733C32.9961 6.25461 31.0287 9.00971 29.9397 11.3257L29.918 11.371H29.5419L31.5841 6.53622C31.2414 6.53622 30.8436 6.58546 30.499 6.58546C30.1799 6.58546 29.6797 6.53622 29.3351 6.53622C29.0515 8.17668 28.6104 9.6596 28.0176 10.983C26.8695 13.1788 25.4023 15.2289 23.494 16.8024C23.4015 16.8772 23.2538 16.9875 23.0982 17.0998C22.6039 17.3853 22.2179 17.4641 21.9835 17.4641C21.7787 17.4641 21.6487 17.2947 21.6487 17.0033C21.6487 16.5917 22.0091 15.8138 22.2474 15.2545L25.8178 6.5638C25.5067 6.5638 25.1463 6.61303 24.8332 6.61303C24.5437 6.61303 24.0907 6.5638 23.7776 6.5638L17.905 14.7444C16.2508 17.0269 15.8195 17.4877 15.4611 17.4877C15.2228 17.4877 15.079 17.2928 15.079 17.0033C15.079 16.5661 15.3902 15.8866 15.8707 14.8902L18.295 9.86244C18.6298 9.15939 19.061 8.1373 19.061 7.45985C19.061 6.78239 18.6298 6.22113 17.8617 6.22113C16.8534 6.22113 15.9258 7.06795 14.9786 8.30272C15.1519 8.3362 15.3252 8.37559 15.4985 8.41497C16.1641 7.64299 16.5107 7.40667 16.749 7.3988C16.8908 7.40273 17.072 7.5012 17.072 7.81039C17.072 8.22198 16.7116 9.0491 16.4241 9.65566L13.925 14.7799C13.4937 15.6543 13.0861 16.698 13.0861 17.4011C13.0861 18.0569 13.4681 18.6398 14.3799 18.6398C15.53 18.6398 16.3926 17.7398 18.3107 15.0694L22.3439 9.4666H22.6531L20.349 14.9729C20.0378 15.7252 19.6282 16.7216 19.6282 17.4011C19.6282 18.0805 20.0595 18.6398 20.8275 18.6398C21.3888 18.6398 21.9579 18.4645 22.533 18.11C22.6393 18.045 22.7437 17.9741 22.85 17.9013V17.9052L22.8894 17.8757C23.3444 17.5645 23.7934 17.1963 24.2404 16.761C24.2936 16.7098 24.3448 16.6508 24.3979 16.5976C25.9084 15.1383 27.1314 13.3423 28.0944 11.4241H28.4193L28.378 11.558L24.6697 21.0522C24.203 22.4997 23.5905 22.7734 22.4916 22.7833L22.3774 23.1515H28.4666L28.6478 22.7833C27.4425 22.7754 26.9364 22.6533 26.7356 22.3303C26.5524 22.0349 26.6469 21.5997 26.8577 20.9912L27.9881 17.6157L28.0471 17.6787C28.6301 18.2971 29.4552 18.6378 30.3769 18.6378C31.9642 18.6378 33.6598 17.4286 35.0324 15.3195C36.2809 13.4013 37.0569 11.0637 37.0569 9.2224C37.0569 9.20271 37.0569 9.18105 37.0569 9.16135C37.0569 6.99705 35.9934 6.22507 34.9969 6.22507H35.0107ZM33.4825 15.0418C32.4191 17.0072 31.1902 18.1317 30.109 18.1317C29.7014 18.1317 29.3587 17.9801 29.0909 17.6807C28.7246 17.2731 28.5336 16.6074 28.5513 15.8098L28.5572 15.7803L28.9392 14.6538C29.8924 11.8141 32.3324 7.68632 33.9847 7.68632C34.7074 7.68632 35.06 8.33817 35.06 9.67732C35.06 11.1681 34.4416 13.2733 33.4845 15.0398L33.4825 15.0418Z" fill="currentColor"/>
        <path d="M65.4508 10.8589C63.7375 10.8018 63.379 9.41735 61.4432 9.35237C59.9504 9.30116 58.6132 10.4867 57.4907 12.135L57.9102 12.1882C58.6822 11.3 59.7259 10.8766 60.7894 10.9121C62.5184 10.9712 62.8749 12.3556 64.8265 12.4206C66.3035 12.4698 67.6446 11.2744 68.7652 9.63792L68.3497 9.57096C67.5777 10.4591 66.5457 10.8963 65.4528 10.8589H65.4508Z" fill="currentColor"/>
        <path d="M57.022 5.87653C55.7144 5.87653 53.6466 9.07276 52.2641 11.4931L52.081 11.8101L49.8103 16.2116H49.4145C50.5311 13.9114 52.6048 9.08261 52.6048 7.56425C52.6048 6.86513 52.1873 6.31569 51.3228 6.31569C50.4582 6.31569 49.4105 7.31611 48.3392 8.72419C48.3412 8.72616 48.3432 8.72813 48.3471 8.73207C47.6224 9.72659 46.9745 10.8885 46.5589 11.5147C45.3458 13.4427 44.436 14.8488 43.5458 15.8237L43.41 15.9458C43.3332 16.0147 43.2603 16.0876 43.1894 16.1604C42.8979 16.4598 41.9369 17.3617 40.9227 17.3617C39.7194 17.3617 39.1582 16.5405 39.1582 15.1088C39.1582 14.5495 39.235 13.9095 39.3787 13.2596L39.3925 13.2044L39.4437 13.1985C42.6616 12.7416 46.1355 10.6837 46.1355 8.15702C46.1355 6.95966 45.2533 6.18571 43.8846 6.18571C40.4126 6.18571 36.8875 11.4576 36.8875 15.2466C36.8875 17.3716 37.9943 18.6398 39.9853 18.6398C41.3166 18.6398 42.4686 18.0195 43.5104 16.7886C44.5167 15.672 45.6668 13.7952 46.9351 11.7786C47.453 10.9948 48.5401 9.12791 49.383 8.14717C49.7119 7.773 49.9876 7.55046 50.2002 7.54456C50.4149 7.55046 50.5567 7.69816 50.5567 7.96796C50.5567 8.39137 50.2593 9.11609 49.9895 9.81521L46.7125 18.3109C47.0316 18.3109 47.5023 18.2617 47.7977 18.2617C48.0931 18.2617 48.3412 18.3109 48.8828 18.3109L52.6796 11.818C54.135 9.3209 55.1925 8.19838 56.6991 7.72377C57.217 7.5485 57.8334 7.24916 57.8334 6.67608C57.8334 6.27827 57.538 5.8785 57.022 5.87653ZM39.5737 12.5309C40.3417 9.71871 42.0196 6.86907 43.7408 6.86907C44.5246 6.86907 44.6172 7.50911 44.6172 7.99357C44.6172 10.2544 42.0649 12.074 39.6623 12.6373L39.5343 12.6688L39.5717 12.5309H39.5737Z" fill="currentColor"/>
        <path d="M167.291 7.56425C166.838 6.78636 166.106 6.43582 165.285 6.29994C164.906 6.23692 164.536 6.20935 164.178 6.22116L164.186 6.21722C164.012 6.21722 163.847 6.22707 163.685 6.24283C163.678 6.24283 163.67 6.24283 163.662 6.24479C159.999 6.58943 158.764 10.4671 158.339 11.5147C157.512 13.5589 155.123 17.4622 153.508 17.4622C153.303 17.4622 153.173 17.2928 153.173 17.0013C153.173 16.5897 153.533 15.8118 153.772 15.2526L157.342 6.56186C157.031 6.56186 156.671 6.61109 156.358 6.61109C156.068 6.61109 155.615 6.56186 155.302 6.56186L149.429 14.7425C147.775 17.025 147.344 17.4858 146.985 17.4858C146.747 17.4858 146.603 17.2908 146.603 17.0013C146.603 16.5641 146.915 15.8847 147.395 14.8882L149.819 9.8605C150.154 9.15745 150.585 8.13536 150.585 7.45791C150.585 6.78046 150.154 6.21919 149.386 6.21919C148.378 6.21919 147.45 7.06601 146.503 8.30079C146.507 8.30079 146.513 8.30275 146.517 8.30472C145.723 9.28545 145 10.538 144.553 11.18C143.884 12.1981 143.183 13.4309 142.35 14.3939H142.09L142.117 14.3447C142.129 14.3211 143.36 12.0012 143.551 10.4887C143.567 10.3312 143.578 10.1874 143.584 10.0515C143.687 7.75922 142.405 6.21919 140.392 6.21919C137.773 6.21919 135.768 8.1393 134.527 9.93731C131.997 13.2143 130.545 17.4484 128.931 17.4484C128.736 17.4484 128.592 17.3007 128.592 17.0309C128.592 16.6134 128.98 15.7291 129.248 15.1639L131.747 9.92943C132.085 9.21653 132.523 8.18459 132.523 7.44806C132.523 6.78439 132.111 6.21919 131.26 6.21919C131.211 6.21919 131.162 6.22313 131.111 6.22904C130.526 6.29009 129.655 6.7135 128.897 7.56819C127.389 9.23622 126.242 12.1213 124.561 14.327C124.393 14.5554 124.232 14.7642 124.076 14.9631L123.978 15.1009C123.178 15.9911 122.333 16.7493 121.323 17.1904C121.14 17.2475 120.965 17.2928 120.809 17.3204C120.622 17.342 120.456 17.3479 120.299 17.344C118.735 17.2869 118.111 16.5247 118.066 14.6224C118.115 12.3182 118.911 10.0377 120.399 8.24761C120.766 7.80648 121.248 7.5032 121.585 7.32793C122.249 6.9833 122.804 7.3752 123.225 8.09204C123.275 8.17672 123.322 8.26337 123.369 8.35002C123.46 8.51938 123.556 8.69662 123.668 8.84432C123.993 9.27167 124.529 9.36029 124.97 9.06095C125.366 8.79312 125.64 8.20823 125.417 7.69029C125.21 7.21371 124.884 6.79818 124.541 6.57958C123.804 6.11285 122.91 6.09709 121.811 6.53429C118.924 7.68044 116.299 11.7314 116.197 15.2053C116.211 16.2136 116.534 17.0781 117.128 17.7083C117.749 18.3641 118.822 18.63 119.539 18.63C121.685 18.63 123.135 16.7236 124.243 15.3294C126.981 12.0091 128.485 7.40277 130.169 7.40277C130.364 7.40277 130.508 7.55047 130.508 7.82027C130.508 8.23777 130.12 9.122 129.852 9.6872L127.353 14.9217C127.014 15.6346 126.577 16.6665 126.577 17.4031C126.577 18.0667 126.989 18.6319 127.84 18.6319C127.889 18.6319 127.938 18.628 127.989 18.6221C128.574 18.561 129.445 18.1376 130.203 17.2829C131.711 15.6149 133.119 12.3045 134.803 10.0988H135.041C134.764 10.5498 133.923 11.9834 133.584 13.171C133.448 13.7342 133.367 14.3014 133.344 14.8488C133.241 17.151 134.486 18.6378 136.514 18.6378C138.982 18.6378 141.461 16.4499 142.83 14.4983C143.596 13.5235 144.246 12.46 144.929 11.4222C145.378 10.7743 146.182 9.37998 147.007 8.40713C147.304 8.0881 147.525 7.86359 147.706 7.70605C147.889 7.56031 148.071 7.45397 148.242 7.4008C148.254 7.4008 148.266 7.39686 148.275 7.39489C148.417 7.39883 148.598 7.49729 148.598 7.80648C148.598 8.21807 148.238 9.0452 147.95 9.65175L145.451 14.776C145.02 15.6504 144.612 16.6941 144.612 17.3972C144.612 18.053 144.994 18.6359 145.906 18.6359C147.056 18.6359 147.919 17.7359 149.837 15.0655L153.868 9.4627H154.177L151.873 14.969C151.562 15.7213 151.153 16.7177 151.153 17.3972C151.153 18.0766 151.584 18.6359 152.352 18.6359C155.834 18.6359 157.811 13.9823 158.735 11.7747C159.026 11.0776 159.871 8.53514 161.11 7.70605H161.364C160.653 8.72616 160.781 9.87823 161.171 11.0244C161.527 12.0701 161.972 13.0823 162.319 14.13C162.512 14.713 162.657 15.3313 162.695 15.9438C162.697 16.4795 162.65 17.1727 162.559 17.4267C162.386 17.8422 162.201 18.053 161.925 18.116C161.32 18.2558 160.546 17.9998 160.036 17.3597C159.707 16.9088 159.558 16.5878 159.44 16.2786C159.219 15.6622 159.065 15.3747 158.624 15.3747C158.096 15.3747 157.677 15.7705 157.677 16.3652C157.677 17.5646 159.124 18.6122 160.844 18.6319L160.838 18.6359C160.854 18.6359 160.869 18.6359 160.887 18.6359C163.699 18.6398 165.023 16.5503 164.306 13.8268C164.026 12.7613 163.581 11.7432 163.242 10.6896C163.047 10.083 162.783 9.36423 162.685 8.73601C162.581 8.07431 162.524 7.13297 163.386 6.86514C163.92 6.69971 164.296 6.8159 164.867 7.99357C164.985 8.23777 165.178 8.59422 165.348 8.79312C165.539 9.01959 165.771 9.25985 166.031 9.3662C166.452 9.53556 166.89 9.47451 167.218 9.0964C167.535 8.73601 167.569 8.05462 167.281 7.56031L167.291 7.56425ZM141.765 9.28349C141.587 13.167 138.716 18.1258 136.64 18.1278C135.62 18.1278 135.12 17.3026 135.191 15.7469C135.355 12.1548 138.068 6.85529 140.292 6.85529C141.314 6.85529 141.838 7.71786 141.767 9.28546L141.765 9.28349Z" fill="currentColor"/>
      </svg>
      <div className={styles.coverDivider} aria-hidden="true"/>
      <svg className={styles.coverMark} viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g clipPath="url(#sc-mark-clip-packages)">
          <path d="M58.07 43.71L56.14 30.12C56.09 29.78 56.03 29.45 55.96 29.12C55.96 29.06 55.94 29 55.92 28.94C55 24.68 52.72 20.81 49.4 17.93C45.74 14.75 41.04 13 36.19 13C26.5 13 18.39 19.86 16.45 28.97C16.45 28.97 16.45 28.99 16.45 29C16.16 30.35 16.01 31.75 16.01 33.19C16.01 39.84 17.82 44.38 19.41 48.39C20.72 51.69 21.86 54.54 21.86 58.02C21.86 58.73 21.86 59.36 21.86 59.36V61.57C21.85 61.75 21.92 61.92 22.04 62.05C22.17 62.18 22.34 62.25 22.51 62.25H34.2C34.2 62.25 34.21 62.25 34.22 62.25H38.17C38.17 62.25 38.17 62.25 38.18 62.25H48.15C48.33 62.25 48.5 62.18 48.62 62.06C48.74 61.94 48.82 61.76 48.82 61.59V56.58H52.74C53.55 56.58 54.2 55.92 54.2 55.12V45.11H56.88C57.23 45.11 57.57 44.96 57.8 44.69C58.03 44.42 58.13 44.07 58.08 43.73L58.07 43.71ZM36.19 14.34C40.72 14.34 45.1 15.97 48.53 18.94C51.45 21.47 53.5 24.81 54.45 28.5H17.93C20.02 20.36 27.41 14.34 36.19 14.34ZM34.62 60.9L29.62 51.44H42.77L37.77 60.9H34.62ZM43.48 50.1H28.91L23.91 40.63H48.48L43.48 50.1ZM49.19 39.3H23.2L18.2 29.83H54.19L49.19 39.3ZM20.65 47.89C19.1 44 17.34 39.58 17.34 33.19C17.34 32.54 17.37 31.89 17.44 31.26L22.21 40.28L27.92 51.08L33.11 60.9H23.18V59.36C23.18 59.36 23.18 58.73 23.18 58.01C23.18 54.27 21.94 51.17 20.64 47.89H20.65ZM53.53 43.76C53.16 43.76 52.86 44.06 52.86 44.43V55.11C52.86 55.18 52.8 55.24 52.73 55.24H48.14C47.77 55.24 47.47 55.54 47.47 55.91V60.92H39.27L44.46 51.1L50.17 40.3L54.94 31.27L56.71 43.78H53.52L53.53 43.76Z" fill="currentColor"/>
        </g>
        <defs>
          <clipPath id="sc-mark-clip-packages">
            <rect width="42.09" height="49.24" fill="white" transform="translate(16 13)"/>
          </clipPath>
        </defs>
      </svg>
      <div className={styles.coverCornerStack}>
        <div className={styles.coverCornerTitle}>Creative Production Catalog.</div>
        <div className={styles.coverCorner}>27 packages, 106 services. Content Programs, Brand Systems, and Digital Products.</div>
      </div>
    </section>
  )
}

function PkgSlide({ pkg, num, total }) {
  return (
    <section className={styles.pkgSlide}>
      <div className={styles.pkgInfo} style={{ justifyContent: 'flex-start' }}>
        <div>
          <p className={styles.pkgNum}>{String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <h2 className={styles.pkgName}>{pkg.name}</h2>
        </div>
        <div className={styles.pkgInfoMid}>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>{"Who it's for"}</p>
            <p className={styles.pkgInfoSectionBody}>{pkg.who}</p>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>{"What you'll have"}</p>
            <p className={styles.pkgInfoSectionBody}>{pkg.have}</p>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>Deliverables</p>
            <div className={styles.pkgMetrics}>
              {pkg.deliverables.map((d, i) => (
                <span key={i} className={styles.pkgMetricTag}>{d.label}</span>
              ))}
            </div>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>Media spend</p>
            <p className={pkg.mediaSpend === 'Recommended' ? styles.pkgMediaSpendYes : styles.pkgMediaSpendNo}>
              {pkg.mediaSpend}
            </p>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>Metrics</p>
            <div className={styles.pkgMetrics}>
              {pkg.metrics.map((m, i) => (
                <span key={i} className={styles.pkgMetricTag}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.pkgBottomCard}>
          <p className={styles.pkgTarget}>{pkg.target}</p>
          <p className={styles.pkgPrice}>Starting at {pkg.price}</p>
          <p className={styles.pkgCadence}>{pkg.cadence}</p>
        </div>
      </div>
      <div className={styles.pkgCardArea}>
        <div className={styles.pkgFlowCard}>
          <p className={styles.bsDetailLabel}>{pkg.flowLabel || 'User journey'}</p>
          <FlowDiagram steps={pkg.flow} />
        </div>
        <div className={styles.pkgMosaic}>
          {[0, 1, 2, 3].map(i => <div key={i} className={styles.pkgMosaicTile} />)}
        </div>
      </div>
    </section>
  )
}


function PkgSectionSlide({ section, svcCount }) {
  return (
    <section className={styles.pkgVerticalSlide}>
      <div className={styles.pkgVerticalLeft}>
        <p className={styles.pkgSectionEyebrow}>{String(section.num).padStart(2, '0')} / 03</p>
        <h2 className={styles.pkgSectionTitle}>{section.title}</h2>
        <p className={styles.pkgSectionBody}>{section.body}</p>
        <div className={styles.pkgAreaCounts}>
          <span className={styles.pkgSectionCount}>{section.count} packages</span>
          {svcCount > 0 && <span className={styles.pkgSectionCount}>{svcCount} services</span>}
        </div>
      </div>
      <div className={styles.pkgVerticalRight}>
        <div className={styles.pkgVerticalDefCard}>
          <p className={styles.pkgVerticalDefLabel}>Packages</p>
          <p className={styles.pkgVerticalDefBody}>Fixed-scope bundles. Every deliverable, timeline, and price is defined before work starts. No hourly billing, no scope creep.</p>
        </div>
        <div className={styles.pkgVerticalDefCard}>
          <p className={styles.pkgVerticalDefLabel}>Services</p>
          <p className={styles.pkgVerticalDefBody}>Individual deliverables priced by the hours each role contributes. Add them to an existing package or book them on their own.</p>
        </div>
      </div>
    </section>
  )
}

function PkgTocSlide({ tocData, goTo }) {
  return (
    <section className={styles.pkgTocSlide}>
      <div className={styles.pkgTocLeft}>
        <p className={styles.pkgSectionEyebrow}>Contents</p>
        <h2 className={styles.pkgTocHeading}>{"What's"} inside.</h2>
      </div>
      <div className={styles.pkgTocBody}>
        {tocData.map((col) => (
          <div key={col.title} className={styles.pkgTocColumn}>
            <button className={styles.pkgTocSectionBtn} onClick={() => goTo(col.sectionIdx)}>
              <span className={styles.pkgTocSectionName}>{col.title}</span>
              <span className={styles.pkgTocArrow}>&#8594;</span>
            </button>
            {col.areas.map((a) => (
              <button key={a.idx} className={styles.pkgTocItem} onClick={() => goTo(a.idx)}>
                <span className={styles.pkgTocName}>{a.title}</span>
                <span className={styles.pkgTocCount}>{a.count}</span>
                <span className={styles.pkgTocArrow}>&#8594;</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function PkgSubSlide({ section, count }) {
  return (
    <section className={styles.pkgSubSlide}>
      <div className={styles.pkgSectionInner}>
        <p className={styles.pkgSectionEyebrow}>{section}</p>
        <h2 className={styles.pkgSubTitle}>Packages.</h2>
        <span className={styles.pkgSectionCount}>{count} {count === 1 ? 'package' : 'packages'}</span>
      </div>
    </section>
  )
}

function SvcSubSlide({ section, count }) {
  return (
    <section className={styles.pkgSubSlide}>
      <div className={styles.pkgSectionInner}>
        <p className={styles.pkgSectionEyebrow}>{section}</p>
        <h2 className={styles.pkgSubTitle}>Services.</h2>
        <span className={styles.pkgSectionCount}>{count} {count === 1 ? 'service' : 'services'}</span>
      </div>
    </section>
  )
}

function SvcAreaSlide({ area, count, section }) {
  return (
    <section className={styles.pkgSectionSlide}>
      <div className={styles.pkgSectionInner}>
        <p className={styles.pkgSectionEyebrow}>{section}</p>
        <h2 className={styles.pkgSectionTitle}>{area}.</h2>
        <span className={styles.pkgSectionCount}>{count} {count === 1 ? 'service' : 'services'}</span>
      </div>
    </section>
  )
}

function SvcSlide({ svc, num, total }) {
  return (
    <section className={styles.pkgSlide}>
      <div className={styles.pkgInfo} style={{ justifyContent: 'flex-start' }}>
        <div>
          <p className={styles.pkgNum}>{String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <h2 className={styles.pkgName}>{svc.name}</h2>
        </div>
        <div className={styles.pkgInfoMid}>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>{"Who it's for"}</p>
            <p className={styles.pkgInfoSectionBody}>{svc.who}</p>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>{"What you'll have"}</p>
            <p className={styles.pkgInfoSectionBody}>{svc.have}</p>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>Includes</p>
            <div className={styles.pkgMetrics}>
              {svc.deliverables.map((d, i) => (
                <span key={i} className={styles.pkgMetricTag}>{d.label}</span>
              ))}
            </div>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>Turnaround</p>
            <p className={styles.pkgMediaSpendNo}>{svc.turnaround}</p>
          </div>
          <div className={styles.pkgInfoCard}>
            <p className={styles.pkgInfoSectionLabel}>What to track</p>
            <div className={styles.pkgMetrics}>
              {svc.metrics.map((m, i) => (
                <span key={i} className={styles.pkgMetricTag}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.pkgBottomCard}>
          <p className={styles.pkgTarget}>{svc.target}</p>
          <p className={styles.pkgPrice}>{svc.price}</p>
          <p className={styles.pkgCadence}>{svc.hours} hrs</p>
        </div>
      </div>
      <div className={styles.pkgCardArea}>
        <div className={styles.pkgFlowCard}>
          <p className={styles.bsDetailLabel}>How it works</p>
          <FlowDiagram steps={svc.flow} />
        </div>
        <div className={styles.svcPortraitImg} />
      </div>
    </section>
  )
}

function PkgClosingSlide() {
  return (
    <section className={styles.closingSlide}>
      <img src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif" alt="" className={styles.closingGif}/>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function ContentPackages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [menuOpen, setMenuOpen] = useState(false)

  const SECTIONS = [
    { num: 1, id: 'content', title: 'Content Programs', body: 'Demand generation, lead capture, retention, and awareness. Delivered as fixed-scope production programs.', count: 12 },
    { num: 2, id: 'brand',   title: 'Brand Systems',   body: 'Brand strategy, identity, verbal systems, and sales enablement. Built to last and easy to extend.',         count: 8  },
    { num: 3, id: 'digital', title: 'Digital Products', body: 'Websites, microsites, interactive experiences, and product builds. Designed and shipped in one engagement.', count: 7  },
  ]

  const mkVerticalSlides = (section, pkgs, svcAreas, pkgStartNum) => {
    const svcCount = svcAreas.reduce((s, a) => s + a.services.length, 0)
    return [
      { kind: 'section',  section, svcCount },
      { kind: 'pkg-sub',  section: section.title, count: pkgs.length },
      ...pkgs.map((pkg, i) => ({ kind: 'package', pkg, num: pkgStartNum + i })),
      { kind: 'svc-sub',  section: section.title, count: svcCount },
      ...svcAreas.flatMap(area => [
        { kind: 'service-area', area: area.area, count: area.services.length, section: section.title },
        ...area.services.map((svc, i) => ({ kind: 'service', svc, area: area.area, svcNum: i + 1, svcTotal: area.services.length })),
      ]),
    ]
  }

  const slides = [
    { kind: 'cover' },
    { kind: 'intro' },
    { kind: 'toc' },
    ...mkVerticalSlides(SECTIONS[0], PACKAGES.slice(0, 12),  CONTENT_SERVICES, 1),
    ...mkVerticalSlides(SECTIONS[1], PACKAGES.slice(12, 20), BRAND_SERVICES,   13),
    ...mkVerticalSlides(SECTIONS[2], PACKAGES.slice(20, 27), DIGITAL_SERVICES, 21),
    { kind: 'closing' },
    { kind: 'media' },
    { kind: 'tiers' },
  ]

  const tocData = slides.reduce((acc, s, i) => {
    if (s.kind === 'section')      acc.push({ title: s.section.title, sectionIdx: i, areas: [] })
    if (s.kind === 'pkg-sub'  && acc.length > 0) acc[acc.length - 1].areas.push({ title: 'Packages', count: s.count, idx: i })
    if (s.kind === 'service-area' && acc.length > 0) acc[acc.length - 1].areas.push({ title: s.area, count: s.count, idx: i })
    return acc
  }, [])

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
    title: 'Creative Production Catalog | Super Conscious',
    path: '/content-packages',
    noindex: true,
  })

  const current = slides[idx]

  return (
    <main className={styles.main}>
      <div className={styles.stage}>
        <div className={styles.slideFrame}>
          {current.kind === 'cover'   && <PkgCoverSlide />}
          {current.kind === 'intro'   && <PkgIntroSlide />}
          {current.kind === 'toc'          && <PkgTocSlide tocData={tocData} goTo={setIdx} />}
          {current.kind === 'section'       && <PkgSectionSlide section={current.section} svcCount={current.svcCount} />}
          {current.kind === 'pkg-sub'       && <PkgSubSlide section={current.section} count={current.count} />}
          {current.kind === 'svc-sub'       && <SvcSubSlide section={current.section} count={current.count} />}
          {current.kind === 'package'       && <PkgSlide pkg={current.pkg} num={current.num} total={PACKAGES.length} />}
          {current.kind === 'closing'       && <PkgClosingSlide />}
          {current.kind === 'service-area'  && <SvcAreaSlide area={current.area} count={current.count} section={current.section} />}
          {current.kind === 'service'       && <SvcSlide svc={current.svc} num={current.svcNum} total={current.svcTotal} />}
          {current.kind === 'media'            && <PkgMediaSlide />}
          {current.kind === 'tiers'           && <PkgTiersSlide />}
        </div>
        <div className={styles.controls}>
          <div className={styles.menuWrap}>
            {menuOpen && (
              <>
                <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.jumpMenu}>
                  {tocData.map(col => (
                    <div key={col.title} className={styles.jumpCol}>
                      <button
                        className={styles.jumpSection}
                        onClick={() => { setIdx(col.sectionIdx); setMenuOpen(false) }}
                      >
                        {col.title}
                      </button>
                      {col.areas.map(a => (
                        <button
                          key={a.idx}
                          className={styles.jumpArea}
                          onClick={() => { setIdx(a.idx); setMenuOpen(false) }}
                        >
                          <span>{a.title}</span>
                          <span className={styles.jumpCount}>{a.count}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
            <button
              type="button"
              className={`${styles.navBtn} ${styles.menuIconBtn} ${menuOpen ? styles.menuBtnActive : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Jump to section"
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
                <rect x="0" y="0"  width="14" height="2" rx="1" fill="currentColor"/>
                <rect x="0" y="5"  width="14" height="2" rx="1" fill="currentColor"/>
                <rect x="0" y="10" width="14" height="2" rx="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <button type="button" className={styles.navBtn} onClick={() => setIdx(idx - 1)} disabled={idx === 0} aria-label="Previous slide">
            {String.fromCharCode(8592)} Prev
          </button>
          <span className={styles.counter}>
            {String(idx + 1).padStart(2, '0')} <span className={styles.counterDim}>/ {String(total).padStart(2, '0')}</span>
          </span>
          <button type="button" className={styles.navBtn} onClick={() => setIdx(idx + 1)} disabled={idx === total - 1} aria-label="Next slide">
            Next {String.fromCharCode(8594)}
          </button>
        </div>
      </div>
    </main>
  )
}

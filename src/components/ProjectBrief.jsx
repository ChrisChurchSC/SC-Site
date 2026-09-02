import { useState } from 'react'

import styles from './ProjectBrief.module.css'
import v3 from '../pages/HomeV3.module.css'
import { industries } from '../data/industries'
import { tabs as pricingTabs } from '../data/pricingTabs'
import { money } from './PricingTier'
import { outcomes } from '../data/outcomes'
import { services } from '../data/services'
import { WORK_BY_STAGE } from './V3Nav'
import { DISCIPLINES } from '../pages/Services'
import { submitLead } from '../lib/submitLead'

/**
 * THE PROJECT BRIEF — what "Start a project" opens.
 *
 * Six questions in the site's own vocabulary, then a name and an email:
 * which service (Build or Grow), and with it what /pricing sells under it —
 * Build's four project types (Brand platform, Website, Campaign, Channels)
 * or Grow's hour buckets (25 to 150 hours a month), read from pricingTabs
 * so the brief and the price list cannot disagree — then which industry,
 * which stage, which outcome, and, if they already know, which disciplines. Every list is the one the
 * rest of the site renders from — services.js, industries.js, the stages
 * the nav shows, outcomes.js and the twelve disciplines — so a rename
 * anywhere renames it here, and a brief arrives in the words the sales
 * conversation already uses.
 *
 * ONLY THE PERSON IS REQUIRED. Name, email and the service. The rest is
 * optional on purpose: the audience file says this buyer does not brief
 * well and does not say "brand", and a form that refuses to send until
 * every question is answered is a form that does not get sent. What they
 * skip is a fact about them too.
 *
 * CHOICES ARE CHIPS, NOT DROPDOWNS: four to twelve short options each,
 * which a chip row shows at once and a dropdown hides. Each row is a
 * radiogroup or a group of checkboxes for the screen reader; the chips are
 * buttons with their state on them. The chosen values go out as hidden
 * fields, one per question, joined with commas where there are several —
 * the same submission path every other form on the site uses (submitLead),
 * so the brief lands in the same place enquiries do.
 *
 * NEVER REPORTS A SEND IT WAS NOT TOLD ABOUT. submitLead returns ok or an
 * error, and the confirmation is gated on ok — the failure that once
 * discarded ten weeks of enquiries behind a green tick.
 */
const SERVICE_OPTIONS = services.map(({ name }) => name).concat('Not sure yet')
/* The pricing page's own tiers, each with its starting price as a hint on
   the chip (Chris, 2026-09-02) — the same figure the pricing card shows, so
   the brief cannot quote a different number. Build's carry a name; Grow's
   are named by their hours, which is the kicker on each card, and priced
   per month. */
const BUILD_TYPES = (pricingTabs.find((t) => t.id === 'project')?.tiers ?? []).map(({ name, price }) => ({
  value: name,
  hint: typeof price === 'number' ? `from ${money(price)}` : null,
}))
const GROW_BUCKETS = (pricingTabs.find((t) => t.id === 'subscription')?.tiers ?? []).map(({ kicker, price }) => ({
  value: kicker,
  hint: typeof price === 'number' ? `${money(price)} / month` : null,
}))
const INDUSTRY_OPTIONS = industries.map(({ name }) => name).concat('Something else')
const STAGE_OPTIONS = WORK_BY_STAGE.map(({ label }) => label)
const OUTCOME_OPTIONS = outcomes.map(({ name }) => name).concat('Not sure yet')
const DISCIPLINE_OPTIONS = DISCIPLINES.map(({ name }) => name)

/* An option is a string, or { value, hint } when it carries a price. */
const norm = (o) => (typeof o === 'string' ? { value: o, hint: null } : o)

function Chips({ legend, name, options, value, onChange, multiple = false, required = false }) {
  const selected = (opt) => (multiple ? value.includes(opt) : value === opt)
  /* Functional update for the multi-select, so two quick clicks each see
     the other's result rather than the render they were born in. */
  const toggle = (opt) => {
    if (!multiple) return onChange(opt)
    onChange((prev) => (prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]))
  }
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        {legend}
        {required ? <span className={styles.req}> · required</span> : <span className={styles.opt}> · optional{multiple ? ', pick any' : ''}</span>}
      </legend>
      <div className={styles.chips} role={multiple ? 'group' : 'radiogroup'} aria-label={legend}>
        {options.map(norm).map(({ value: opt, hint }) => (
          <button
            key={opt}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={selected(opt)}
            className={`${styles.chip}${selected(opt) ? ' ' + styles.chipOn : ''}`}
            onClick={() => toggle(opt)}
          >
            {opt}
            {hint && <span className={styles.chipHint}>{hint}</span>}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={multiple ? value.join(', ') : value} />
    </fieldset>
  )
}

export default function ProjectBrief({ onSent }) {
  const [service, setService] = useState('')
  const [buildTypes, setBuildTypes] = useState([])
  const [growBucket, setGrowBucket] = useState('')
  const [industry, setIndustry] = useState('')
  const [stage, setStage] = useState('')
  const [outcome, setOutcome] = useState('')
  const [disciplines, setDisciplines] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!service) { setStatus('error'); setError('Pick a service, even if it is "Not sure yet".'); return }
    setStatus('sending'); setError('')
    const result = await submitLead(e.currentTarget)
    if (result.ok) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'project_brief_sent' })
      onSent?.()
    } else {
      setStatus('error'); setError(result.error)
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <input type="hidden" name="_subject" value="Project brief from super-conscious.studio" />
      <input type="hidden" name="request_type" value="project" />
      {/* Honeypot, the same one every form here carries. */}
      <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className={styles.gotcha} aria-hidden="true" />

      <Chips legend="What are you looking for" name="service" options={SERVICE_OPTIONS} value={service} onChange={setService} required />
      {/* THE SERVICE'S OWN MENU, once a service is chosen: Build's project
          types (pick any — a brand platform and a website is one brief) or
          Grow's hour bucket (pick one — it is a size). Both stay in state
          when the person changes their mind, so switching to Grow and back
          does not lose what they picked under Build; only the chosen
          service's list is submitted, since the other's hidden field is not
          rendered. */}
      {service === 'Build' && (
        <Chips legend="Build project type" name="build_project_types" options={BUILD_TYPES} value={buildTypes} onChange={setBuildTypes} multiple />
      )}
      {service === 'Grow' && (
        <Chips legend="Grow bucket" name="grow_bucket" options={GROW_BUCKETS} value={growBucket} onChange={setGrowBucket} />
      )}
      <Chips legend="Industry" name="industry" options={INDUSTRY_OPTIONS} value={industry} onChange={setIndustry} />
      <Chips legend="Stage" name="stage" options={STAGE_OPTIONS} value={stage} onChange={setStage} />
      <Chips legend="The outcome you are after" name="outcome" options={OUTCOME_OPTIONS} value={outcome} onChange={setOutcome} />
      <Chips legend="Disciplines you already know you need" name="disciplines" options={DISCIPLINE_OPTIONS} value={disciplines} onChange={setDisciplines} multiple />

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>Name<span className={styles.req}> · required</span></span>
          <input className={styles.input} type="text" name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Email<span className={styles.req}> · required</span></span>
          <input className={styles.input} type="email" name="email" autoComplete="email" required />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Company<span className={styles.opt}> · optional</span></span>
          <input className={styles.input} type="text" name="company" autoComplete="organization" />
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className={styles.label}>Anything else<span className={styles.opt}> · optional</span></span>
          <textarea className={`${styles.input} ${styles.textarea}`} name="message" rows="3" placeholder="Timing, budget, what prompted this — whatever helps." />
        </label>
      </div>

      <div className={styles.foot}>
        <button type="submit" className={v3.contactCta} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send the brief →'}
        </button>
        {status === 'error' && <p className={styles.error} role="alert">{error}</p>}
        <p className={styles.note}>Next you pick a time to talk. We read this first.</p>
      </div>
    </form>
  )
}

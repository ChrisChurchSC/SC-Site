/* The workspace's real metrics, if this checkout has them.
 *
 * import.meta.glob rather than a plain import: a missing module is a build
 * error, and this module is missing by design on every clone. The glob simply
 * matches nothing, and everything downstream treats that as "no source
 * connected" — which is true, and is a state the dashboard already draws.
 *
 * To populate it, drop a metrics.local.js beside this file exporting
 * { columns, rows }. It is gitignored: the repository is public and traffic,
 * leads and search figures are not.
 */
const found = import.meta.glob('./metrics.local.js', { eager: true })

const data = Object.values(found)[0]?.default ?? null

export const METRICS = data
export const HAS_METRICS = Boolean(data)

/* Derived figures for the Performance section. Computed here rather than
   written down, so they cannot disagree with the table they came from — the
   same rule the wiki's counts follow. */
export const metricsSummary = () => {
  if (!data) return null
  const { rows } = data
  const last = rows[rows.length - 1]
  const sum = (k) => rows.reduce((n, r) => n + (r[k] ?? 0), 0)

  return {
    days: rows.length,
    from: rows[0].date,
    to: last.date,
    activeUsers: sum('ga_desktop_active_users_y') + sum('ga_mobile_active_users_y'),
    newUsers: sum('ga_desktop_new_users_y') + sum('ga_mobile_new_users_y'),
    events: sum('ga_desktop_events_y') + sum('ga_mobile_events_y'),
    impressions: sum('gsc_impressions'),
    clicks: sum('gsc_clicks'),
    indexed: last.gsc_indexed,
    leads: sum('ga_leads_generate_lead_y'),
    keyEvents: sum('ga_key_events_y'),
    /* Series for the charts, in date order. */
    dates: rows.map((r) => r.date.slice(5)),
    desktop: rows.map((r) => r.ga_desktop_active_users_y ?? 0),
    mobile: rows.map((r) => r.ga_mobile_active_users_y ?? 0),
    impressionsSeries: rows.map((r) => r.gsc_impressions ?? 0),
    eventsSeries: rows.map((r) => (r.ga_desktop_events_y ?? 0) + (r.ga_mobile_events_y ?? 0)),
    channels: [
      { label: 'Direct', value: sum('desktop_nu_direct') },
      { label: 'Organic', value: sum('desktop_nu_organic') },
      { label: 'Social', value: sum('desktop_nu_social') },
      { label: 'Referral', value: sum('desktop_nu_referral') },
      { label: 'Email', value: sum('desktop_nu_email') },
    ].filter((c) => c.value > 0),
  }
}

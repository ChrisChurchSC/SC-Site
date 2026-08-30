/* A SAMPLE OF THE REAL METRICS TABLE.
 *
 * Shaped after the Performance tab in the Conscious app: metrics.csv under
 * Brand / Data, one row per day, rendered through the app's DataGrid. The
 * column names, the row shape, the stat tiles above it and the stale-source
 * blank are all taken from that surface rather than from what a marketing
 * dashboard usually looks like.
 *
 * WHY NOT THE REAL NUMBERS. The app reads a gitignored metrics.local.js and
 * this checkout has one, so the actual figures were available. They are not
 * used here: publishing a studio's own daily traffic on its own marketing
 * site is a decision for Chris, not a detail to slip into a hero. These are
 * sample figures in the real table's shape, and the panel says so.
 *
 * WHAT IS NOT INVENTED is the vocabulary. The previous version of this panel
 * showed lift, click rate, conversions and per-channel conversion rates —
 * none of which exist anywhere in the product. The app has no CTR, CPC,
 * spend, conversion-rate or reach column, and its own empty state says the
 * figures come from the connection "rather than something invented". A
 * marketing site drawing metrics the product does not have was doing the
 * thing the app refuses to do.
 *
 * The tiles are derived from the rows below, not typed in: sums for the
 * first three, last reading for Pages indexed, which is how the app does it.
 */
export const metricsSample = {
  source: { days: 8, to: '2026-08-25', file: 'metrics.csv', path: 'Brand / Data' },

  columns: ['Date', 'Active', 'New', 'Events', 'Impressions', 'Clicks', 'Indexed', 'Notes'],

  /* The last row's search figures are null on purpose. Search Console lags,
     and the real table leaves a stale day blank with a note rather than
     back-filling it — which is the detail that makes this read as a real
     table rather than a drawing of one. */
  rows: [
    { date: '08-18', active: 23, desktop: 18, mobile: 5, fresh: 23, events: 184, impressions: 170, clicks: 1, indexed: 78, note: '' },
    { date: '08-19', active: 31, desktop: 24, mobile: 7, fresh: 26, events: 242, impressions: 198, clicks: 3, indexed: 78, note: '' },
    { date: '08-20', active: 28, desktop: 21, mobile: 7, fresh: 19, events: 210, impressions: 176, clicks: 2, indexed: 79, note: '' },
    { date: '08-21', active: 44, desktop: 33, mobile: 11, fresh: 33, events: 356, impressions: 241, clicks: 5, indexed: 79, note: '' },
    { date: '08-22', active: 39, desktop: 29, mobile: 10, fresh: 24, events: 298, impressions: 209, clicks: 4, indexed: 81, note: '' },
    { date: '08-23', active: 18, desktop: 13, mobile: 5, fresh: 11, events: 132, impressions: 154, clicks: 1, indexed: 81, note: '' },
    { date: '08-24', active: 52, desktop: 39, mobile: 13, fresh: 38, events: 401, impressions: 268, clicks: 6, indexed: 82, note: '' },
    { date: '08-25', active: 61, desktop: 45, mobile: 16, fresh: 41, events: 470, impressions: null, clicks: null, indexed: 82, note: 'GSC stale' },
  ],

  /* New users by acquisition channel, summing to the New users total. The
     app draws this as a donut with the total in the middle and any
     zero-value channel filtered out. */
  channels: [
    { name: 'Direct', value: 96 },
    { name: 'Organic', value: 61 },
    { name: 'Social', value: 32 },
    { name: 'Referral', value: 18 },
    { name: 'Email', value: 8 },
  ],
}

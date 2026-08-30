/* THE SAMPLE PERFORMANCE DATA, in one place.
 *
 * EVERY FIGURE HERE IS INVENTED. It is a demo of what the Measurement view
 * shows, not a result anybody achieved, and both surfaces that render it
 * carry a visible "Sample data" tag saying so. Do not lift a number out of
 * here into a claim.
 *
 * It lives in its own file because two places draw it now — the Measurement
 * card on /v3 and the dashboard window in the Grow hero — and a mock that
 * says +18% on one page and +24% on another is a mock that has been caught.
 *
 * The weekly figures sum to the conversions total on purpose: a panel whose
 * total does not match its own chart is the detail that makes a mock look
 * like a mock.
 */
export const dashboard = {
  stats: [
    { value: '+18%', label: 'lift' },
    { value: '4.2%', label: 'click rate' },
    { value: '454', label: 'conversions' },
  ],
  weeks: [38, 52, 44, 61, 49, 72, 58, 80],
  /* Conversion rate by channel, not share of output. The bars are scaled to
     the best of the three rather than to 100, or three single-digit
     percentages render as three slivers and the comparison — which is the
     only thing this row is for — disappears. */
  channels: [
    { name: 'Email', rate: 5.1 },
    { name: 'Paid social', rate: 3.8 },
    { name: 'Organic', rate: 2.4 },
  ],
}

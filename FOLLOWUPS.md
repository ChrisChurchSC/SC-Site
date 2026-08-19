# Follow-ups / Tech Debt

Deferred items worth addressing when someone next touches this project.

## 1. Sanity CMS cleanup — thought post duplicate images

The "Rethinking the workweek" thought post (`slug: rethinking-the-workweek`)
shipped with duplicate body images. This was **fixed at the renderer level**
(see PR #92) — `src/pages/ThoughtPost.jsx` now classifies each body image by
the dimensions encoded in its Sanity URL (`…-1024x574` = 16:9 desktop,
`…-819x1024` = 4:5 mobile), shows only the orientation matching the breakpoint,
and drops a stray portrait image that appears before the first inline landscape
(the leftover 4:5 duplicate of the hero).

**Still to do (optional CMS hygiene):** the Sanity documents themselves *still
contain* the redundant blocks — the renderer just hides/drops them. To keep the
studio clean so editors aren't confused, open the post in the studio as an
Editor and delete:
- the stray 4:5 portrait duplicate of the hero head illustration, and
- (optionally) reconcile the 4:5 mobile variants so each illustration is one
  clearly-labelled responsive pair.

Requires a Sanity Editor login: `cd studio && npx sanity login` (project
`ppq16wpu`, dataset `production`). Not required for the live fix to work.

## 2. Duplicate Vercel project

Two Vercel projects auto-build this repo on every push:

- **`sc-site`** (`prj_fysEZlTDVLQT5jwQTA0T95j7xSzv`) — **serves production
  `super-conscious.studio`.** This is the live one.
- **`scsite`** — duplicate. Builds every push and PR, serves nothing.

> **This section previously said the opposite** — that `scsite` served the
> domain and `sc-site` was "stale/leftover", and recommended deleting
> `sc-site`. Following that would have taken the site down.
>
> The mistake is easy to make and worth understanding: **both projects build
> the same repo, so their build hashes match.** Comparing hashes between
> `scsite.vercel.app` and the live domain proves nothing — it is true whichever
> project serves the domain. Corrected 2026-08-19 by reading domain ownership
> from the Vercel API rather than inferring it from build output.

To remove the duplicate: delete or unlink **`scsite`**, in team
`team_4nMx1xtOea3zc7p9JyFAjzNW`. Verify domain ownership from the API first,
not from a build hash.

## 3. CSP is report-only, and there is no reporting

`vercel.json` serves `Content-Security-Policy-Report-Only`. The intent was to
run it for a week and then enforce. **Do not flip it yet, and understand why
before you do.**

The policy has **no `report-uri` and no `report-to`**, so nothing has been
collected anywhere. "It has been report-only for a week with no problems" is
not evidence — there was never anywhere for a violation to be reported to.
Enforcing on that basis would be flipping blind.

Measured by hand on 2026-08-19, across `/`, `/work/talos` and `/contact`, the
complete set of origins the site contacts is:

    app.cal.com              fonts.googleapis.com     fonts.gstatic.com
    ppq16wpu.api.sanity.io   super-conscious.studio   www.google-analytics.com
    www.googletagmanager.com

All seven are in the policy, and opening the Cal.com booking modal — the most
involved third party — loaded its iframe with zero violations. So the policy
is *probably* complete. But that is three pages out of ninety-six, and it does
not exercise the gated deck routes or a real form submission.

Two caveats worth weighing against the upside:

1. One `connect-src` violation against `www.google-analytics.com` was observed
   once during rapid probing and could not be reproduced — including by
   fetching that exact origin directly. Unexplained, not dismissed.
2. `script-src` already includes `'unsafe-inline'` and `'unsafe-eval'`, which
   is most of what a CSP is for. Enforcing buys less than it looks like, while
   risking a site-wide break.

Recommended: add `report-to` with an endpoint, let real traffic populate it,
then enforce on evidence. Enforcing today is a large blast radius bought with
a hand-sampled three pages.

## 4. Stale branch — resolved

`feat/cal-embed-tracking` (3 commits, 2026-06-08) was checked on 2026-08-19
and is **fully superseded**; it can be deleted.

- alt text on thought post images — already on `main` via PR #70 (`29abf71`).
  The branch's three extra images are the duplicates PR #92 deliberately
  removed, so cherry-picking it would reintroduce them.
- OpenText removed from the sitemap — already on `main`.
- Cal.com embed and booking tracking — `main` has booking on both `/contact`
  and `/lp/*`, and the double-count was fixed separately in PR #108.

`feat/deck-gate-parked` stays. It is complete and tested, parked deliberately,
and its commit message records the one known gap if it is ever resumed.

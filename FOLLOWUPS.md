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

Two Vercel projects auto-build this repo on every push to `main`:
- **`scsite`** — serves production `super-conscious.studio` (verified: live
  build hash matches `scsite.vercel.app`).
- **`sc-site`** — stale/leftover; not serving the live domain.

`sc-site` wastes build minutes and is a source of confusion. Consider
deleting or unlinking it from the repo. **Confirm `scsite` still owns the
domain before removing anything.**

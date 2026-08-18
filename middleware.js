/**
 * Blocks the gated sales-deck chunks at the edge.
 *
 * The previous gate compared a password inside a React component, which could
 * never work: the deck code is a separate static chunk that Vercel's CDN served
 * to anyone who asked, password or not. The full rate card — hourly rates and
 * retainer bands — was anonymously downloadable.
 *
 * The protected resource is therefore the CHUNK, not the route. The route still
 * renders the gate UI (it contains no pricing), but the bundle carrying the
 * numbers is only served to a request holding a valid signed cookie.
 */

import { next } from '@vercel/functions'
import { DECK_COOKIE, readCookie, verifyToken } from './src/lib/deckAuth.js'

export const config = {
  matcher: ['/assets/deck/:path*'],
}

export default async function middleware(request) {
  const secret = process.env.DECK_SECRET

  // Fail CLOSED. A missing secret is a misconfiguration, and the safe response
  // to "I cannot verify" is to refuse — the failure mode we are fixing is
  // precisely one that served the file when it could not verify anything.
  if (!secret) {
    return new Response('Deck access is not configured.', {
      status: 503,
      headers: { 'cache-control': 'no-store' },
    })
  }

  const token = readCookie(request.headers.get('cookie'), DECK_COOKIE)
  if (await verifyToken(token, secret)) {
    return next()
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  })
}

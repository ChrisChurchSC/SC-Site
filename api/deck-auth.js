/**
 * Issues and reports the gated-deck session.
 *
 *   GET  -> { unlocked: boolean }   so the UI can restore a session
 *   POST -> { password }            sets an httpOnly signed cookie on success
 *
 * The password is never sent to the browser and never appears in the bundle.
 */

import { DECK_COOKIE, DECK_TTL_MS, issueToken, readCookie, verifyToken } from '../src/lib/deckAuth.js'

export default async function handler(req, res) {
  const secret = process.env.DECK_SECRET
  const password = process.env.DECK_PASSWORD

  if (!secret || !password) {
    return res.status(503).json({ error: 'Deck access is not configured.' })
  }

  if (req.method === 'GET') {
    const token = readCookie(req.headers.cookie, DECK_COOKIE)
    return res.status(200).json({ unlocked: await verifyToken(token, secret) })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const supplied = String(body.password ?? '')

  // Length-independent compare so a wrong guess costs the same either way.
  let diff = supplied.length === password.length ? 0 : 1
  for (let i = 0; i < Math.max(supplied.length, password.length); i++) {
    diff |= (supplied.charCodeAt(i) || 0) ^ (password.charCodeAt(i) || 0)
  }
  if (diff !== 0) {
    // Blunt the obvious online guessing attack without needing a store.
    await new Promise((r) => setTimeout(r, 400))
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  const token = await issueToken(secret)
  res.setHeader(
    'Set-Cookie',
    `${DECK_COOKIE}=${token}; Path=/; Max-Age=${Math.floor(DECK_TTL_MS / 1000)}; HttpOnly; Secure; SameSite=Lax`,
  )
  return res.status(200).json({ unlocked: true })
}

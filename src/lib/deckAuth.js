/**
 * Shared cookie contract between the edge middleware (which enforces) and the
 * auth endpoint (which issues). Both must agree byte-for-byte, so the format
 * lives here rather than being written twice.
 *
 * The token is `<expiresAtMs>.<hmacSha256Hex>`. There is no session store —
 * the signature IS the proof, so this works on the edge with no I/O.
 */

export const DECK_COOKIE = 'sc_deck'
export const DECK_TTL_MS = 1000 * 60 * 60 * 24 * 14 // 14 days

const enc = new TextEncoder()

async function sign(payload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function issueToken(secret, ttlMs = DECK_TTL_MS) {
  const expiresAt = String(Date.now() + ttlMs)
  return `${expiresAt}.${await sign(expiresAt, secret)}`
}

/** Constant-time-ish compare; avoids leaking position of first difference. */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function verifyToken(token, secret) {
  if (!token || !secret) return false
  const [expiresAt, sig] = String(token).split('.')
  if (!expiresAt || !sig) return false
  if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) < Date.now()) return false
  return safeEqual(sig, await sign(expiresAt, secret))
}

export const readCookie = (header, name) =>
  (header || '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1) || null

/**
 * Contract tests for the contact endpoint.
 *
 * The bug these exist to prevent: the handler returned 200 unconditionally.
 * Its only failure branch — `if (errors.length && !RESEND_KEY && !ATTIO_KEY)` —
 * was unreachable, because errors are only ever pushed from inside blocks
 * guarded by those same keys. On top of that, the Resend call awaited a fetch
 * whose status it never inspected, so a rotated key produced a silent success.
 * The prospect saw "Message sent", the lead reached nobody, and GA4 recorded a
 * conversion.
 *
 *   node --test tests/api/
 */

import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import handler from '../../api/contact.js'

const VALID = { name: 'Ada Lovelace', email: 'ada@example.com', company: 'Analytical', message: 'Hello' }

/** Minimal express-ish res double. */
function mockRes() {
  return {
    statusCode: null,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this },
    json(payload) { this.body = payload; return this },
    setHeader(k, v) { this.headers[k] = v },
  }
}

const call = async (body = VALID, method = 'POST') => {
  const res = mockRes()
  await handler({ method, body }, res)
  return res
}

let sentBodies = []
const realFetch = globalThis.fetch
const env = { ...process.env }

/** Route each upstream to a scripted outcome so no network is touched. */
function stubFetch({ attio = 'ok', resend = 'ok' } = {}) {
  sentBodies = []
  globalThis.fetch = async (url, init) => {
    const target = String(url).includes('attio') ? attio : resend
    sentBodies.push({ url: String(url), body: init?.body ? JSON.parse(init.body) : null })
    if (target === 'ok') {
      return { ok: true, status: 200, json: async () => ({ data: { id: { record_id: 'rec_1' } } }), text: async () => '' }
    }
    const status = target === 'unauthorized' ? 401 : 500
    return { ok: false, status, json: async () => ({}), text: async () => `simulated ${status}` }
  }
}

beforeEach(() => {
  process.env.ATTIO_API_KEY = 'attio-key'
  process.env.RESEND_API_KEY = 'resend-key'
  process.env.RESEND_FROM_EMAIL = 'hello@super-conscious.studio'
})

afterEach(() => {
  globalThis.fetch = realFetch
  process.env = { ...env }
})

describe('contact endpoint delivery contract', () => {
  it('rejects a non-POST', async () => {
    assert.equal((await call(VALID, 'GET')).statusCode, 405)
  })

  it('rejects missing required fields', async () => {
    stubFetch()
    assert.equal((await call({ name: '', email: '', message: '' })).statusCode, 400)
  })

  it('succeeds when both channels succeed', async () => {
    stubFetch({ attio: 'ok', resend: 'ok' })
    const res = await call()
    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, { ok: true })
  })

  it('FAILS LOUDLY when every channel fails', async () => {
    stubFetch({ attio: 'error', resend: 'unauthorized' })
    const res = await call()
    assert.equal(res.statusCode, 502, 'must not report success when the lead reached nobody')
    assert.ok(res.body.error)
  })

  it('fails when Resend rejects the key and Attio is not configured', async () => {
    delete process.env.ATTIO_API_KEY
    stubFetch({ resend: 'unauthorized' })
    assert.equal((await call()).statusCode, 502)
  })

  it('still succeeds if the CRM records it but email fails', async () => {
    stubFetch({ attio: 'ok', resend: 'error' })
    assert.equal((await call()).statusCode, 200)
  })

  it('still succeeds if email sends but the CRM fails', async () => {
    stubFetch({ attio: 'error', resend: 'ok' })
    assert.equal((await call()).statusCode, 200)
  })

  it('refuses when no delivery channel is configured at all', async () => {
    delete process.env.ATTIO_API_KEY
    delete process.env.RESEND_API_KEY
    stubFetch()
    const res = await call()
    assert.equal(res.statusCode, 503, 'a lead with nowhere to go is not a success')
  })

  it('treats an unset sender as failure rather than using the sandbox address', async () => {
    delete process.env.ATTIO_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    stubFetch({ resend: 'ok' })
    const res = await call()
    assert.equal(res.statusCode, 502)
    assert.equal(sentBodies.length, 0, 'must not send from onboarding@resend.dev')
  })

  it('never leaks upstream vendor errors to the browser', async () => {
    stubFetch({ attio: 'error', resend: 'error' })
    const res = await call()
    assert.ok(!JSON.stringify(res.body).includes('simulated'), 'upstream text must not reach the client')
  })

  it('escapes submitted HTML in the notification email', async () => {
    delete process.env.ATTIO_API_KEY
    stubFetch({ resend: 'ok' })
    await call({ ...VALID, message: '<img src=x onerror=alert(1)>', name: 'A <b>B</b>' })
    const email = sentBodies.find((s) => s.url.includes('resend'))
    assert.ok(email, 'email was attempted')
    assert.ok(!email.body.html.includes('<img src=x'), 'raw markup must not reach the inbox')
    assert.ok(email.body.html.includes('&lt;img'), 'markup should be escaped')
  })
})

/**
 * Contract tests for the single lead-submission path.
 *
 * The failure being guarded against is not "the network broke" — it is
 * "the UI said Message sent when nothing was stored". For ten weeks the site
 * reported success on every submission while the leads reached nobody, because
 * the caller treated a resolved fetch as a delivered lead. These assertions
 * exist so that a request can never again be mistaken for a receipt.
 *
 *   node --test tests/lib/submitLead.test.mjs
 */

import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import { FORMSPREE_ENDPOINT, submitLead } from '../../src/lib/submitLead.js'

const realFetch = globalThis.fetch
let calls = []

/** A form element stand-in — submitLead only needs FormData to accept it. */
class FakeForm {
  constructor(fields = { name: 'Ada', email: 'ada@example.com', message: 'Hi' }) {
    this.fields = fields
  }
}
globalThis.FormData = class {
  constructor(form) { this.entries = Object.entries(form?.fields ?? {}) }
}

const stub = (impl) => {
  calls = []
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init })
    return impl()
  }
}

afterEach(() => { globalThis.fetch = realFetch })

describe('submitLead', () => {
  it('posts to the configured Formspree form', async () => {
    stub(() => ({ ok: true, status: 200, json: async () => ({}) }))
    await submitLead(new FakeForm())
    assert.equal(calls[0].url, FORMSPREE_ENDPOINT)
    assert.equal(calls[0].init.method, 'POST')
  })

  it('asks for JSON, so the reply is interpretable rather than a redirect', async () => {
    stub(() => ({ ok: true, status: 200, json: async () => ({}) }))
    await submitLead(new FakeForm())
    assert.equal(calls[0].init.headers.Accept, 'application/json')
  })

  it('reports success only on a 2xx', async () => {
    stub(() => ({ ok: true, status: 200, json: async () => ({}) }))
    assert.deepEqual(await submitLead(new FakeForm()), { ok: true })
  })

  it('does NOT report success on a 4xx', async () => {
    stub(() => ({ ok: false, status: 422, json: async () => ({ errors: [{ message: 'Email is invalid' }] }) }))
    const r = await submitLead(new FakeForm())
    assert.equal(r.ok, false)
    assert.equal(r.error, 'Email is invalid', 'surfaces the real reason to the prospect')
  })

  it('does NOT report success on a 5xx', async () => {
    stub(() => ({ ok: false, status: 500, json: async () => { throw new Error('not json') } }))
    const r = await submitLead(new FakeForm())
    assert.equal(r.ok, false)
    assert.ok(r.error)
  })

  it('does NOT report success when the network fails, and does not throw', async () => {
    stub(() => { throw new TypeError('Failed to fetch') })
    const r = await submitLead(new FakeForm())
    assert.equal(r.ok, false, 'an unreachable server is not a delivered lead')
    assert.match(r.error, /try again/i)
  })

  it('never returns ok:true without an explicit 2xx', async () => {
    for (const status of [301, 400, 401, 403, 404, 429, 500, 502, 503]) {
      stub(() => ({ ok: false, status, json: async () => ({}) }))
      const r = await submitLead(new FakeForm())
      assert.equal(r.ok, false, `status ${status} must not read as success`)
    }
  })
})

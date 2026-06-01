const ATTIO_BASE = 'https://api.attio.com/v2'

async function attio(path, method, body, key, params) {
  const url = new URL(`${ATTIO_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Attio ${method} ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

export default async function handler(req, res) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const KIT_KEY = process.env.KIT_API_SECRET
  const ATTIO_KEY = process.env.ATTIO_API_KEY

  if (!KIT_KEY || !ATTIO_KEY) {
    return res.status(500).json({ error: 'Missing env vars' })
  }

  // Pull subscribers created in the last 25 hours (slight overlap to avoid gaps)
  const since = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()

  const kitRes = await fetch(
    `https://api.kit.com/v4/subscribers?sort_field=created_at&sort_order=desc&created_after=${encodeURIComponent(since)}&per_page=100`,
    { headers: { Authorization: `Bearer ${KIT_KEY}`, Accept: 'application/json' } }
  )

  if (!kitRes.ok) {
    const text = await kitRes.text()
    return res.status(500).json({ error: `Kit API error: ${kitRes.status}`, detail: text })
  }

  const kitData = await kitRes.json()
  const subscribers = kitData.subscribers ?? []

  const results = []

  for (const sub of subscribers) {
    try {
      const nameParts = (sub.first_name || '').trim().split(/\s+/).filter(Boolean)
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      const fullName = [firstName, lastName].filter(Boolean).join(' ')

      const values = {
        email_addresses: [{ email_address: sub.email_address }],
      }
      if (fullName) {
        values.name = [{ first_name: firstName, last_name: lastName, full_name: fullName }]
      }

      await attio('/objects/people/records', 'PUT', { data: { values } }, ATTIO_KEY, {
        matching_attribute: 'email_addresses',
      })

      results.push({ email: sub.email_address, status: 'ok' })
    } catch (err) {
      results.push({ email: sub.email_address, status: 'error', error: err.message })
    }
  }

  return res.status(200).json({ ok: true, synced: results.filter(r => r.status === 'ok').length, total: subscribers.length, since, results })
}

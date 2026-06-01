const ATTIO_BASE = 'https://api.attio.com/v2'

async function attio(path, method, body, key, params) {
  const url = new URL(`${ATTIO_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Attio ${method} ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

async function notify(name, email, company, message, key, from) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from || 'Super Conscious <onboarding@resend.dev>',
      to: ['chris@super-conscious.studio'],
      reply_to: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
      html: [
        `<p><strong>Name:</strong> ${name}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>`,
        company ? `<p><strong>Company:</strong> ${company}</p>` : '',
        `<p><strong>Project:</strong></p>`,
        `<p style="white-space:pre-wrap">${message}</p>`,
      ].join(''),
    }),
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, company, message } = req.body || {}
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const ATTIO_KEY = process.env.ATTIO_API_KEY
  const RESEND_KEY = process.env.RESEND_API_KEY
  const RESEND_FROM = process.env.RESEND_FROM_EMAIL

  const errors = []

  if (ATTIO_KEY) {
    try {
      const parts = name.trim().split(/\s+/)
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || ''

      // Upsert person by email
      const personRes = await attio('/objects/people/records', 'PUT', {
        data: {
          values: {
            name: [{ first_name: firstName, last_name: lastName, full_name: name.trim() }],
            email_addresses: [{ email_address: email.trim() }],
          },
        },
      }, ATTIO_KEY, { matching_attribute: 'email_addresses' })

      const personId = personRes?.data?.id?.record_id

      // Create note on person
      if (personId) {
        const noteLines = [
          'Inbound inquiry via super-conscious.studio',
          '',
          company ? `Company: ${company}` : null,
          '',
          'Project:',
          message.trim(),
        ].filter(l => l !== null).join('\n')

        await attio('/notes', 'POST', {
          data: {
            parent_object: 'people',
            parent_record_id: personId,
            title: `Website inquiry${company ? ` — ${company}` : ''}`,
            format: 'plaintext',
            content: noteLines,
          },
        }, ATTIO_KEY)
      }

      // If company provided: create company, add to Business Development list, link to person
      if (company?.trim() && personId) {
        try {
          const companyRes = await attio('/objects/companies/records', 'POST', {
            data: { values: { name: [company.trim()] } },
          }, ATTIO_KEY)

          const companyId = companyRes?.data?.id?.record_id

          if (companyId) {
            // Add to Business Development list at Intro stage
            await attio('/lists/sales/entries', 'POST', {
              data: {
                parent_object: 'companies',
                parent_record_id: companyId,
                entry_values: {
                  stage: 'Intro',
                  main_point_of_contact: [{ target_object: 'people', target_record_id: personId }],
                },
              },
            }, ATTIO_KEY)

            // Link person to company
            await attio(`/objects/people/records/${personId}`, 'PATCH', {
              data: { values: { company: [{ target_object: 'companies', target_record_id: companyId }] } },
            }, ATTIO_KEY)
          }
        } catch (err) {
          console.error('[contact] Attio company/list error:', err.message)
          errors.push(`Attio company/list: ${err.message}`)
        }
      }
    } catch (err) {
      console.error('[contact] Attio error:', err.message)
      errors.push(`Attio: ${err.message}`)
    }
  }

  if (RESEND_KEY) {
    try {
      await notify(name, email, company, message, RESEND_KEY, RESEND_FROM)
    } catch (err) {
      console.error('[contact] Resend error:', err.message)
      errors.push(`Resend: ${err.message}`)
    }
  }

  if (errors.length && !RESEND_KEY && !ATTIO_KEY) {
    return res.status(500).json({ error: 'Something went wrong' })
  }

  return res.status(200).json({ ok: true, errors: errors.length ? errors : undefined })
}

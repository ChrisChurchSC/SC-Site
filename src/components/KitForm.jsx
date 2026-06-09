import { useEffect, useRef, useState } from 'react'

const DATA_OPTIONS = '{"settings":{"after_subscribe":{"action":"message","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":""},"analytics":{"google":null,"fathom":null,"facebook":null,"segment":null,"pinterest":null,"sparkloop":null,"googletagmanager":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://kit.com/features/forms?utm_campaign=poweredby&utm_content=form&utm_medium=referral&utm_source=dynamic"},"recaptcha":{"enabled":false},"return_visitor":{"action":"show","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}'

const FORM_INNER = `<div data-style="clean"><ul class="formkit-alert formkit-alert-error" data-element="errors" data-group="alert"></ul><div data-element="fields" data-stacked="false" class="seva-fields formkit-fields"><div class="formkit-field"><input class="formkit-input" name="email_address" aria-label="Email Address" placeholder="Email Address" required="" type="email"></div><button data-element="submit" class="formkit-submit formkit-submit"><div class="formkit-spinner"><div></div><div></div><div></div></div><span>Subscribe</span></button></div></div>`

let ckScriptLoaded = false

// Patch fetch once so we can detect Kit subscribe responses globally.
const kitSubscribeListeners = new Set()
if (typeof window !== 'undefined' && !window.__kitFetchPatched) {
  window.__kitFetchPatched = true
  const origFetch = window.fetch
  window.fetch = async function (input, init) {
    const res = await origFetch.apply(this, arguments)
    const url = typeof input === 'string' ? input : input?.url
    if (url && /\/forms\/\d+\/subscriptions/.test(url) && res.ok) {
      const m = url.match(/\/forms\/(\d+)\/subscriptions/)
      const formId = m?.[1]
      kitSubscribeListeners.forEach(cb => cb(formId))
    }
    return res
  }
}

export default function KitForm({ uid = 'f036f942c2', formId = '9383718' }) {
  const formRef = useRef(null)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (ckScriptLoaded) return
    ckScriptLoaded = true
    const script = document.createElement('script')
    script.src = 'https://f.convertkit.com/ckjs/ck.5.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    const el = formRef.current
    if (!el) return

    const showToast = () => {
      setToast(true)
      setTimeout(() => setToast(false), 4000)
    }

    const onKitSubscribe = (id) => {
      if (id !== formId) return
      showToast()
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'newsletter_signup' })
    }
    kitSubscribeListeners.add(onKitSubscribe)
    return () => kitSubscribeListeners.delete(onKitSubscribe)
  }, [formId])

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div className="kit-toast">
          Sent. We'll be in touch.
        </div>
      )}
      <form
        ref={formRef}
        action={`https://app.kit.com/forms/${formId}/subscriptions`}
        className="seva-form formkit-form"
        method="post"
        data-sv-form={formId}
        data-uid={uid}
        data-format="inline"
        data-version="5"
        data-options={DATA_OPTIONS}
        // eslint-disable-next-line react/no-unknown-property
        min-width="400 500 600 700 800"
        dangerouslySetInnerHTML={{ __html: FORM_INNER }}
      />
    </div>
  )
}

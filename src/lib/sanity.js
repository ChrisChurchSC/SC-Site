import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'ppq16wpu',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export function imageUrl(source) {
  if (!source?.asset?._ref) return null
  const ref = source.asset._ref
  const [, id, dimensions, format] = ref.split('-')
  return `https://cdn.sanity.io/images/ppq16wpu/production/${id}-${dimensions}.${format}`
}

import { useMeta } from '../hooks/useMeta'

export default function Work() {
  useMeta({
    title: 'Selected Work — Super Conscious',
    description: 'Case studies from Super Conscious — brand identity, campaigns, content production, and product design for founders and marketing teams.',
  })
  return <main style={{ paddingTop: 80, minHeight: '100vh' }} />
}

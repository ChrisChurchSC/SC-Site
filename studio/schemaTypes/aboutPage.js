import { defineType, defineField, defineArrayMember } from 'sanity'

const embeddedPoint = defineArrayMember({
  name: 'embeddedPoint',
  title: 'Embedded Point',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'heading', subtitle: 'body' } },
})

const serviceItem = defineArrayMember({
  name: 'serviceItem',
  title: 'Service',
  type: 'object',
  fields: [
    defineField({ name: 'tag', title: 'Tag', type: 'string', description: 'Eg. "What to make"' }),
    defineField({ name: 'name', title: 'Name', type: 'string', description: 'Eg. "Define"' }),
    defineField({ name: 'deliverables', title: 'Deliverables', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'name', subtitle: 'tag' } },
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page (Capabilities)',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headerLabel', title: 'Header Label', type: 'string', description: 'Bracketed label above the headline.' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({ name: 'embeddedPoints', title: 'Embedded Partnership Points', type: 'array', of: [embeddedPoint] }),
    defineField({ name: 'services', title: 'What We Do', type: 'array', of: [serviceItem] }),
    defineField({ name: 'pricingLabel', title: 'Pricing — Label', type: 'string' }),
    defineField({ name: 'pricingSub', title: 'Pricing — Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'clientsLabel', title: 'Clients — Label', type: 'string', initialValue: 'Selected Clients' }),
    defineField({ name: 'clients', title: 'Clients', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { prepare: () => ({ title: 'About / Capabilities Page' }) },
})

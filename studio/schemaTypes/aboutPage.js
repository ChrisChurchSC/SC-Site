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

// The page this drives is Services, at /services. The type name stays
// `aboutPage` and the doc id stays `about-page`: renaming a Sanity type does
// not migrate the documents already stored under the old name, so a rename
// here would strand every field the client has filled in. Only the Studio
// title changes, since that is the part an editor actually reads.
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Services Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headerLabel', title: 'Header Label', type: 'string', description: 'Bracketed label above the headline.' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({ name: 'embeddedPoints', title: 'Embedded Partnership Points', type: 'array', of: [embeddedPoint] }),
    defineField({ name: 'servicesIntro', title: 'What We Do — Intro', type: 'text', rows: 2 }),
    defineField({ name: 'services', title: 'What We Do', type: 'array', of: [serviceItem] }),
    defineField({ name: 'rolesLabel', title: 'Roles — Label', type: 'string', initialValue: 'Roles' }),
    defineField({ name: 'rolesIntro', title: 'Roles — Intro', type: 'text', rows: 2 }),
    defineField({ name: 'roles', title: 'Roles', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'pricingLabel', title: 'Pricing — Label', type: 'string' }),
    defineField({ name: 'pricingSub', title: 'Pricing — Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'clientsLabel', title: 'Clients — Label', type: 'string', initialValue: 'Selected Clients' }),
    defineField({ name: 'clients', title: 'Clients', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { prepare: () => ({ title: 'About / Capabilities Page' }) },
})

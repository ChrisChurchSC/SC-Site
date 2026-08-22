import { defineType, defineField, defineArrayMember } from 'sanity'

const serviceItem = defineArrayMember({
  name: 'serviceItem',
  title: 'Service',
  type: 'object',
  fields: [
    defineField({ name: 'tag', title: 'Tag', type: 'string', description: 'Eg. "The foundation"' }),
    defineField({ name: 'name', title: 'Name', type: 'string', description: 'Eg. "Build"' }),
    defineField({ name: 'deliverables', title: 'Deliverables', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'name', subtitle: 'tag' } },
})

// The page this drives is Services, at /services. The type name stays
// `aboutPage` and the doc id stays `about-page`: renaming a Sanity type does
// not migrate the documents already stored under the old name, so a rename
// here would strand every field the client has filled in. Only the Studio
// title changes, since that is the part an editor actually reads.
//
// This document no longer holds the page's positioning copy. The header, the
// three-up, the "What We Do" intro and the clients list moved into code with
// the August 2026 rewrite — that copy is the studio's argument for itself,
// it only works as a whole, and a half-edited positioning statement is worse
// than none. Their fields were removed from here rather than left in place:
// a field an editor can still fill in, that no longer reaches the page, is a
// trap. Removing a field from a schema does not delete what is stored, so
// every old value is still in the dataset if this needs reverting.
//
// KNOWN DRIFT, deliberately not fixed here: the live document also carries
// `faqs` (7 entries) and `faqLabel`, which the page renders but this schema
// never declared — so they are invisible in the Studio and cannot be edited.
// `roles` has the same problem in reverse: declared as an array of strings,
// stored as objects with `name` and `description`. Both want a content
// migration and a Studio test rather than a blind schema edit, so they are
// reported rather than changed.
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Services Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'services', title: 'What We Do', type: 'array', of: [serviceItem] }),
    defineField({ name: 'rolesLabel', title: 'Roles — Label', type: 'string', initialValue: 'Roles' }),
    defineField({ name: 'rolesIntro', title: 'Roles — Intro', type: 'text', rows: 2 }),
    defineField({ name: 'roles', title: 'Roles', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'pricingLabel', title: 'Pricing — Label', type: 'string' }),
    defineField({ name: 'pricingSub', title: 'Pricing — Subtitle', type: 'text', rows: 2 }),
  ],
  preview: { prepare: () => ({ title: 'Services Page' }) },
})

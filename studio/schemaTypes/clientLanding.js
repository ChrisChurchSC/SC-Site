import { defineType, defineField } from 'sanity'

export const clientLanding = defineType({
  name: 'clientLanding',
  title: 'Client Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Internal name',
      type: 'string',
      description: 'For the studio list only, e.g. "Joon Pitch — May 2026"',
      validation: R => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description: 'Lives at /clients/<slug>. Use the client name, lowercase, no spaces.',
      options: { source: 'name' },
      validation: R => R.required(),
    }),
    defineField({
      name: 'password',
      title: 'Password',
      type: 'string',
      description: 'Visitors must enter this to view the page. Speed bump only — readable in JS by anyone who fetches Sanity.',
      validation: R => R.required(),
    }),
    defineField({
      name: 'clientName',
      title: 'Client name (display)',
      type: 'string',
      description: 'Shown in the hero, e.g. "Joon".',
      validation: R => R.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Hero line below the client name.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro paragraph',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'caseStudies',
      title: 'Featured case studies',
      type: 'array',
      description: 'Drag to reorder. Each links to the existing /work/<slug> page.',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA text',
      type: 'string',
      description: 'Button label at the bottom of the page (e.g. "Get in touch").',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA link',
      type: 'string',
      description: 'mailto:..., https://..., or a path like /contact.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/clients/${subtitle}` : '' }),
  },
})

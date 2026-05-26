import { defineType, defineField, defineArrayMember } from 'sanity'

const imageFullSection = defineArrayMember({
  name: 'imageFullSection',
  title: 'Full-Width Image / Video',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Desktop Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoFile', title: 'Desktop Video (overrides image)', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'mobileImage', title: 'Mobile Image (optional)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'mobileVideoFile', title: 'Mobile Video (overrides mobile image)', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'ratio', type: 'string', options: { list: ['16/9', '4/3', '1/1', '9/16', '4/5'] }, initialValue: '16/9' }),
  ],
  preview: { select: { media: 'image' }, prepare: () => ({ title: 'Full-Width Image / Video' }) },
})

const textSection = defineArrayMember({
  name: 'textSection',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'text', rows: 4 }),
  ],
  preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Text Block' }) },
})

const gridImage = {
  name: 'gridImage',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Desktop Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoFile', title: 'Desktop Video (overrides image)', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'mobileImage', title: 'Mobile Image (optional)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'mobileVideoFile', title: 'Mobile Video (overrides mobile image)', type: 'file', options: { accept: 'video/*' } }),
    defineField({ name: 'cols', type: 'number', description: 'Column span out of 12', initialValue: 6 }),
    defineField({ name: 'ratio', type: 'string', options: { list: ['16/9', '4/3', '1/1', '9/16', '4/5'] }, initialValue: '16/9' }),
  ],
}

const imageGridSection = defineArrayMember({
  name: 'imageGridSection',
  title: 'Image Grid',
  type: 'object',
  fields: [
    defineField({ name: 'images', type: 'array', of: [{ type: 'object', fields: gridImage.fields }] }),
  ],
  preview: { prepare: () => ({ title: 'Image Grid' }) },
})

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    // List fields
    defineField({ name: 'name', title: 'Name', type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: R => R.required() }),
    defineField({ name: 'type', title: 'Type', type: 'string', description: 'e.g. Brand, Web, Campaign, Product' }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'order', title: 'Order', type: 'number', description: 'Sort order (lower = first)' }),
    defineField({ name: 'published', title: 'Published', type: 'boolean', initialValue: true }),
    defineField({ name: 'comingSoon', title: 'Coming Soon', type: 'boolean', description: 'Show in lists with a badge; disable link until ready.', initialValue: false }),
    defineField({ name: 'password', title: 'Password', type: 'string', description: 'If set, the case study is gated behind this password.' }),
    defineField({
      name: 'thumbnailImages',
      title: 'Thumbnail Images',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'Cycle on hover in the work drawer',
    }),
    defineField({
      name: 'thumbnailVideoFile',
      title: 'Thumbnail Video',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Autoplay video shown on client overview sub-project cards (overrides Thumbnail Images).',
    }),

    // Case study fields
    defineField({ name: 'descriptor', title: 'Descriptor', type: 'string', description: 'Short one-line about the client. Shown on the client overview page.' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 5 }),
    defineField({
      name: 'category',
      title: 'Pillar(s)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['brand', 'product', 'content'], layout: 'tags' },
      description: 'Which offering pillar(s) this project demonstrates. Used on the Capabilities deck.',
    }),
    defineField({ name: 'relationship', title: 'Client Relationship', type: 'text', rows: 8, description: 'Longer write-up about the working relationship — shown on the client overview page.' }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'category', type: 'string' }),
          defineField({ name: 'outcome', type: 'text', rows: 2 }),
        ],
        preview: { select: { title: 'category' } },
      }],
    }),
    defineField({
      name: 'sections',
      title: 'Case Study Sections',
      type: 'array',
      of: [imageFullSection, textSection, imageGridSection],
    }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'type' },
  },
})

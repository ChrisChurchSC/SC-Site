import { defineType, defineField, defineArrayMember } from 'sanity'

const paragraphBlock = defineArrayMember({
  name: 'paragraphBlock',
  title: 'Paragraph',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 4, validation: R => R.required() }),
  ],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: 'Paragraph', subtitle: title?.slice(0, 80) }) },
})

const headingBlock = defineArrayMember({
  name: 'headingBlock',
  title: 'Heading',
  type: 'object',
  fields: [
    defineField({ name: 'text', title: 'Text', type: 'string', validation: R => R.required() }),
  ],
  preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: 'Heading', subtitle: title }) },
})

const imageBlock = defineArrayMember({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: R => R.required() }),
    defineField({ name: 'alt', title: 'Alt', type: 'string' }),
  ],
  preview: { select: { media: 'image', title: 'alt' }, prepare: ({ media, title }) => ({ title: 'Image', subtitle: title, media }) },
})

export const thought = defineType({
  name: 'thought',
  title: 'Thought',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: R => R.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 2 }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'date', validation: R => R.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number', description: 'Sort order (lower = first)' }),
    defineField({ name: 'hero', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [paragraphBlock, headingBlock, imageBlock],
    }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Newest first', name: 'newestFirst', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'hero' } },
})

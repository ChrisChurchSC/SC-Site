import { defineType, defineField } from 'sanity'

export const openRole = defineType({
  name: 'openRole',
  title: 'Open Role',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: R => R.required() }),
    defineField({ name: 'type', title: 'Type', type: 'string', description: 'e.g. Internship, Full-time, Contract' }),
    defineField({ name: 'location', title: 'Location', type: 'string', description: 'e.g. Remote, Philadelphia, PA' }),
    defineField({ name: 'level', title: 'Level', type: 'string', description: 'e.g. Entry Level, Mid, Senior' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type' },
  },
})

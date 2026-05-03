import { defineType, defineField, defineArrayMember } from 'sanity'

export const homepageGrid = defineType({
  name: 'homepageGrid',
  title: 'Homepage Grid',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'gridBlock',
          title: 'Block',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: '001, 002, etc.' }),
            defineField({
              name: 'mediaType',
              title: 'Media Type',
              type: 'string',
              options: { list: ['none', 'image', 'video'] },
              initialValue: 'none',
            }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, hidden: ({ parent }) => parent?.mediaType !== 'image' }),
            defineField({ name: 'videoUrl', title: 'Video URL', type: 'string', description: 'CDN or /grid/ path', hidden: ({ parent }) => parent?.mediaType !== 'video' }),
            defineField({
              name: 'project',
              title: 'Project Link',
              type: 'reference',
              to: [{ type: 'project' }],
            }),
            defineField({ name: 'externalUrl', title: 'External URL', type: 'url', description: 'If set, overrides project link' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'mediaType' },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Homepage Grid' }) },
})

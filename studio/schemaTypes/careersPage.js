import { defineType, defineField, defineArrayMember } from 'sanity'

const realityRow = defineArrayMember({
  name: 'realityRow',
  title: 'Reality Row',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string' }),
    defineField({ name: 'value', title: 'Value', type: 'string' }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
})

const traitCard = defineArrayMember({
  name: 'traitCard',
  title: 'Trait Card',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'heading', subtitle: 'body' } },
})

const photoCaption = defineArrayMember({
  name: 'photoCaption',
  title: 'Photo Caption',
  type: 'object',
  fields: [
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
  preview: { select: { title: 'caption' } },
})

export const careersPage = defineType({
  name: 'careersPage',
  title: 'Careers Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'headerLabel', title: 'Header Label', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({ name: 'photos', title: 'Photo Captions', type: 'array', of: [photoCaption] }),
    defineField({ name: 'whatItsLikeLabel', title: 'What Its Like — Label', type: 'string', initialValue: "What It's Like" }),
    defineField({ name: 'whatItsLikeBody', title: 'What Its Like — Body', type: 'text', rows: 5 }),
    defineField({ name: 'realitiesLabel', title: 'Realities — Label', type: 'string', initialValue: 'The Realities' }),
    defineField({ name: 'realities', title: 'Realities', type: 'array', of: [realityRow] }),
    defineField({ name: 'traitsLabel', title: 'Traits — Label', type: 'string', initialValue: 'Who Fits Here' }),
    defineField({ name: 'traits', title: 'Traits', type: 'array', of: [traitCard] }),
    defineField({ name: 'openRolesLabel', title: 'Open Roles — Label', type: 'string', initialValue: 'Open Roles' }),
    defineField({ name: 'applyEmail', title: 'Apply Email', type: 'string', initialValue: 'contact@super-conscious.studio' }),
  ],
  preview: { prepare: () => ({ title: 'Careers Page' }) },
})

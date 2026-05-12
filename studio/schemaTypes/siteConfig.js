import { defineType, defineField } from 'sanity'

export const siteConfig = defineType({
  name: 'siteConfig',
  title: 'Site Config',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'reelVideoUrl',
      title: 'Reel Video URL',
      type: 'url',
      description: 'Sanity CDN URL for the homepage reel. Re-upload via scripts/uploadReel.mjs and paste the new URL here.',
    }),
    defineField({
      name: 'homeHeroTitle',
      title: 'Home — Hero Headline',
      type: 'string',
      description: 'Top-right wordmark line on the homepage.',
    }),
    defineField({
      name: 'homeHeroTagline',
      title: 'Home — Hero Tagline',
      type: 'string',
      description: 'Sits under the hero block label on the first row.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site Config' }) },
})

import { defineType, defineField, defineArrayMember } from 'sanity'

// Unnamed on purpose. The seven entries already in the document were written
// without a named type and carry `_type: 'object'`, which is what an inline
// object member serialises to — naming this would leave every existing entry
// showing as an unknown type in the Studio.
const faqItem = defineArrayMember({
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
})

// ORPHANED as of the FAQ cut. Nothing on the site reads this document any
// more — /services was its only consumer, and the FAQ was the last field it
// still rendered. The type is left registered rather than deleted because
// removing a document type is a call for whoever owns the content, not a
// side effect of cutting a page section; but be aware that editing anything
// here now changes nothing on the site.
//
// Everything ever stored on about-page is still in the dataset, including
// the seven FAQ entries — no field removed during the August 2026 rewrite
// deleted its data. If a FAQ is wanted on another page, the content is
// there to query.
//
// The page this drives is Services, at /services. The type name stays
// `aboutPage` and the doc id stays `about-page`: renaming a Sanity type does
// not migrate the documents already stored under the old name, so a rename
// here would strand every field the client has filled in. Only the Studio
// title changes, since that is the part an editor actually reads.
//
// This document no longer holds the page's positioning copy or its offer. The
// header, the three-up, the clients list, and the Build/Grow services array
// all moved into code across the August 2026 rewrite, and the closing call to
// action followed them. The copy went because it is the studio's argument for
// itself and only works as a whole; the prices went because a stale price is
// worse than a stale sentence. Their fields were removed from here rather
// than left in place:
// a field an editor can still fill in, that no longer reaches the page, is a
// trap. Removing a field from a schema does not delete what is stored, so
// every old value is still in the dataset if this needs reverting.
//
// The FAQ is now all this document holds, and it is declared here for the
// first time: the seven entries were live on the page while the schema never
// mentioned them, so nobody could edit them in the Studio. Declaring a field
// that already has data does not touch the data.
//
// The other half of that drift is gone rather than fixed — `roles` was
// declared as an array of strings but stored as objects with `name` and
// `description`, and the discipline list has since moved into code.
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Services Page',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({ name: 'faqLabel', title: 'FAQ — Label', type: 'string', initialValue: 'FAQ' }),
    defineField({ name: 'faqs', title: 'FAQ', type: 'array', of: [faqItem] }),
  ],
  preview: { prepare: () => ({ title: 'Services Page' }) },
})

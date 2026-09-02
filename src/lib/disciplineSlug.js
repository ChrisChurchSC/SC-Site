/* The URL segment for a discipline, derived from its name so a rename on
   /services renames the route too. "Film & photo" → film-photo,
   "3D & motion" → 3d-motion. Plain JS, not JSX, because the prerender script
   imports it from Node. */
export const disciplineSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

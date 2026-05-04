export const PROJECTS_QUERY = `*[_type == "project" && published == true] | order(order asc) {
  _id,
  "n": string(order),
  name,
  "slug": slug.current,
  type,
  year,
  "images": thumbnailImages[].asset->url
}`

export const CASE_STUDY_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  "n": string(order),
  name,
  "slug": slug.current,
  type,
  year,
  tagline,
  summary,
  services,
  outcomes,
  sections[] {
    _type,
    _key,
    // imageFullSection
    "src": coalesce(videoFile.asset->url, image.asset->url),
    ratio,
    // textSection
    heading,
    body,
    // imageGridSection
    images[] {
      "src": coalesce(videoFile.asset->url, image.asset->url),
      cols,
      ratio
    }
  }
}`

export const OPEN_ROLES_QUERY = `*[_type == "openRole" && active == true] | order(_createdAt asc) {
  _id,
  title,
  type,
  location,
  level,
  description
}`

export const CLIENT_OVERVIEW_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  tagline,
  summary,
  relationship,
  "subProjects": *[_type == "project" && string::startsWith(slug.current, $slug + "-")] {
    "slug": slug.current,
    "thumbnail": coalesce(thumbnailImages[0].asset->url, sections[_type == "imageFullSection"][0].image.asset->url)
  }
}`

export const HOMEPAGE_GRID_QUERY = `*[_type == "homepageGrid" && _id == "homepage-grid"][0] {
  blocks[] {
    _key,
    label,
    mediaType,
    "imageUrl": image.asset->url,
    videoUrl,
    "projectSlug": project->slug.current,
    "projectName": project->name,
    externalUrl
  }
}`

export const PROJECTS_QUERY = `*[_type == "project" && published == true] | order(order asc) {
  _id,
  "n": string(order),
  name,
  "slug": slug.current,
  type,
  year,
  descriptor,
  password,
  comingSoon,
  "subCount": count(*[_type == "project" && string::startsWith(slug.current, ^.slug.current + "-")]),
  "subProjects": *[_type == "project" && string::startsWith(slug.current, ^.slug.current + "-")] | order(order asc) {
    "slug": slug.current,
    name
  },
  "images": thumbnailImages[].asset->url
}`

export const COMING_SOON_QUERY = `*[_type == "project" && comingSoon == true].slug.current`

export const SITE_CONFIG_QUERY = `*[_type == "siteConfig" && _id == "site-config"][0] {
  reelVideoUrl,
  homeHeroTitle,
  homeHeroTagline
}`

export const THOUGHTS_INDEX_QUERY = `*[_type == "thought"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  order,
  "heroUrl": hero.asset->url
}`

export const THOUGHT_QUERY = `*[_type == "thought" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  order,
  "heroUrl": hero.asset->url,
  body[] {
    _type,
    _key,
    text,
    "imageUrl": image.asset->url,
    alt
  }
}`

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == "about-page"][0] {
  headerLabel,
  headline,
  intro,
  embeddedPoints[] { heading, body },
  servicesIntro,
  services[] { tag, name, deliverables },
  rolesLabel,
  rolesIntro,
  roles,
  faqLabel,
  faqs[] { question, answer },
  pricingLabel,
  pricingSub,
  clientsLabel,
  clients
}`

export const CAREERS_PAGE_QUERY = `*[_type == "careersPage" && _id == "careers-page"][0] {
  headerLabel,
  headline,
  intro,
  photos[] { caption, "imageUrl": image.asset->url, "videoUrl": videoFile.asset->url },
  whatItsLikeLabel,
  whatItsLikeBody,
  realitiesLabel,
  realities[] { label, value },
  traitsLabel,
  traits[] { heading, body },
  openRolesLabel,
  applyEmail,
  signupLabel,
  signupSub
}`

export const CASE_STUDY_QUERY = `*[_type == "project" && slug.current == $slug && published == true][0] {
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
  partner,
  client,
  partnerNote,
  sections[] {
    _type,
    _key,
    // imageFullSection
    "src": coalesce(videoFile.asset->url, image.asset->url),
    "mobileSrc": coalesce(mobileVideoFile.asset->url, mobileImage.asset->url),
    ratio,
    mobileRatio,
    // textSection
    heading,
    body,
    // imageGridSection
    images[] {
      "src": coalesce(videoFile.asset->url, image.asset->url),
      "mobileSrc": coalesce(mobileVideoFile.asset->url, mobileImage.asset->url),
      cols,
      ratio,
      mobileRatio
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

export const CLIENT_OVERVIEW_QUERY = `*[_type == "project" && slug.current == $slug && published == true][0] {
  name,
  type,
  descriptor,
  tagline,
  summary,
  relationship,
  "subProjects": *[_type == "project" && string::startsWith(slug.current, $slug + "-") && published == true] {
    "slug": slug.current,
    comingSoon,
    "thumbnail": coalesce(
      thumbnailImages[0].asset->url,
      sections[_type == "imageFullSection" && defined(image.asset)][0].image.asset->url,
      sections[_type == "imageGridSection"][0].images[defined(image.asset)][0].image.asset->url
    ),
    "thumbnailVideo": thumbnailVideoFile.asset->url
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

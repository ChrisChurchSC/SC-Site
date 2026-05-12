import { createContext, useContext, useMemo } from 'react'
import { useSanity } from '../hooks/useSanity'
import { PROJECTS_QUERY } from '../lib/queries'
import { projects as staticProjects } from '../data/projects'

const ProjectsContext = createContext(null)

const pad = (n) => String(n ?? 0).padStart(3, '0')

// Map the static projects.js shape to the same shape the Sanity query returns
// so consumers can use one structure regardless of source.
const fromStatic = staticProjects.map(p => ({
  _id: `static-${p.slug}`,
  n: p.n,
  name: p.name,
  slug: p.slug,
  type: p.type,
  descriptor: p.descriptor,
  password: p.password,
  comingSoon: false,
  subCount: p.work?.length ?? 0,
  subProjects: (p.work ?? []).map((workName) => ({
    name: workName,
    slug: `${p.slug}-${workName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
  })),
  images: null,
}))

export function ProjectsProvider({ children }) {
  const { data } = useSanity(PROJECTS_QUERY)
  const value = useMemo(() => {
    const source = Array.isArray(data) && data.length ? data : fromStatic
    // Pad the `n` field if Sanity returned a raw number string. Strip the
    // "Parent — " prefix that the sync script wrote into sub-project names.
    const projects = source.map(p => ({
      ...p,
      n: pad(p.n),
      subProjects: (p.subProjects ?? []).map(sp => {
        const prefix = `${p.name} — `
        const name = sp.name?.startsWith(prefix) ? sp.name.slice(prefix.length) : sp.name
        return { ...sp, name }
      }),
    }))
    const bySlug = new Map(projects.map(p => [p.slug, p]))
    return {
      all: projects,
      bySlug: (slug) => bySlug.get(slug),
      isMulti: (slug) => (bySlug.get(slug)?.subCount ?? 0) > 1,
      subProjectsOf: (slug) => bySlug.get(slug)?.subProjects ?? [],
    }
  }, [data])
  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export const useProjects = () => useContext(ProjectsContext)

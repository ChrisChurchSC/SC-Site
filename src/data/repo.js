// The SC-Brand repository, as the site draws it.
//
// FOLDERS AND COUNTS ARE REAL — the five top-level folders of the working
// copy and the asset counts from Chris's own workspace. The file names under
// them are real too where the brand's notes name them: Strategy holds
// positioning, Verbal holds the tone of voice, Visual is its own repo, Data
// holds the metrics CSV, and Agents holds the six subagents.
//
// The ages are a snapshot and will drift. That is fine — this is a picture
// of a repository, and a repository that never changed would be the odd
// thing. Nothing on the page depends on them being current.
export const repoFolders = [
  { name: 'Agents', count: 7, age: '1d' },
  { name: 'Data', count: 1, age: '1d' },
  { name: 'Strategy', count: 9, age: '22h' },
  { name: 'Verbal', count: 3, age: '20h' },
  { name: 'Visual', count: 7, age: '22h' },
]

// One real file per folder, in repository order. Named in the brand's notes
// rather than invented: an agent, the metrics CSV, the positioning doc, the
// tone of voice, and the wordmark.
export const repoFiles = [
  { folder: 'Agents', name: 'brand-strategist.md', age: '1d' },
  { folder: 'Data', name: 'metrics.csv', age: '1d' },
  { folder: 'Strategy', name: 'positioning.md', age: '22h' },
  { folder: 'Verbal', name: 'tone-of-voice.md', age: '20h' },
  { folder: 'Visual', name: 'logo.svg', age: '22h' },
]

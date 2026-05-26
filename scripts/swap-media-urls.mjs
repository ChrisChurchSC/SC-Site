import { readFileSync, writeFileSync } from 'fs'

const replacements = [
  ['/brand-systems.avif',    'https://cdn.sanity.io/files/ppq16wpu/production/9a247d8cf4d951f74817a8203600fce57d4efdfe.avif'],
  ['/digital-products.avif', 'https://cdn.sanity.io/files/ppq16wpu/production/38b5230b7dbf6251a8cbceacdb3a4da6fc87d026.avif'],
  ['/content-programs.mp4',  'https://cdn.sanity.io/files/ppq16wpu/production/0046a65d494bc6acd42d4d2272603403ae2f6c0a.mp4'],
  ['/cover-gradient.mp4',    'https://cdn.sanity.io/files/ppq16wpu/production/6d752bbf01b6f5301b48d62598d4e1ee51a44251.mp4'],
  ['/reel-preview.gif',      'https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif'],
  ['/reel-compressed.mp4',   'https://cdn.sanity.io/files/ppq16wpu/production/586f7407cc2a4d7d2a1d9c8b753695e28aec8247.mp4'],
]

const files = [
  'src/pages/Capabilities.jsx',
  'src/pages/AgencyCapabilities.jsx',
  'src/pages/BrandSystems.jsx',
  'src/pages/ContentPrograms.jsx',
  'src/pages/DigitalProducts.jsx',
  'src/pages/ContentPackages.jsx',
]

for (const file of files) {
  let content = readFileSync(file, 'utf8')
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
      console.log(`${file}: ${from} -> ...${to.split('/').pop()}`)
    }
  }
  if (changed) writeFileSync(file, content)
}
console.log('Done')

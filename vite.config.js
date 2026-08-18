import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The six password-gated sales decks. Their chunks are emitted under
 * assets/deck/ so the edge middleware has a stable path to protect — the
 * hashed filenames change every build and cannot be matched directly.
 */
const GATED_DECK_PAGES = [
  'pages/Capabilities.jsx',
  'pages/AgencyCapabilities.jsx',
  'pages/BrandSystems.jsx',
  'pages/ContentPrograms.jsx',
  'pages/DigitalProducts.jsx',
  'pages/ContentPackages.jsx',
  'pages/LandingHub.jsx',
]

const isGatedDeck = (id) => !!id && GATED_DECK_PAGES.some((p) => id.includes(p))

export default defineConfig(() => ({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunk) =>
          isGatedDeck(chunk.facadeModuleId)
            ? 'assets/deck/[name]-[hash].js'
            : 'assets/[name]-[hash].js',
        assetFileNames: (asset) => {
          // Keep each deck's stylesheet behind the gate too — the CSS carries
          // layout and, via generated content, can carry copy.
          const src = asset.originalFileNames?.[0] || asset.name || ''
          return isGatedDeck(src) ? 'assets/deck/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
}))

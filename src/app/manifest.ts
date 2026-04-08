import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
export const revalidate = false

export default function manifest(): MetadataRoute.Manifest {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '')
  const prefix = basePath ? `${basePath}` : ''
  return {
    name: 'Financial Budget App',
    short_name: 'Budget',
    description: 'Personal finance, budgeting, and expense tracking dashboard.',
    start_url: `${prefix}/`,
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: `${prefix}/icon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}


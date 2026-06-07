import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? 'production'

export const client = projectId
  ? createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false })
  : null

export function urlFor(source: Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0]) {
  if (!projectId) return { url: () => '' }
  return createImageUrlBuilder({ projectId, dataset }).image(source)
}

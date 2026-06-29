import { defineCollection, z } from '@nuxt/content'

export const collections = {
  updates: defineCollection({
    type: 'page',
    source: 'updates/*.md',
    schema: z.object({
      title: z.string(),
      title_es: z.string(),
      date: z.string(),
      slug: z.string().optional(),
      published: z.boolean().default(true),
      posted_to_x: z.boolean().optional(),
      posted_to_facebook: z.boolean().optional(),
    })
  })
}

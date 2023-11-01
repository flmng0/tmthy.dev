import { z, defineCollection } from 'astro:content';

const common = {
  date: z.coerce.date(),
  name: z.string(),
  brief: z.string(),
  image: z.string(),
}

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...common
  })
})

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    ...common,
    data: z.any(),
    type: z.enum(["sketch", "website", "misc"])
  })
})

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection
}

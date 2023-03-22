import { z, defineCollection } from 'astro:content'

const sketches = defineCollection({
    schema: z.object({
        date: z.date(),
        name: z.string(),
        // tags: z.enum(['bevy', 'simulation', 'art']).array(),
        brief: z.string(),
        source: z.string().optional(),
        screenshot: z.string().optional(),
    }),
})

export const collections = {
    sketches,
}

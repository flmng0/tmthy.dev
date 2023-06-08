import { z, defineCollection } from 'astro:content'

const common = {
    date: z.date(),
    name: z.string(),
    brief: z.string(),
}

const sketches = defineCollection({
    schema: z.object({
        ...common,
        // tags: z.enum(['bevy', 'simulation', 'art']).array(),
        source: z.string().optional(),
        screenshot: z.string().optional(),
        canvasBackground: z.string().optional(),
    }),
})

const blog = defineCollection({
    schema: z.object({
        ...common,
        date: z.date(),
        name: z.string(),
        brief: z.string(),
    }),
})

export const collections = {
    sketches,
    blog,
}

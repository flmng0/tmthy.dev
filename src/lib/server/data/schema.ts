import z from 'zod'

export const collections = {
    sketches: z.object({
        date: z.coerce.date(),
        name: z.string(),
        // tags: z.enum(['bevy', 'simulation', 'art']).array(),
        brief: z.string(),
        source: z.string().optional(),
        screenshot: z.string().optional(),
    }),
} satisfies Record<string, z.ZodSchema>

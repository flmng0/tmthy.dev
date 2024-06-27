import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      brief: z.string(),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: z.string(),
    }),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    brief: z.string(),
    thumbnail: z.string().optional(),
    writeup: z.string().optional(),
    source: z.string().optional(),
    link: z.string().optional(),
  }),
});

const sketches = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    appName: z.string(),
    brief: z.string(),
    date: z.coerce.date(),
    background: z.string().optional(),
  }),
});

export const collections = {
  blog,
  projects,
  sketches,
};

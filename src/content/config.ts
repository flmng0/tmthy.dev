import { z, defineCollection, type SchemaContext } from "astro:content";

const blogCollection = defineCollection({
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

const projectsCollection = defineCollection({
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

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};

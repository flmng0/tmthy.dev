import { z, defineCollection, type SchemaContext } from "astro:content";

const common = ({ image }: SchemaContext) => ({
  date: z.coerce.date(),
  name: z.string(),
  brief: z.string(),
  cover: image(),
  coverAlt: z.string(),
});

const blogCollection = defineCollection({
  type: "content",
  schema: (ctx) =>
    z.object({
      ...common(ctx),
    }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: (ctx) =>
    z.object({
      ...common(ctx),
      data: z.any(),
      type: z.enum(["sketch", "website", "misc"]),
    }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};

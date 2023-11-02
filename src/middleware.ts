import { defineMiddleware } from "astro:middleware";

export const prerender = false;

export const onRequest = defineMiddleware(({ cookies, locals }, next) => {
  locals.theme = cookies.get("theme")?.value;

  return next();
});

import EleventyPluginVite from "@11ty/eleventy-plugin-vite";
import tailwindcss from "@tailwindcss/vite";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginVite, {
    viteOptions: {
      plugins: [tailwindcss()],
    },
  });

  eleventyConfig.addBundle("html");

  eleventyConfig.setLayoutResolution(false);
  eleventyConfig.addLayoutAlias("root", "root.html");
  eleventyConfig.addLayoutAlias("sketch", "sketch.html");

  eleventyConfig.addPassthroughCopy({
    static: "/",
  });
  eleventyConfig.addPassthroughCopy("src/**/*.css");

  return {
    dir: {
      input: "src",
    },
    templateFormats: ["html", "njk"],
    htmlTemplateEngine: "njk",
  };
}

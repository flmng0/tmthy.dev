import EleventyPluginVite from "@11ty/eleventy-plugin-vite";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyPluginVite);

  eleventyConfig.addBundle("html");

  eleventyConfig.setLayoutResolution(false);
  eleventyConfig.addLayoutAlias("root", "root.html");
  eleventyConfig.addLayoutAlias("sketch", "sketch.html");

  eleventyConfig.addPassthroughCopy({
    static: "/",
  });

  return {
    dir: {
      input: "src",
    },

    templateFormats: ["html", "njk"],
    htmlTemplateEngine: "njk",
  };
}

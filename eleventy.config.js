import pluginVite from "@11ty/eleventy-plugin-vite";
import pluginIcons from "eleventy-plugin-icons";
import tailwindcss from "@tailwindcss/vite";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginVite, {
    viteOptions: {
      plugins: [tailwindcss()],
    },
  });

  eleventyConfig.addPlugin(pluginIcons, {
    sources: [
      {
        name: "lucide",
        path: "node_modules/lucide-static/icons",
        default: true,
      },
      {
        name: "tmthy",
        path: "./icons"
      }
    ],
  });

  eleventyConfig.addBundle("html");

  eleventyConfig.setLayoutResolution(false);
  eleventyConfig.addLayoutAlias("root", "root.html");
  eleventyConfig.addLayoutAlias("main", "main.html");
  eleventyConfig.addLayoutAlias("sketch", "sketch.html");

  eleventyConfig.addPassthroughCopy({
    static: "/",
  });
  eleventyConfig.addPassthroughCopy("src/**/*.css");

  eleventyConfig.setServerOptions({
    showAllHosts: true,
  });

  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
}

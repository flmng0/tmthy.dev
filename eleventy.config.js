import { exec } from "node:child_process";
import path from "node:path";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addBundle("html");

  eleventyConfig.addLayoutAlias("root", "root.html");
  eleventyConfig.addLayoutAlias("sketch", "sketch.html");
  eleventyConfig.setLayoutResolution(false);

  // Elm compilation stuff
  eleventyConfig.addWatchTarget("./src/*.elm");
  eleventyConfig.watchIgnores.add("./src/Sketch*.elm");

  const elmOutputPath = "./assets/js/elm";
  eleventyConfig.addGlobalData("elmOutputPath", elmOutputPath);

  eleventyConfig.on(
    "eleventy.beforeWatch",
    async (/** @type {string[]} */ changedFiles) => {
      const elmPromises = [];

      for (const changedFile of changedFiles) {
        if (changedFile.endsWith(".elm")) {
          console.info("Compiling", changedFile);

          const base = path.basename(changedFile, ".elm");
          const outPath = path.join(elmOutputPath, base + ".js");

          const cmd = `npx elm make ${changedFile} --output=${outPath}`;

          const promise = new Promise((reject, resolve) => {
            exec(cmd, (err, _stdout, stderr) => {
              if (err !== null) {
                console.error(stderr);
                reject(stderr);
              }
              resolve();
            });
          });

          elmPromises.push(promise);
        }
      }

      await Promise.allSettled(elmPromises);
    },
  );
}

export const config = {
  dir: {
    input: "pages",
  },

  templateFormats: ["html", "njk"],
  htmlTemplateEngine: "njk",
};

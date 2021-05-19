# Personal Portfolio
Personal portfolio website for Tim Davis. Made using [Nuxt].

[Nuxt]: https://nuxtjs.org

## Rationales
### All Website Content is in The `src` Directory
This is a simple but effective way to help cleanly organise the files for this website. It helps to separate the client from the server on larger projects as well, so I'm used to this style of organisation.

### "Sketches" Are Defined Using Markdown Files
Utilising the @nuxt/content library, sketches are organised using Markdown (.md) files, but projects are defined with a JSON file.

This is because sketches all have their own page on the website, where someone may preview the sketch without leaving the page. This is unlike projects, which are all links to external sites.

Another reason for this, is because sketches have relatively extensive documentation and explanation, which would be tedious to write with JSON.

# Personal Portfolio

Personal portfolio website for Tim Davis. Made using [Svelte].

[svelte]: https://svelte.dev

## Rationales

### "Sketches" Are Defined Using Markdown Files

Utilising the `marked` library, sketches are organised using Markdown (.md) files, but projects are defined with a JSON file.

This is because sketches all have their own page on the website, where someone may preview the sketch without leaving the page. This is unlike projects, which are all links to external sites.

Another reason for this, is because sketches have relatively extensive documentation and explanation, which would be tedious to write with JSON.

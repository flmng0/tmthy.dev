// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const SITE_NAME = "Tim's Portfolio";

module.exports = {
    siteName: SITE_NAME,
    plugins: [],
    titleTemplate: '%s | ' + SITE_NAME,
    templates: {
        Sketch: '/sketches/:stub',
    }
};

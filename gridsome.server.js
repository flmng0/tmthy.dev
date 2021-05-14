// Changes here require a server restart.

const projects = require("./data/projects.json");
const sketches = require("./data/sketches.json");

module.exports = function (api) {
    api.loadSource(({ addCollection }) => {
        const projectCollection = addCollection('Project');

        for (const project of projects) {
            projectCollection.addNode(project);
        }

        const sketchCollection = addCollection('Sketch');

        for (const sketch of sketches) {
            sketchCollection.addNode(sketch);
        }
    });
}

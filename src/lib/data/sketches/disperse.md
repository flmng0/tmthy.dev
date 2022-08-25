---
name: Polygon Vertex Dispersion
brief: Dispersion simulation used for the home-page hero's interactivity. Simulate each vertex of a polygon as a particle, apply a repel force from the mouse, and a spring force to the origin.
screenshot: /screenshots/sketches/disperse.png
---

## Instructions

- Mouse over/tap the polygon and watch its vertices disperse.

## About

This was genuinely just created for the hero of the index page; I wanted some form of interaction.

It's a pretty simple sketch, but it took me a while to get the physics stuff working a way that I liked.

### Simulation

Explained simply, each vertex of the polygon gets transformed into a particle, which simulates basic velocity and acceleration. A spring force is added from each particle to its origin.

### Connections

There are also pre-degined connections between vertices, passed when the `DisperseSketch` is constructed.

The connections are an array of index pairs (`[number, number][]`). They are used to draw the lines between each of the points.

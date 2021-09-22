---
name: Polygon Dispersion
brief: Dispersion simulation used for the homepage hero interactivity.
---

## Instructions

-   Mouse over the polygon and watch its vertices disperse.

## About

This was genuinely just created for the hero of the index page; I wanted some form of interaction.

It's a pretty simple sketch, but it took me a while to get the physics stuff working.

Put simply, each vertex of the polygon gets transformed into a particle, which simulates basic velocity and acceleration. This includes friction (a force in the opposite direction of the current velocity, at some magnitude).

There are also pre-defined connections between vertices, passed when the `DisperseSketch` is constructed.

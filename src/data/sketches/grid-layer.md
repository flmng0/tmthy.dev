---
name: Column Grid Distribution
brief: Method to semi-evenly distribute items of varying height into rows. Originally created to fit cards into columns of a flexbox, on sketch index page.
---

## Instructions

-   Click or tap the canvas to re-distribute the items on the grid.

## About

This sketch was originally going to be used to layout sketches on the sketch directory page (/sketches). However, I ended up preferring the look of a regular ol' CSS grid.

This is the remnants of what was going to be, because I still find it interesting.

The algorithm for laying out the items in the grid is as follows:

Given a list of items of varying height:

1. Select the first column, and place one of the items in it.
2. Select the next column, and place one of the items in it.
3. Repeat the previous step until the current column is taller than the previous column.
4. Repeat steps 2 and 3, until all items have been used.

I believe the algorithm achievs quite nice results, even though the process itself is very basic.

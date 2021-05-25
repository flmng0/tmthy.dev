---
name: Column Grid Distribution
brief: '"Uniformly" distributing grid items of various heights (but similar width) into columns.'
---

## Instructions

- Click or tap the canvas, to randomly re-generate the items on the grid.

## About

This sketch was born out of testing the layout for the home page of my portfolio. However, I ended up preferring the cleaner look of a regular CSS grid.

The algorithm for laying out the items in the grid is relatively simple:

1.  First, select the first column, and place one of the items in it.
2.  Next, select the next column.
3.  Until the current column is as tall (or taller) than the previous column, place items on the current column.
4.  Repeat steps 2-3 until all items have been placed.

Even though it is relatively simple, it achieves quite nice results, at least, in my opinion. You can see the layout patterns above, with randomly sized grid items.

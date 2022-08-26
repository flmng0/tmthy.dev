---
date: 2022-08-24
name: Home Hero Icon
brief: Animated icon for the home page's hero. Connected points in a mesh, that transitions to another mesh every 5s.
---

## Description

Like the "Polygon Vertex Dispersion" sketch ([disperse]), this sketch acts on meshes and generates particles based on the mesh. Each mesh is a list of points, and a list of connections between them.

The particles in the sketch slowly attempt to move back to their original positions, while simulating acceleration and velocity.

When the sketch loads, it computes the distance between each pair of points. These original distances are used to calculate the line width when drawing.

The difference between this sketch and the [disperse] sketch, is this sketch can rotate between different meshes.

Every mesh has points defined in the range `[(0,0), (1,1)]`

[disperse]: /sketches/disperse

## Transitioning Between Meshes

When the sketch is about to rotate to a different mesh, the connection lines slowly fade out, the target points for the particles is changed, and then the lines fade back in.

There are three cases for the amount of points in the new mesh, compared to the old mesh:

- **The new mesh has the same amount of points:** In this case, nothing is done. Only the target points change.
- **The new mesh has more points:** In this case, particles are added at random points in a radius of `0.5` units from the center of the mesh, until the amount of particles equals the amount of points in the mesh.
- **The new mesh has less points:** In this case, particles are destroyed until the amount of particles equals the amount of points in the mesh.

In all cases, the particle indices are shuffled.

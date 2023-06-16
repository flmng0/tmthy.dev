---
date: 2023-03-13
name: Julia Set Visualisation
brief: Implementation of the Julia set drawn onto a canvas.
---

## About

The Julia set is a chaotic set of fractals defined by iterating on a function $f_c(z)$, where:

$$
f_c(z) = z^2 + c
$$

$z$ and $c$ are complex parameters.

The colour of a given pixel is defined by how many recursive iterations of $f_c(z)$ it takes, until the magnitude of the returned value is greater than some $R$.

### Pseudo-code

```py
def julia(z):
    i = 0

    while len(z) < R && i < LIMIT:
        z = (z * z) + c
        i = i + 1

    return i

for (x, y) in pixels:
    zx = map(x, 0, width, -R, R)
    zy = map(y, 0, height, -R, R)

    z = complex(zx, zy)

    value = julia(z)

    pixels[x, y] = grey(value)
```

## Parameters For The Above Sketch

By default the demonstration above uses a $c$ value where:

$$
c = 0.7885e^{ia}
$$

$a$ is animated over the range $a \in [0, 2\pi]$ with a period of $4\pi$ seconds.

In-case you haven't worked with complex numbers for a while, the above definition of $c$ is in the form:

$$
c = Ae^{i \theta}
$$

This, in practice, is a representation of a polar coordinate, where $A$ is magnitude and $\theta$ is the angle (radians).

To represent this in code, you can do the following (pseudo-code):

```py
cx = A * cos(theta)
cy = A * sin(theta)

c = complex(cx, cy)
```

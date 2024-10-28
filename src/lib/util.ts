//export function CatmullRom(
//  t: number,
//  p0: number,
//  p1: number,
//  p2: number,
//  p3: number
//) {
//  const v0 = (p2 - p0) * 0.5;
//  const v1 = (p3 - p1) * 0.5;
//  const t2 = t * t;
//  const t3 = t2 * t;
//  return (
//    (2 * p1 - 2 * p2 + v0 + v1) * t3 +
//    (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 +
//    v0 * t +
//    p1
//  );
//}

// from https://easings.net
export function easeOutElastic(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const c4 = (2 * Math.PI) / 3;

  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function easeInOutSine(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeOutSine(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  return Math.sin((Math.PI * t) / 2);
}
export function easeInSine(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  return 1 - Math.cos((Math.PI * t) / 2);
}
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

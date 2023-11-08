export interface Sketch<T = any> {
  init(cvs: HTMLCanvasElement): T | null;
  draw(state: T, t: number): void;
}

/** Type definition utility. */
export function sketch<T>(s: Sketch<T>): Sketch<T> {
  return s;
}

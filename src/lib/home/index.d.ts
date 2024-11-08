import type { Writable } from "svelte/store";
import type { AnimeAnimParams } from "animejs";

export type AnimationSpec = () => {
  params: AnimeAnimParams;
  offset?: string;
};

export type AnimatedProps = {
  animations: Writable<AnimationSpec[]>;
};

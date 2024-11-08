import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

type HomeContext = {
  controlsEnabled: Writable<boolean>;
};

const homeContextKey = "home-tmthy.dev";

export function setHomeContext() {
  setContext(homeContextKey, {
    controlsEnabled: writable(false),
  });
}

export function useHomeContext(): HomeContext {
  return getContext(homeContextKey);
}

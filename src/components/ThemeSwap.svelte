<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const THEME_KEY = "theme";

  function getMediaPreference() {
    if (typeof window === "undefined") {
      return "";
    }

    const stored = window.localStorage?.getItem(THEME_KEY);
    if (stored !== null) {
      return stored;
    }

    if (typeof document !== "undefined") {
      const dataTheme = document.body.getAttribute("data-theme");
      if (dataTheme !== null) {
        return dataTheme;
      }
    }

    const match = matchMedia("(prefers-color-scheme: dark)");
    return match.matches === true ? "dark" : "light";
  }

  const initialState = getMediaPreference();
  const theme = writable(initialState);

  theme.subscribe((theme) => {
    if (typeof window !== "undefined") {
      window.localStorage?.setItem(THEME_KEY, theme);
    }

    if (typeof document !== "undefined") {
      document.body.setAttribute("data-theme", theme);
      document.cookie = "theme=" + theme;
    }
  });
</script>

<button
  class="dark-toggle btn"
  class:btn-secondary={$theme === "dark"}
  on:click={() => ($theme = "dark")}
>
  <slot name="dark" />
</button>
<button
  class="light-toggle btn"
  class:btn-secondary={$theme === "light"}
  on:click={() => ($theme = "light")}
>
  <slot name="light" />
</button>

<style>
  button {
    aspect-ratio: 1;
    padding: var(--size-3);
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const theme = writable<string>(undefined);

  onMount(() => {
    $theme = document.documentElement.getAttribute("data-theme")!;
  });

  theme.subscribe((theme) => {
    if (theme === undefined) return;

    if (typeof window !== "undefined") {
      window.localStorage?.setItem("theme", theme);
    }

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  });
</script>

<div class="theme-swapper">
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
</div>

<style>
  .theme-swapper > button {
    aspect-ratio: 1;
    padding: var(--size-3);
  }

  .theme-swapper {
    display: flex;
    flex-flow: row nowrap;
    gap: var(--size-1);
  }
</style>

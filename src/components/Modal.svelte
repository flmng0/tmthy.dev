<script lang="ts">
  export let id: string;
  let modalElem: HTMLDialogElement;

  function close() {
    modalElem.close();
  }
</script>

<dialog bind:this={modalElem} {id}>
  <div on:click={close} aria-hidden="true" />

  <slot />

  <button on:click={close}>
    <slot name="close-button" />
  </button>
</dialog>

<style>
  dialog {
    overflow: auto;
    z-index: 9999;
    padding: 0;
    background: transparent;
    border: none;
    max-width: 80ch;
  }

  dialog > div {
    position: fixed;
    inset: 0;
    z-index: -10;

    background-color: var(--background-dark);
    opacity: 0.8;
  }

  dialog > button {
    position: fixed;
    right: var(--size-4);
    top: var(--size-4);

    z-index: 20;

    color: var(--text-dark);
  }
</style>

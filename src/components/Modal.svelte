<script lang="ts">
  let {id}: { id: string } = $props();

  let modalElem: HTMLDialogElement;

  function close() {
    modalElem.close();
  }
</script>

<dialog bind:this={modalElem} {id}>
  <div class="backdrop" onclick={close} aria-hidden="true" />

  <slot />

  <button onclick={close}>
    <slot name="close-button" />
  </button>
</dialog>

<style>
  dialog {
    z-index: 9999;
    background: transparent;
    border: none;
    min-width: 100vw;
    min-width: 100lvw;
    max-height: 100%;
    margin: 0;
    padding: var(--size-4);
  }

  dialog[open] {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: -10;

    background-color: var(--background-dark);
    opacity: 0.8;
  }

  dialog > button {
    position: fixed;
    right: var(--size-6);
    top: var(--size-6);

    aspect-ratio: 1;
    background-color: var(--background-dark);
    padding: var(--size-2);

    z-index: 20;

    color: var(--text-dark);
  }
</style>

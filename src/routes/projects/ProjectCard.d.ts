export interface Props {
    key: string
    children: import('svelte').Snippet
    title: import('svelte').Snippet
    actions?: import('svelte').Snippet
    object?: import('svelte').Snippet
    position: { x: number; z: number }
}

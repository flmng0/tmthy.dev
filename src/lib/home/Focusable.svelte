<script lang="ts" generics="Type extends keyof typeof T">
    import { T, useThrelte } from '@threlte/core'
    import { useCursor, type IntersectionEvent } from '@threlte/extras'
    import type { ComponentProps, Snippet } from 'svelte'
    import { useHomeContext } from './context'
    import { setDrawer } from '../Drawer.svelte'

    type ThisT = (typeof T)[Type]

    type AnyProps = Record<string, any>

    type ThisProps = {
        component: ThisT
        onPointerOver?: Parameters<typeof useCursor>[0]
        onPointerOut?: Parameters<typeof useCursor>[1]
        details: Snippet
        onidle?: () => void
        onhover?: () => void
        onactive?: () => void
        oninactive?: () => void
        onclick?: () => void
    }

    type TProps = Omit<ComponentProps<ThisT>, keyof ThisProps>

    type Props = ThisProps & TProps & AnyProps

    let {
        component: Component,
        onPointerOver,
        onPointerOut,
        details,
        onidle,
        onhover,
        onactive,
        oninactive,
        onclick: onclickuser,
        ref = $bindable(),
        ...rest
    }: Props = $props()

    const { onPointerEnter, onPointerLeave } = useCursor(
        onPointerOver,
        onPointerOut
    )

    const { controller } = useHomeContext()
    const { invalidate } = useThrelte()

    const onclick = (e: IntersectionEvent<MouseEvent>) => {
        if (ref) {
            $controller?.focusLocation(ref.position, invalidate)
        }

        setDrawer(details)
        e.stopPropagation()

        onclickuser?.()
        onidle?.()
    }

    const onpointerenter = () => {
        onPointerEnter()
        onhover?.()
    }

    const onpointerleave = () => {
        onPointerLeave()
        onidle?.()
    }

    const onpointerdown = () => {
        onactive?.()
    }

    const onpointerup = () => {
        oninactive?.()
    }
</script>

<Component
    {...rest}
    interactive
    bind:ref
    {onclick}
    {onpointerdown}
    {onpointerup}
    {onpointerenter}
    {onpointerleave}
/>

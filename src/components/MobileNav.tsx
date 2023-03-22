import { createSignal, For, onMount } from 'solid-js'

export default function MobileNav(props: {
    pages: { href: string; name: string }[]
    current: string
}) {
    const [hidden, setHidden] = createSignal(false)

    onMount(() => {
        window.addEventListener('scroll', () => {
            setHidden(window.scrollY > 50)
        })
    })

    return (
        <div
            class="bg-gray-200 transition-transform"
            classList={{ 'translate-y-[-100%]': hidden() }}
        >
            <ul class="flex h-12 items-center justify-start gap-4 px-5">
                <For each={props.pages}>
                    {({ href, name }) => {
                        const current = () => props.current === href
                        return (
                            <li classList={{ underline: current() }}>
                                <a href={href}>{name}</a>
                            </li>
                        )
                    }}
                </For>
            </ul>
        </div>
    )
}

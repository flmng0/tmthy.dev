import Logo from './Logo'
import { createEffect, createSignal, For, onMount } from 'solid-js'

export const pages: {
    href: string
    name: string
}[] = [
    { href: '/', name: 'Home' },
    { href: '/sketches', name: 'Sketches' },
    { href: '/blog', name: 'Blog' },
]

export default function Navigation() {
    const [enabled, setEnabled] = createSignal(false)
    const [hidden, setHidden] = createSignal(false)

    const classList = () => ({ '-translate-y-full': hidden() })

    const hiddenMargin = 50
    const totalDuration = 500

    let container: HTMLUListElement

    createEffect(() => {
        if (!enabled()) {
            setHidden(false)
        }
    })

    onMount(() => {
        const mql = window.matchMedia('(max-width: 768px)')

        setEnabled(mql.matches)

        mql.addEventListener('change', () => {
            setEnabled(mql.matches)
        })

        let lastScroll = window.scrollY
        window.addEventListener('scroll', () => {
            if (!enabled()) return

            const scrollY = window.scrollY
            const dy = scrollY - lastScroll

            setHidden(dy > 0 && scrollY > hiddenMargin)
            lastScroll = scrollY
        })

        const delayElems = container.querySelectorAll('[data-delay]')
        delayElems.forEach((elem, i) => {
            const t = i / delayElems.length

            const e = elem as HTMLElement
            e.style.transitionDelay = `${t * totalDuration}ms`

            console.debug(e)
        })
    })

    return (
        <nav
            ref={container!}
            class="w-full bg-gray-200 shadow-md transition"
            classList={{ '-translate-y-full delay-[500ms] shadow-none': hidden() }}
        >
            <ul class="mx-auto flex h-full w-full max-w-2xl flex-row flex-nowrap gap-4 px-8">
                <li
                    class="grid items-center px-2 transition-transform"
                    classList={classList()}
                    data-delay
                >
                    <a href="/">
                        <div class="h-10">
                            <Logo />
                        </div>
                    </a>
                </li>
                <For each={pages}>
                    {({ href, name }) => (
                        <li class="py-5 transition-transform" classList={classList()} data-delay>
                            <a href={href}>{name}</a>
                        </li>
                    )}
                </For>
            </ul>
        </nav>
    )
}

import Logo from './Logo'
import { createEffect, createSignal, For, onMount } from 'solid-js'
import createTween from '@solid-primitives/tween'

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

    const commonClassList = () => ({ '-translate-y-full': hidden() })

    const hiddenMargin = 50
    const totalDuration = 500

    const borderHue = () => (hidden() ? 100 : 310)
    const tweenedHue = createTween(borderHue, { duration: 1000 })

    let container: HTMLUListElement

    createEffect(() => {
        if (!enabled()) {
            setHidden(false)
        }
    })

    onMount(() => {
        const mql = window.matchMedia(
            '(max-width: 768px) and (prefers-reduced-motion: no-preference)'
        )

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
        })
    })

    return (
        <nav
            ref={container!}
            style={{ 'border-color': `hsl(${tweenedHue()}, 100%, 50%)` }}
            class="w-full border-b-2 bg-flamingo-950 pb-1 shadow-lg transition-transform"
            classList={{
                '-translate-y-[calc(100%-2px)] delay-[500ms] motion-safe:shadow-none': hidden(),
            }}
        >
            <ul class="mx-auto flex h-full w-full max-w-2xl flex-row flex-nowrap gap-4 px-8">
                <li
                    class="grid items-center px-2 transition-transform"
                    classList={commonClassList()}
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
                        <li
                            class="py-5 transition-transform"
                            classList={commonClassList()}
                            data-delay
                        >
                            <a
                                class="text-lg font-normal text-white underline hover:text-flamingo-200"
                                href={href}
                            >
                                {name}
                            </a>
                        </li>
                    )}
                </For>
            </ul>
        </nav>
    )
}

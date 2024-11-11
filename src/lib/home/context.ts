import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'
import type IsometricMapControls from './IsometricMapControls'

type HomeContext = {
    controlsEnabled: Writable<boolean>
    controller: Writable<IsometricMapControls>
}

const homeContextKey = 'home-tmthy.dev'

export function setHomeContext() {
    setContext(homeContextKey, {
        controlsEnabled: writable(false),
        controller: writable(),
    })
}

export function useHomeContext(): HomeContext {
    return getContext(homeContextKey)
}

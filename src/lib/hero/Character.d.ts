import { T } from '@threlte/core'
import type { ComponentProps } from 'svelte'

type MeshProps = ComponentProps<typeof T.Mesh>

interface Props extends MeshProps {
    value: string
    font: object
}

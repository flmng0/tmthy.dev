import path from 'path'
import fs from 'fs'

import type { RequestHandler } from '@sveltejs/kit'

const projectPath = path.join(process.cwd(), 'src/data/projects.json')

export const get: RequestHandler = async ({params}) => {
    // Maybe use params for a count at some point.

    try {
        const fileContent = await fs.promises.readFile(projectPath)

        const projects = JSON.parse(fileContent.toString())

        return {
            body: {
                projects,
            }
        }
    }
    catch (e) {
        return {
            status: 500,
        }
    }
}

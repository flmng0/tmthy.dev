import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

export function getAllProjects() {
  const projects = require('~/data/projects.json')
  return projects
}

const sketchesDir = path.join(process.cwd(), 'src/data/sketches')

export function getAllSketchMeta() {
  const entries = fs.readdirSync(sketchesDir)

  const sketches = entries.map((entry) => {
    const id = entry.replace(/\.md$/, '')

    const fullPath = path.join(sketchesDir, entry)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data,
    }
  })

  return sketches
}

export function getAllSketchIDs() {
  const entries = fs.readdirSync(sketchesDir)

  const ids = entries.map((entry) => entry.replace(/\.md$/, ''))

  return ids
}

export async function getSketchData(id) {
  const fullPath = path.join(sketchesDir, `${id}.md`)
  const contents = await fs.promises.readFile(fullPath, 'utf8')

  const matterResult = matter(contents)

  const remarkResult = await remark().use(html).process(matterResult.content)
  const contentHtml = remarkResult.toString()

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}

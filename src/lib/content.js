import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function getAllProjects() {
  const projects = require('~/data/projects.json')
  return projects
}

const sketchesDir = path.join(process.cwd(), 'src/data/sketches')

export function getAllSketches() {
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

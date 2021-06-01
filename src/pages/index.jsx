import Link from 'next/link'
import * as React from 'react'

import { getAllProjects, getAllSketchMeta } from '~/lib/content'
import ProjectCard from '~/components/ProjectCard'
import Layout from '~/components/Layout'
import SketchCard from '~/components/SketchCard'

export function getStaticProps() {
  const allProjects = getAllProjects()
  const allSketches = getAllSketchMeta()
  return {
    props: {
      allProjects,
      allSketches,
    },
  }
}

export default ({ allProjects, allSketches }) => (
  <Layout title="Home" home>
    <section className="showcase projects">
      <h2 className="showcase-title">Projects</h2>
      <ul className="showcase-list">
        {allProjects.map((project) => (
          <li className="showcase-card" key={project.name}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>

    <section className="showcase sketches">
      <h2 className="showcase-title">Sketches</h2>
      <ul className="showcase-list">
        {allSketches.map((sketch) => (
          <li className="showcase-card" key={sketch.id}>
            <Link href={`/sketches/${sketch.id}`}>
              <a>
                <SketchCard sketch={sketch} />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </section>

    <style jsx>{`
      .showcase-title {
        font-size: 2rem;
        text-align: center;
      }

      .showcase-list {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;

        margin: 0 auto;
        padding-left: 0;
      }

      .showcase-card,
      .showcase-card * {
        text-decoration: none;
        color: currentColor;
      }

      .showcase-card {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;

        height: 20rem;
        width: 30ch;

        padding: 1rem;
        margin: 0.5rem 0.75rem;

        border-radius: 0.5rem;
        border: 1px solid hsla(0, 0%, 20%, 0.2);

        transition-property: border-color, box-shadow, transform;
        transition-duration: 150ms;
        transition-timing-function: ease;
      }

      .showcase-card:hover {
        border-color: hsla(0, 0%, 20%, 0.8);
        box-shadow: 0 0.1875rem 0.3125rem hsla(0, 0%, 20%, 0.2);
        transform: translateY(-0.1rem);
      }
    `}</style>
  </Layout>
)


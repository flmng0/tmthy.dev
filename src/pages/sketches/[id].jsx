import Link from 'next/link'

import Layout from '~/components/Layout'
import { getAllSketchIDs, getSketchData } from '~/lib/content'
import * as React from 'react'

// The componentDidMount, and componentWillUnmount, methods are used to
// completely reload the sketch's script tag when the component is mount and
// unmounted.
//
// Before, if you came to a sketch's page, then went to the home-page, and then
// returned, the sketch's canvas would have no content drawn into it.

export default class SketchPreview extends React.Component {
  constructor(props) {
    super(props)
    // Beginning of the code-splitting script-reload work around.
    this.state = { sketchElem: null }
  }

  render() {
    const { sketchData } = this.props

    return (
      <Layout title={sketchData.name}>
        <canvas
          id="sketch-canvas"
          className="sketch-canvas"
          width="800"
          height="800"
        />

        <h1 className="name">{sketchData.name}</h1>
        <p className="brief">{sketchData.brief}</p>
        <Link href={`/sketches/${sketchData.id}.js`}>
          <a>View Source</a>
        </Link>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: sketchData.contentHtml }}
        />

        <style jsx>{`
          .sketch-canvas {
            width: 92vw;
            max-width: 800px;

            box-shadow: 0 3px 8px hsla(0, 0%, 20%, 0.3);

            margin: 0 auto;
            display: block;
          }
        `}</style>
      </Layout>
    )
  }

  componentDidMount() {
    const sketchElem = document.createElement('script')
    sketchElem.type = 'module'

    // Uses a ?reloadfix=<TIMESPEC> query to force the browser to fully
    // reload the script, including the source.
    sketchElem.src = `/sketches/${
      this.props.sketchData.id
    }.js?reloadfix=${new Date().getTime()}`

    this.state.sketchElem = sketchElem

    document.body.appendChild(sketchElem)
  }

  componentWillUnmount() {
    if (this.state.sketchElem) {
      document.body.removeChild(this.state.sketchElem)
      this.state.sketchElem = null
    }
  }
}

export async function getStaticPaths() {
  const ids = getAllSketchIDs()

  const paths = ids.map((id) => {
    return {
      params: {
        id,
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const sketchData = await getSketchData(params.id)
  return {
    props: {
      sketchData,
    },
  }
}

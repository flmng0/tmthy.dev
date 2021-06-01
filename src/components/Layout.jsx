import Link from 'next/link'
import Head from 'next/head'

const siteName = "Tim's Portfolio"

export default ({ children, home, title }) => (
  <div className="container">
    <Head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="icon" href="/favicon.png" type="image/png" />
      <title>{`${title} | ${siteName}`}</title>
    </Head>

    <header className="header">
      <strong>
        <Link href="/">Tim's Portfolio</Link>
      </strong>
      <nav className="nav">
        <Link href="/">
          <a className="nav__link">Home</a>
        </Link>
        <Link href="/about/">
          <a className="nav__link">About</a>
        </Link>
      </nav>
    </header>

    {children}

    <footer></footer>

    <style jsx global>{`
        :root {
          font-size: 14px;
        }

        a {
          color: currentColor;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          line-height: 1.5;
        }

        body,
        body[data-theme='dark'] {
          --clr-main: hsl(323, 91%, 58%);
          --clr-accent: hsl(148, 91%, 58%);
          --clr-bg-primary: hsl(315, 15%, 18%);
          --clr-fg-primary: hsl(325, 90%, 97%);
        }

        body[data-theme='light'] {
          --clr-main: hsl(325, 88%, 66%);
          --clr-accent: hsl(148, 91%, 58%);
          --clr-bg-primary: hsl(0, 0%, 98%);
          --clr-fg-primary: hsl(150, 15%, 18%);
        }
      `}</style>

    <style jsx>{`
      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5em;
        height: 5em;
      }

      .nav__link + .nav__link {
        margin-left: 20px;
      }
    `}</style>
  </div>
)

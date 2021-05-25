export default function ProjectCard({ project }) {
  return (
    <>
      <section className="details">
        <span className="name">{project.name}</span>
        <p className="brief">{project.brief}</p>
      </section>
      <section className="links">
        <a href={project.source} className="button">
          Source
        </a>
        {project.type == 'Website' && (
          <a className="button" href={project.ref}>
            Website
          </a>
        )}
      </section>

      <style jsx>{`
        .name {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .brief {
          line-height: 1.75em;
        }

        .button {
          display: block;

          width: 100%;
          height: 2em;

          text-decoration: none;
          text-align: center;

          border-radius: 0.25em;
          border: 1px solid hsla(0, 0%, 20%, 0.2);

          transition: border-color 100ms linear;
        }

        .button:hover {
          border-color: hsla(0, 0%, 20%, 0.8);
        }

        .button + .button {
          margin-top: 0.75em;
        }
      `}</style>
    </>
  )
}

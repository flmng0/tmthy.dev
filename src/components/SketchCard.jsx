export default function SketchCard({ sketch }) {
  return (
    <>
      <section className="details">
        <span className="name">{sketch.name}</span>
        <p className="brief">{sketch.brief}</p>
      </section>

      <style jsx>{`
        .name {
          font-size: 1.5rem;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

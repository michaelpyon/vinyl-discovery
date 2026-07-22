import { getGenreColor } from "../data/genreColors"

export default function GenreFilter({ genres, activeGenres, onToggle, onClear }) {
  const hasActive = activeGenres.length > 0

  return (
    <section className="genre-filter" aria-label="Filter shops by genre">
      <div className="genre-filter__label">
        <span>Filter shops</span>
        <span>{hasActive ? `${activeGenres.length} selected` : "All genres"}</span>
      </div>
      <div className="genre-filter__inner">
        <button
          className={`genre-filter__tag ${!hasActive ? "genre-filter__tag--active" : ""}`}
          onClick={onClear}
          type="button"
          aria-pressed={!hasActive}
          style={{ "--genre-color": "var(--accent)" }}
        >
          All
        </button>
        {genres.map((genre) => {
          const isActive = activeGenres.includes(genre)
          return (
            <button
              key={genre}
              className={`genre-filter__tag ${isActive ? "genre-filter__tag--active" : ""}`}
              onClick={() => onToggle(genre)}
              type="button"
              aria-pressed={isActive}
              style={{ "--genre-color": getGenreColor(genre) }}
            >
              {genre}
            </button>
          )
        })}
      </div>
    </section>
  )
}

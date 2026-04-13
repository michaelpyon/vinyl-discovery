import { getGenreColor } from "../data/genreColors"

export default function GenreFilter({ genres, activeGenres, onToggle, onClear }) {
  const hasActive = activeGenres.length > 0

  return (
    <div className="genre-filter">
      <div className="genre-filter__inner">
        <button
          className={`genre-filter__tag ${!hasActive ? "genre-filter__tag--active" : ""}`}
          onClick={onClear}
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
              style={{ "--genre-color": getGenreColor(genre) }}
            >
              {genre}
            </button>
          )
        })}
      </div>
    </div>
  )
}

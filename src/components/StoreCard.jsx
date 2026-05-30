import { getGenreColor } from "../data/genreColors"

export default function StoreCard({ store, onClick, isActive }) {
  return (
    <button
      onClick={() => onClick(store)}
      className={`store-card ${isActive ? "store-card--active" : ""}`}
    >
      <div className="store-card__header">
        <h3 className="store-card__name">{store.name}</h3>
        <span className="store-card__rating" title="Curated editorial pick">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Curated
        </span>
      </div>

      <p className="store-card__location">
        {store.neighborhood} · {store.city}
      </p>

      {store.distance !== undefined && (
        <p className="store-card__distance">
          {store.distance < 1
            ? `${Math.round(store.distance * 1000)} m away`
            : `${Math.round(store.distance).toLocaleString()} km away`}
        </p>
      )}

      <div className="store-card__genres">
        {store.genres.map((genre) => (
          <span
            key={genre}
            className="genre-tag"
            style={{
              "--genre-color": getGenreColor(genre),
            }}
          >
            {genre}
          </span>
        ))}
      </div>

      <p className="store-card__vibe">{store.vibe}</p>
    </button>
  )
}

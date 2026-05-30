import { useState } from "react"
import { getGenreColor } from "../data/genreColors"

function buildShareUrl(store) {
  const url = new URL(window.location.href)
  url.searchParams.set("store", String(store.id))
  return url.toString()
}

function ShareButton({ store }) {
  const [label, setLabel] = useState("Copy link")

  function handleShare(e) {
    e.stopPropagation()
    const shareUrl = buildShareUrl(store)
    const shareText = `${store.name} - ${store.neighborhood}, ${store.city}`

    if (navigator.share) {
      navigator.share({ title: shareText, url: shareUrl }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setLabel("Copied!")
        setTimeout(() => setLabel("Copy link"), 2000)
      }).catch(() => {})
    }
  }

  return (
    <button className="store-card__share" onClick={handleShare} type="button">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      {label}
    </button>
  )
}

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

      {isActive && (
        <div className="store-card__actions">
          {store.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="store-card__website"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Visit website
            </a>
          )}
          <ShareButton store={store} />
        </div>
      )}
    </button>
  )
}

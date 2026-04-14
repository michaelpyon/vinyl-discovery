import { useMemo } from "react"
import StoreCard from "./StoreCard"
import StaffPick from "./StaffPick"
import { getRegionGenres } from "../data/stores"
import { getGenreColor } from "../data/genreColors"

// Haversine distance between two points in km
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function Sidebar({
  droppedPin,
  selectedStore,
  onStoreClick,
  onRandomPin,
  isOpen,
  onToggle,
  filteredStores = [],
}) {
  const nearbyStores = useMemo(() => {
    if (!droppedPin) return []
    return filteredStores
      .map((store) => ({
        ...store,
        distance: haversine(droppedPin.lat, droppedPin.lng, store.lat, store.lng),
      }))
      .filter((store) => store.distance <= 5000)
      .sort((a, b) => a.distance - b.distance)
  }, [droppedPin, filteredStores])

  const regionGenres = useMemo(() => {
    return getRegionGenres(nearbyStores)
  }, [nearbyStores])

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__inner">
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
              <line x1="12" y1="2" x2="12" y2="6" />
            </svg>
            <h1>CrateDigger</h1>
          </div>
          <p className="sidebar__tagline">
            Music discovery through vinyl culture
          </p>
        </div>

        {/* Random Pin button */}
        <button className="random-pin-btn" onClick={onRandomPin}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Drop a Random Pin
        </button>

        {/* Content */}
        {!droppedPin && !selectedStore && (
          <div className="sidebar__empty">
            <div className="sidebar__empty-vinyl">
              <div className="vinyl-spin">
                <div className="vinyl-spin__grooves" />
                <div className="vinyl-spin__label" />
              </div>
            </div>
            <p>Tap the globe or drop a random pin to start digging.</p>
            <p className="sidebar__empty-sub">
              Discover record stores, local genres, and staff picks from around
              the world.
            </p>
          </div>
        )}

        {/* Region genres */}
        {droppedPin && regionGenres.length > 0 && (
          <div className="sidebar__section">
            <h2 className="sidebar__section-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Neighborhood Sound
            </h2>
            <div className="genre-cloud">
              {regionGenres.slice(0, 8).map((genre, i) => (
                <span
                  key={genre}
                  className="genre-tag genre-tag--lg"
                  style={{
                    "--genre-color": getGenreColor(genre),
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Nearby stores */}
        {droppedPin && (
          <div className="sidebar__section">
            <h2 className="sidebar__section-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
              Nearby Stores
              <span className="store-count">{nearbyStores.length}</span>
            </h2>
            <div className="store-list">
              {nearbyStores.length === 0 ? (
                <p className="sidebar__no-results">
                  No stores found nearby. Try a different spot on the globe!
                </p>
              ) : (
                nearbyStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onClick={onStoreClick}
                    isActive={selectedStore?.id === store.id}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Staff Pick */}
        {selectedStore && (
          <div className="sidebar__section">
            <h2 className="sidebar__section-title">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Staff Pick
            </h2>
            <StaffPick store={selectedStore} />
          </div>
        )}

        {/* Footer */}
        <footer className="sidebar__footer">
          <p>
            CrateDigger. Built for vinyl lovers.
          </p>
        </footer>
      </div>

      {/* Mobile toggle */}
      <button className="sidebar__toggle" onClick={onToggle}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {isOpen ? (
            <path d="M15 18l-6-6 6-6" />
          ) : (
            <path d="M9 18l6-6-6-6" />
          )}
        </svg>
      </button>
    </aside>
  )
}

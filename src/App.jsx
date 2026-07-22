import { lazy, Suspense, useState, useCallback, useMemo, useRef, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import GenreFilter from "./components/GenreFilter"
import stores, { getAllGenres, getCities } from "./data/stores"

const Globe = lazy(() => import("./components/Globe"))

const allGenres = getAllGenres()
const allCities = getCities()

// Parse ?store=<id> from the current URL; returns the matching store or null.
function getStoreFromUrl() {
  const param = new URLSearchParams(window.location.search).get("store")
  if (!param) return null
  const id = parseInt(param, 10)
  if (!Number.isFinite(id)) return null
  return stores.find((s) => s.id === id) ?? null
}

// Push the ?store= param into the URL without adding a history entry.
function syncStoreToUrl(store) {
  const url = new URL(window.location.href)
  if (store) {
    url.searchParams.set("store", String(store.id))
  } else {
    url.searchParams.delete("store")
  }
  window.history.replaceState(null, "", url.toString())
}

export default function App() {
  const globeRef = useRef()
  const [droppedPin, setDroppedPin] = useState(() => {
    const s = getStoreFromUrl()
    return s ? { lat: s.lat, lng: s.lng } : null
  })
  const [selectedStore, setSelectedStore] = useState(() => getStoreFromUrl())
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    Boolean(getStoreFromUrl()) || window.matchMedia("(min-width: 769px)").matches
  )
  const [activeGenres, setActiveGenres] = useState([])

  // Filter stores based on selected genres
  const filteredStores = useMemo(() => {
    if (activeGenres.length === 0) return stores
    return stores.filter((store) =>
      store.genres.some((g) => activeGenres.includes(g))
    )
  }, [activeGenres])

  // Cities that have at least one store in the filtered set
  const filteredCities = useMemo(() => {
    if (activeGenres.length === 0) return allCities
    const cityLabels = new Set(filteredStores.map((s) => s.city))
    return allCities.filter((c) => cityLabels.has(c.label))
  }, [activeGenres, filteredStores])

  // Keep the URL in sync whenever selectedStore changes
  useEffect(() => {
    syncStoreToUrl(selectedStore)
  }, [selectedStore])

  const handlePinDrop = useCallback(({ lat, lng }) => {
    setDroppedPin({ lat, lng })
    setSelectedStore(null)
    setSidebarOpen(true)
  }, [])

  const handleStoreClick = useCallback((store) => {
    setSelectedStore(store)
    setDroppedPin({ lat: store.lat, lng: store.lng })
    setSidebarOpen(true)
    if (globeRef.current) {
      globeRef.current.flyTo(store.lat, store.lng, 1.5, 1200)
    }
  }, [])

  const handleGenreToggle = useCallback((genre) => {
    const next = activeGenres.includes(genre)
      ? activeGenres.filter((item) => item !== genre)
      : [...activeGenres, genre]

    setActiveGenres(next)
    if (
      selectedStore &&
      next.length > 0 &&
      !selectedStore.genres.some((item) => next.includes(item))
    ) {
      setSelectedStore(null)
    }
  }, [activeGenres, selectedStore])

  const handleGenreClear = useCallback(() => {
    setActiveGenres([])
  }, [])

  // Surprise Me: pick a random city from filtered set, fly to it, drop a pin
  const handleSurpriseMe = useCallback(() => {
    const cities = filteredCities.length > 0 ? filteredCities : allCities
    const city = cities[Math.floor(Math.random() * cities.length)]
    setDroppedPin({ lat: city.lat, lng: city.lng })
    setSelectedStore(null)
    setSidebarOpen(true)
    if (globeRef.current) {
      globeRef.current.flyTo(city.lat, city.lng, 1.5, 1200)
    }
  }, [filteredCities])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  return (
    <div className="app">
      <main className="map-stage" aria-label="Interactive record shop map">
        <div className="map-masthead">
          <p className="map-masthead__eyebrow">CrateDigger</p>
          <p className="map-masthead__stat">
            {filteredStores.length} curated shops · {allCities.length} cities
          </p>
        </div>
        <Suspense fallback={<div className="globe-shell-loading" role="status">Tuning the globe...</div>}>
          <Globe
            ref={globeRef}
            onPinDrop={handlePinDrop}
            onStoreClick={handleStoreClick}
            droppedPin={droppedPin}
            filteredStores={filteredStores}
          />
        </Suspense>
      </main>
      <GenreFilter
        genres={allGenres}
        activeGenres={activeGenres}
        onToggle={handleGenreToggle}
        onClear={handleGenreClear}
      />
      <button className="surprise-btn" onClick={handleSurpriseMe} type="button">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Surprise Me
      </button>
      <Sidebar
        droppedPin={droppedPin}
        selectedStore={selectedStore}
        onStoreClick={handleStoreClick}
        onRandomPin={handleSurpriseMe}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        filteredStores={filteredStores}
      />
    </div>
  )
}

import { useState, useCallback, useMemo, useRef } from "react"
import Globe from "./components/Globe"
import Sidebar from "./components/Sidebar"
import GenreFilter from "./components/GenreFilter"
import stores, { getAllGenres, getCities } from "./data/stores"

const allGenres = getAllGenres()
const allCities = getCities()

export default function App() {
  const globeRef = useRef()
  const [droppedPin, setDroppedPin] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
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

  const handlePinDrop = useCallback(({ lat, lng }) => {
    setDroppedPin({ lat, lng })
    setSelectedStore(null)
    setSidebarOpen(true)
  }, [])

  const handleStoreClick = useCallback((store) => {
    setSelectedStore(store)
    setDroppedPin({ lat: store.lat, lng: store.lng })
    setSidebarOpen(true)
  }, [])

  const handleGenreToggle = useCallback((genre) => {
    setActiveGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }, [])

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
      <Globe
        ref={globeRef}
        onPinDrop={handlePinDrop}
        onStoreClick={handleStoreClick}
        droppedPin={droppedPin}
        filteredStores={filteredStores}
      />
      <GenreFilter
        genres={allGenres}
        activeGenres={activeGenres}
        onToggle={handleGenreToggle}
        onClear={handleGenreClear}
      />
      <button className="surprise-btn" onClick={handleSurpriseMe}>
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

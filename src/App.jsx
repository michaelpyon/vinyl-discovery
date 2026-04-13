import { useState, useCallback, useMemo } from "react"
import Globe from "./components/Globe"
import Sidebar from "./components/Sidebar"
import GenreFilter from "./components/GenreFilter"
import stores, { getAllGenres } from "./data/stores"

const allGenres = getAllGenres()

export default function App() {
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

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  return (
    <div className="app">
      <Globe
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
      <Sidebar
        droppedPin={droppedPin}
        selectedStore={selectedStore}
        onStoreClick={handleStoreClick}
        onRandomPin={null}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        filteredStores={filteredStores}
      />
    </div>
  )
}

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import ReactGlobe from "react-globe.gl"
import { getGenreColor } from "../data/genreColors"

const GLOBE_IMAGE = "//unpkg.com/three-globe/example/img/earth-night.jpg"
const BUMP_IMAGE = "//unpkg.com/three-globe/example/img/earth-topology.png"

// Detect WebGL support
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    return false
  }
}

// Fallback: city grid the user can click to drop a pin
const FALLBACK_CITIES = [
  { lat: 40.7128, lng: -74.006, label: "New York", emoji: "🗽" },
  { lat: 51.5074, lng: -0.1278, label: "London", emoji: "🎡" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo", emoji: "⛩️" },
  { lat: 52.52, lng: 13.405, label: "Berlin", emoji: "🐻" },
  { lat: -37.8136, lng: 144.9631, label: "Melbourne", emoji: "🦘" },
  { lat: 48.8566, lng: 2.3522, label: "Paris", emoji: "🗼" },
  { lat: 45.5231, lng: -122.6765, label: "Portland", emoji: "🌲" },
  { lat: 18.012, lng: -76.7936, label: "Kingston", emoji: "🎵" },
  { lat: 6.5244, lng: 3.3792, label: "Lagos", emoji: "🌍" },
  { lat: 36.1627, lng: -86.7816, label: "Nashville", emoji: "🎸" },
  { lat: -23.5505, lng: -46.6333, label: "São Paulo", emoji: "🌴" },
  { lat: 37.5665, lng: 126.978, label: "Seoul", emoji: "🏙️" },
  { lat: 23.1136, lng: -82.3666, label: "Havana", emoji: "🎺" },
  { lat: 34.0522, lng: -118.2437, label: "Los Angeles", emoji: "🌅" },
  { lat: 41.8781, lng: -87.6298, label: "Chicago", emoji: "🎷" },
  { lat: 28.6139, lng: 77.209, label: "New Delhi", emoji: "🕌" },
]

function GlobeFallback({ onPinDrop, onStoreClick }) {
  return (
    <div className="globe-container globe-fallback">
      <div className="fallback-inner">
        <div className="fallback-header">
          <div className="fallback-icon">🌍</div>
          <h2 className="fallback-title">Explore by City</h2>
          <p className="fallback-subtitle">
            Pick a city to discover nearby record stores
          </p>
        </div>
        <div className="fallback-grid">
          {FALLBACK_CITIES.map((city) => (
            <button
              key={city.label}
              className="fallback-city-btn"
              onClick={() => onPinDrop({ lat: city.lat, lng: city.lng })}
            >
              <span className="fallback-city-emoji">{city.emoji}</span>
              <span className="fallback-city-name">{city.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Globe({ onPinDrop, onStoreClick, droppedPin, filteredStores = [] }) {
  const globeRef = useRef()
  const containerRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [webglSupported] = useState(() => hasWebGL())
  const [globeReady, setGlobeReady] = useState(false)

  // If no WebGL, render the fallback immediately
  if (!webglSupported) {
    return <GlobeFallback onPinDrop={onPinDrop} onStoreClick={onStoreClick} />
  }

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Called by react-globe.gl once the Three.js scene + controls are ready.
  // This is the correct place to configure the globe — globeRef.current is
  // guaranteed to be populated here (unlike a useEffect([]) which fires
  // before ReactGlobe has mounted when dimensions start at 0).
  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableDamping = true
    globe.pointOfView({ lat: 30, lng: -20, altitude: 2.2 }, 0)
    setGlobeReady(true)
  }, [])

  // Stop rotation on interaction
  const stopRotation = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false
    }
  }, [])

  // Handle globe click — drop a pin
  const handleGlobeClick = useCallback(
    ({ lat, lng }) => {
      stopRotation()
      onPinDrop({ lat, lng })
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 800)
      }
    },
    [onPinDrop, stopRotation]
  )

  // Store points data for the globe
  const storePoints = useMemo(
    () =>
      filteredStores.map((s) => ({
        lat: s.lat,
        lng: s.lng,
        size: 0.06,
        color: getGenreColor(s.genres[0]),
        store: s,
        label: s.name,
      })),
    [filteredStores]
  )

  // Dropped pin marker
  const pinPoints = useMemo(() => {
    if (!droppedPin) return []
    return [
      {
        lat: droppedPin.lat,
        lng: droppedPin.lng,
        size: 0.12,
        color: "#ffffff",
        label: "Your Pin",
      },
    ]
  }, [droppedPin])

  // Ring around dropped pin
  const ringData = useMemo(() => {
    if (!droppedPin) return []
    return [
      {
        lat: droppedPin.lat,
        lng: droppedPin.lng,
        maxR: 8,
        propagationSpeed: 2,
        repeatPeriod: 1200,
      },
    ]
  }, [droppedPin])

  const allPoints = useMemo(
    () => [...storePoints, ...pinPoints],
    [storePoints, pinPoints]
  )

  const handlePointClick = useCallback(
    (point) => {
      stopRotation()
      if (point.store) {
        onStoreClick(point.store)
        if (globeRef.current) {
          globeRef.current.pointOfView(
            { lat: point.lat, lng: point.lng, altitude: 1.2 },
            800
          )
        }
      }
    },
    [onStoreClick, stopRotation]
  )

  return (
    <div ref={containerRef} className="globe-container">
      {dimensions.width > 0 && (
        <ReactGlobe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={GLOBE_IMAGE}
          bumpImageUrl={BUMP_IMAGE}
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#f97316"
          atmosphereAltitude={0.15}
          pointsData={allPoints}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={(d) => (d.label === "Your Pin" ? 0.04 : 0.01)}
          pointRadius="size"
          pointColor="color"
          pointLabel="label"
          onPointClick={handlePointClick}
          onGlobeClick={handleGlobeClick}
          onGlobeReady={handleGlobeReady}
          ringsData={ringData}
          ringLat="lat"
          ringLng="lng"
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringColor={() => "#f97316"}
          animateIn={true}
        />
      )}
      {/* Loading overlay — visible until globe textures are ready */}
      {!globeReady && dimensions.width > 0 && (
        <div className="globe-loading">
          <div className="globe-loading-spinner" />
          <span className="globe-loading-text">Loading globe…</span>
        </div>
      )}
      <div className="globe-hint">Tap anywhere on the globe to drop a pin</div>
    </div>
  )
}

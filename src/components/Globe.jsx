import { useRef, useEffect, useState, useCallback, useMemo, useImperativeHandle, forwardRef } from "react"
import ReactGlobe from "react-globe.gl"
import { getGenreColor } from "../data/genreColors"

const GLOBE_IMAGE = "//unpkg.com/three-globe/example/img/earth-night.jpg"
const BUMP_IMAGE = "//unpkg.com/three-globe/example/img/earth-topology.png"
const IDLE_TIMEOUT = 5000 // Resume rotation after 5s of no interaction

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
  { lat: 40.7128, lng: -74.006, label: "New York", emoji: "\u{1F5FD}" },
  { lat: 51.5074, lng: -0.1278, label: "London", emoji: "\u{1F3A1}" },
  { lat: 35.6762, lng: 139.6503, label: "Tokyo", emoji: "\u26E9\uFE0F" },
  { lat: 52.52, lng: 13.405, label: "Berlin", emoji: "\u{1F43B}" },
  { lat: -37.8136, lng: 144.9631, label: "Melbourne", emoji: "\u{1F998}" },
  { lat: 48.8566, lng: 2.3522, label: "Paris", emoji: "\u{1F5FC}" },
  { lat: 45.5231, lng: -122.6765, label: "Portland", emoji: "\u{1F332}" },
  { lat: 18.012, lng: -76.7936, label: "Kingston", emoji: "\u{1F3B5}" },
  { lat: 6.5244, lng: 3.3792, label: "Lagos", emoji: "\u{1F30D}" },
  { lat: 36.1627, lng: -86.7816, label: "Nashville", emoji: "\u{1F3B8}" },
  { lat: -23.5505, lng: -46.6333, label: "S\u00E3o Paulo", emoji: "\u{1F334}" },
  { lat: 37.5665, lng: 126.978, label: "Seoul", emoji: "\u{1F3D9}\uFE0F" },
  { lat: 23.1136, lng: -82.3666, label: "Havana", emoji: "\u{1F3BA}" },
  { lat: 34.0522, lng: -118.2437, label: "Los Angeles", emoji: "\u{1F305}" },
  { lat: 41.8781, lng: -87.6298, label: "Chicago", emoji: "\u{1F3B7}" },
  { lat: 28.6139, lng: 77.209, label: "New Delhi", emoji: "\u{1F54C}" },
]

function GlobeFallback({ onPinDrop }) {
  return (
    <div className="globe-container globe-fallback">
      <div className="fallback-inner">
        <div className="fallback-header">
          <div className="fallback-icon">{"\u{1F30D}"}</div>
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

const Globe = forwardRef(function Globe(
  { onPinDrop, onStoreClick, droppedPin, filteredStores = [] },
  ref
) {
  const globeRef = useRef()
  const containerRef = useRef()
  const idleTimerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [webglSupported] = useState(() => hasWebGL())
  const [globeReady, setGlobeReady] = useState(false)

  // Expose flyTo method to parent
  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, altitude = 1.5, duration = 800) {
      if (globeRef.current) {
        stopRotation()
        globeRef.current.pointOfView({ lat, lng, altitude }, duration)
      }
    },
  }))

  // If no WebGL, render the fallback immediately
  if (!webglSupported) {
    return <GlobeFallback onPinDrop={onPinDrop} />
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
  const handleGlobeReady = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableDamping = true
    globe.pointOfView({ lat: 30, lng: -20, altitude: 2.2 }, 0)
    setGlobeReady(true)
  }, [])

  // Stop rotation and schedule a restart after idle
  const stopRotation = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false
    }
    // Clear any existing idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  // Schedule rotation to resume after idle timeout
  const scheduleRotationResume = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    idleTimerRef.current = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true
      }
    }, IDLE_TIMEOUT)
  }, [])

  // Stop rotation on interaction, restart after idle
  const handleInteraction = useCallback(() => {
    stopRotation()
    scheduleRotationResume()
  }, [stopRotation, scheduleRotationResume])

  // Listen for mouse/touch events on the container to detect interaction
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const events = ["mousedown", "mousemove", "wheel", "touchstart", "touchmove"]
    events.forEach((evt) => el.addEventListener(evt, handleInteraction, { passive: true }))

    return () => {
      events.forEach((evt) => el.removeEventListener(evt, handleInteraction))
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [handleInteraction])

  // Handle globe click - drop a pin
  const handleGlobeClick = useCallback(
    ({ lat, lng }) => {
      stopRotation()
      scheduleRotationResume()
      onPinDrop({ lat, lng })
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 800)
      }
    },
    [onPinDrop, stopRotation, scheduleRotationResume]
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
      scheduleRotationResume()
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
    [onStoreClick, stopRotation, scheduleRotationResume]
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
      {/* Loading overlay */}
      {!globeReady && dimensions.width > 0 && (
        <div className="globe-loading">
          <div className="globe-loading-spinner" />
          <span className="globe-loading-text">Loading globe...</span>
        </div>
      )}
      <div className="globe-hint">Tap anywhere on the globe to drop a pin</div>
    </div>
  )
})

export default Globe

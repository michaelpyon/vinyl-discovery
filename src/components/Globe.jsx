import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import ReactGlobe from "react-globe.gl"
import stores from "../data/stores"
import { getGenreColor } from "../data/genreColors"

const GLOBE_IMAGE = "//unpkg.com/three-globe/example/img/earth-night.jpg"
const BUMP_IMAGE = "//unpkg.com/three-globe/example/img/earth-topology.png"

export default function Globe({ onPinDrop, onStoreClick, droppedPin }) {
  const globeRef = useRef()
  const containerRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

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

  // Auto-rotate and initial position
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableDamping = true
    globe.pointOfView({ lat: 30, lng: -20, altitude: 2.2 }, 0)
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
      // Fly to the clicked location
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 800)
      }
    },
    [onPinDrop, stopRotation]
  )

  // Store points data for the globe
  const storePoints = useMemo(
    () =>
      stores.map((s) => ({
        lat: s.lat,
        lng: s.lng,
        size: 0.06,
        color: getGenreColor(s.genres[0]),
        store: s,
        label: s.name,
      })),
    []
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

  // Combine store points and pin
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
      <div className="globe-hint">Tap anywhere on the globe to drop a pin</div>
    </div>
  )
}

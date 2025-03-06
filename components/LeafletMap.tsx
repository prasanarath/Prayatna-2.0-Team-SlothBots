"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
// Fix for leaflet compatibility with Next.js
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

interface MapProps {
  startPoint?: [number, number]
  endPoint?: [number, number]
  route?: [number, number][]
  ports?: Port[]
}

interface Port {
  id: string
  name: string
  country: string
  position: [number, number]
}

// Helper function to validate coordinates
const isValidLatLng = (latLng?: [number, number]): boolean => {
  if (!latLng) return false
  const [lat, lng] = latLng
  
  // Check if both values are numbers and within valid ranges
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' && 
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && 
    lat <= 90 && 
    lng >= -180 && 
    lng <= 180
  )
}

export default function LeafletMap({ startPoint, endPoint, route, ports = [] }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Default view coordinates (middle of the Atlantic Ocean)
  const defaultCenter: [number, number] = [25, -40]
  const defaultZoom = 3

  // No need for this since we're using leaflet-defaulticon-compatibility
  // useEffect(() => {
  //   // Fix for the marker icon issue in production
  //   delete (L.Icon.Default.prototype as any)._getIconUrl
  //   L.Icon.Default.mergeOptions({
  //     iconRetinaUrl: "/marker-icon-2x.png",
  //     iconUrl: "/marker-icon.png",
  //     shadowUrl: "/marker-shadow.png",
  //   })
  // }, [])

  useEffect(() => {
    if (mapRef.current && route && route.length > 0) {
      // Validate each point in the route
      const validRoutePoints = route.filter(isValidLatLng)
      
      if (validRoutePoints.length > 0) {
        const bounds = L.latLngBounds(validRoutePoints)
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [route])

  // Filter out any invalid ports
  const validPorts = ports.filter(port => isValidLatLng(port.position))

  return (
    <div className="h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {isValidLatLng(startPoint) && (
          <Marker position={startPoint as [number, number]}>
            <Popup>Starting Point</Popup>
          </Marker>
        )}
        
        {isValidLatLng(endPoint) && (
          <Marker position={endPoint as [number, number]}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        
        {route && route.length > 0 && (
          <>
            <Polyline
              positions={route.filter(isValidLatLng)}
              color="#0077B6"
              weight={3}
              opacity={0.8}
              smoothFactor={1}
            />
            
            {/* Add waypoint markers for more detailed view of the route */}
            {route.filter(isValidLatLng).map((point, index) => {
              // Only show waypoints, not start/end
              if (index > 0 && index < route.length - 1) {
                return (
                  <Marker 
                    key={`waypoint-${index}`} 
                    position={point}
                    icon={new L.Icon({
                      iconUrl: '/marker-icon.png',
                      iconSize: [15, 24],   // Smaller than default
                      iconAnchor: [7, 24],
                      popupAnchor: [1, -24],
                    })}
                  >
                    <Popup>Waypoint {index}</Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </>
        )}
        
        {validPorts.map((port) => (
          <Marker key={port.id} position={port.position}>
            <Popup>
              {port.name}, {port.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 
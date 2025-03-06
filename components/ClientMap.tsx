"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Define types for the map component
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

// Create a dynamic Map component that includes all Leaflet-related code
// Important: Using dynamic import with no SSR to avoid the "render is not a function" error
const DynamicMap = dynamic(
  () => import('./LeafletMap').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-gray-600 dark:text-gray-300">Loading map...</div>
      </div>
    ),
  }
)

export default function ClientMap(props: MapProps) {
  // Use isMounted state to ensure component only renders on client side
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render the map after the component has mounted on the client
  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-gray-600 dark:text-gray-300">Loading map...</div>
      </div>
    )
  }

  return <DynamicMap {...props} />
} 
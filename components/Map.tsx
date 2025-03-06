import ClientMap from './ClientMap'

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

export default function Map(props: MapProps) {
  return <ClientMap {...props} />
}


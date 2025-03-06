import { NextResponse } from 'next/server'

// Port data
const ports = [
  { id: 1, name: "Rotterdam", country: "Netherlands", coordinates: { lat: 51.9225, lng: 4.47917 } },
  { id: 2, name: "Singapore", country: "Singapore", coordinates: { lat: 1.29027, lng: 103.851 } },
  { id: 3, name: "Shanghai", country: "China", coordinates: { lat: 31.2304, lng: 121.474 } },
  { id: 4, name: "Los Angeles", country: "United States", coordinates: { lat: 33.7701, lng: -118.1937 } },
  { id: 5, name: "Dubai", country: "UAE", coordinates: { lat: 25.2048, lng: 55.2708 } },
  { id: 6, name: "Hamburg", country: "Germany", coordinates: { lat: 53.5511, lng: 9.9937 } },
  { id: 7, name: "Mumbai", country: "India", coordinates: { lat: 18.9750, lng: 72.8258 } },
  { id: 8, name: "Tokyo", country: "Japan", coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: 9, name: "Sydney", country: "Australia", coordinates: { lat: -33.8688, lng: 151.2093 } },
  { id: 10, name: "Cape Town", country: "South Africa", coordinates: { lat: -33.9249, lng: 18.4241 } }
]

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return NextResponse.json(ports)
} 
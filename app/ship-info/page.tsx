"use client"

import { useState, useEffect, useRef } from "react"
import { Ship, Fuel, Anchor, Package, Wrench, AlertTriangle, Search, MapPin, Navigation } from "lucide-react"

// Port data will be fetched from API
interface Port {
  id: number
  name: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface ShipData {
  id: number
  name: string
  type: string
  imo: string
  flag: string
  yearBuilt: number
  length: number
  beam: number
  draft: number
  displacement: number
  deadweight: number
  capacity: string
  engine: string
  power: string
  speed: number
  fuelCapacity: number
  fuelConsumption: {
    atSea: number
    inPort: number
  }
  currentFuel: number
  maintenanceStatus: {
    engine: string
    hull: string
    propulsion: string
    navigation: string
    safety: string
  }
  alerts: Array<{
    type: string
    message: string
    severity: string
  }>
  cargo: {
    loaded: number
    capacity: number
    details: string
  }
  currentVoyage: {
    departure: string
    destination: string
    departureDate: string
    estimatedArrival: string
    progress: number
  }
  route: string[]
}

export default function ShipInfo() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ports, setPorts] = useState<Port[]>([])
  const [ships, setShips] = useState<ShipData[]>([])
  const [selectedShip, setSelectedShip] = useState<ShipData | null>(null)
  const [startPoint, setStartPoint] = useState("")
  const [endPoint, setEndPoint] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [filteredPorts, setFilteredPorts] = useState<Port[]>([])
  const [showStartDropdown, setShowStartDropdown] = useState(false)
  const [showEndDropdown, setShowEndDropdown] = useState(false)
  const [filteredShips, setFilteredShips] = useState<ShipData[]>([])

  // Add refs for handling click outside
  const startDropdownRef = useRef<HTMLDivElement>(null)
  const endDropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (startDropdownRef.current && !startDropdownRef.current.contains(event.target as Node)) {
        setShowStartDropdown(false)
      }
      if (endDropdownRef.current && !endDropdownRef.current.contains(event.target as Node)) {
        setShowEndDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch ports and ships data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Replace these URLs with your actual API endpoints
        const [portsResponse, shipsResponse] = await Promise.all([
          fetch('/api/ports'),
          fetch('/api/ships')
        ])

        if (!portsResponse.ok || !shipsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const portsData = await portsResponse.json()
        const shipsData = await shipsResponse.json()

        setPorts(portsData)
        setShips(shipsData)
        setFilteredShips(shipsData)
        if (shipsData.length > 0) {
          setSelectedShip(shipsData[0])
        }
        setFilteredPorts(portsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to format a date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Function to get severity color class
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  // Calculate remaining voyage days
  const calculateRemainingDays = (ship: ShipData) => {
    const now = new Date()
    const arrival = new Date(ship.currentVoyage.estimatedArrival)
    const diffTime = arrival.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Filter ports based on search input
  const filterPorts = (input: string) => {
    if (!input) return ports
    const searchTerm = input.toLowerCase()
    return ports.filter(
      port =>
        port.name.toLowerCase().includes(searchTerm) ||
        port.country.toLowerCase().includes(searchTerm)
    )
  }

  // Handle port selection
  const handlePortSelection = (port: Port, isStart: boolean) => {
    if (isStart) {
      setStartPoint(port.name)
      setTimeout(() => setShowStartDropdown(false), 100)
    } else {
      setEndPoint(port.name)
      setTimeout(() => setShowEndDropdown(false), 100)
    }
  }

  // Handle search input change
  const handleSearchInputChange = (input: string, isStart: boolean) => {
    const filtered = filterPorts(input)
    setFilteredPorts(filtered)
    if (isStart) {
      setStartPoint(input)
      setShowStartDropdown(true)
    } else {
      setEndPoint(input)
      setShowEndDropdown(true)
    }
  }

  // Filter ships based on route
  useEffect(() => {
    if (!startPoint && !endPoint) {
      setFilteredShips(ships)
      return
    }

    const filtered = ships.filter(ship => {
      const matchesStart = !startPoint || 
        ship.route[0].toLowerCase().includes(startPoint.toLowerCase())
      const matchesEnd = !endPoint || 
        ship.route[1].toLowerCase().includes(endPoint.toLowerCase())
      return matchesStart && matchesEnd
    })

    setFilteredShips(filtered)
    if (filtered.length > 0 && (!selectedShip || !filtered.includes(selectedShip))) {
      setSelectedShip(filtered[0])
    }
  }, [startPoint, endPoint, ships, selectedShip])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ship information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-red-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed w-full top-0 bg-white dark:bg-gray-800 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Sign In
              </button>
            </div>
            <div className="flex items-center">
              <Ship className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Straw-hat-compass</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with padding for fixed navbar */}
      <div className="pt-16 flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Ship className="h-8 w-8 mr-2 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ship Information</h1>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Search Route</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Point */}
            <div className="relative" ref={startDropdownRef}>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                Start Point
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={startPoint}
                  onChange={(e) => handleSearchInputChange(e.target.value, true)}
                  onFocus={() => setShowStartDropdown(true)}
                  placeholder="Enter start port..."
                  className="w-full py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-300" />
              </div>
              {showStartDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredPorts.map((port) => (
                      <li
                        key={port.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handlePortSelection(port, true)
                        }}
                      >
                        <span className="font-medium text-black dark:text-white">{port.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                          {port.country}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* End Point */}
            <div className="relative" ref={endDropdownRef}>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">
                End Point
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={endPoint}
                  onChange={(e) => handleSearchInputChange(e.target.value, false)}
                  onFocus={() => setShowEndDropdown(true)}
                  placeholder="Enter destination port..."
                  className="w-full py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-500 dark:text-gray-300" />
              </div>
              {showEndDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
                  <ul className="max-h-60 overflow-auto py-1">
                    {filteredPorts.map((port) => (
                      <li
                        key={port.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handlePortSelection(port, false)
                        }}
                      >
                        <span className="font-medium text-black dark:text-white">{port.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                          {port.country}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ships List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {filteredShips.length > 0 ? (
            filteredShips.map((ship) => (
              <div
                key={ship.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedShip?.id === ship.id
                    ? "ring-2 ring-blue-500"
                    : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600"
                }`}
                onClick={() => setSelectedShip(ship)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">{ship.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{ship.type}</p>
                  </div>
                  <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black dark:text-white">Route:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {ship.route[0]} → {ship.route[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black dark:text-white">Progress:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{ship.currentVoyage.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${ship.currentVoyage.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-black dark:text-white">No ships found for the selected route</p>
            </div>
          )}
        </div>

        {/* Selected Ship Details */}
        {selectedShip && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ship Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
                <Ship className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Vessel Details
              </h2>

              <div className="space-y-3">
                {Object.entries({
                  Name: selectedShip.name,
                  Type: selectedShip.type,
                  "IMO Number": selectedShip.imo,
                  Flag: selectedShip.flag,
                  "Year Built": selectedShip.yearBuilt,
                  Length: `${selectedShip.length} m`,
                  Beam: `${selectedShip.beam} m`,
                  Draft: `${selectedShip.draft} m`,
                  Deadweight: `${selectedShip.deadweight} tons`,
                  Capacity: selectedShip.capacity,
                }).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="font-medium text-black dark:text-white">{key}:</span>
                    <span className="text-gray-600 dark:text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine & Performance Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
                <Wrench className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Engine & Performance
              </h2>

              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries({
                    "Engine Type": selectedShip.engine,
                    Power: selectedShip.power,
                    "Max Speed": `${selectedShip.speed} knots`,
                    "Fuel Consumption (at sea)": `${selectedShip.fuelConsumption.atSea} tons/day`,
                    "Fuel Consumption (in port)": `${selectedShip.fuelConsumption.inPort} tons/day`,
                  }).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="font-medium text-black dark:text-white">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2 text-black dark:text-white">Maintenance Status</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedShip.maintenanceStatus).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-black dark:text-white capitalize">{key}:</span>
                        <span className={`${
                          value === "Good" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                        } font-medium`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Voyage Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-black dark:text-white">
                <Anchor className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Current Voyage
              </h2>

              <div className="space-y-4">
                <div className="space-y-3">
                  {Object.entries({
                    Departure: selectedShip.currentVoyage.departure,
                    Destination: selectedShip.currentVoyage.destination,
                    "Departure Date": formatDate(selectedShip.currentVoyage.departureDate),
                    "Estimated Arrival": formatDate(selectedShip.currentVoyage.estimatedArrival),
                    "Days Remaining": `${calculateRemainingDays(selectedShip)} days`,
                  }).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="font-medium text-black dark:text-white">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-black dark:text-white">Voyage Progress:</span>
                    <span className="text-gray-600 dark:text-gray-300">{selectedShip.currentVoyage.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${selectedShip.currentVoyage.progress}%` }}
                    />
                  </div>
                </div>

                {selectedShip.alerts.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2 text-black dark:text-white">Alerts</h3>
                    <div className="space-y-2">
                      {selectedShip.alerts.map((alert, index) => (
                        <div
                          key={index}
                          className="flex items-start p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                        >
                          <AlertTriangle className={`h-5 w-5 mr-2 flex-shrink-0 ${getSeverityColor(alert.severity)}`} />
                          <div>
                            <span className="font-medium text-black dark:text-white">{alert.type}:</span>
                            <span className="ml-1 text-gray-600 dark:text-gray-300">{alert.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


import { NextResponse } from 'next/server'

// Ship data
const ships = [
  {
    id: 1,
    name: "Northern Star",
    type: "Container Ship",
    imo: "IMO 9876543",
    flag: "Panama",
    yearBuilt: 2018,
    length: 366,
    beam: 51,
    draft: 15.2,
    displacement: 165000,
    deadweight: 145000,
    capacity: "14,500 TEU",
    engine: "MAN B&W 12K98ME-C",
    power: "68,520 kW",
    speed: 25.5,
    fuelCapacity: 12500,
    fuelConsumption: {
      atSea: 210,
      inPort: 15,
    },
    currentFuel: 7850,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Maintenance Due in 45 days",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [
      { type: "Maintenance", message: "Engine maintenance due in 45 days", severity: "medium" },
      { type: "Fuel", message: "Refueling recommended at next port", severity: "low" },
    ],
    cargo: {
      loaded: 10200,
      capacity: 14500,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Rotterdam, Netherlands",
      destination: "Singapore",
      departureDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      estimatedArrival: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
      progress: 35,
    },
    route: ["Rotterdam", "Singapore"],
  },
  {
    id: 2,
    name: "Pacific Explorer",
    type: "Container Ship",
    imo: "IMO 9876544",
    flag: "Singapore",
    yearBuilt: 2019,
    length: 350,
    beam: 48,
    draft: 14.8,
    displacement: 155000,
    deadweight: 135000,
    capacity: "13,000 TEU",
    engine: "MAN B&W 11K90ME-C",
    power: "62,500 kW",
    speed: 24.5,
    fuelCapacity: 11000,
    fuelConsumption: {
      atSea: 190,
      inPort: 12,
    },
    currentFuel: 8500,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 11500,
      capacity: 13000,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Shanghai, China",
      destination: "Los Angeles, United States",
      departureDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      estimatedArrival: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      progress: 45,
    },
    route: ["Shanghai", "Los Angeles"],
  },
  {
    id: 3,
    name: "Arabian Pearl",
    type: "Container Ship",
    imo: "IMO 9876545",
    flag: "UAE",
    yearBuilt: 2020,
    length: 320,
    beam: 45,
    draft: 14.2,
    displacement: 145000,
    deadweight: 125000,
    capacity: "11,000 TEU",
    engine: "MAN B&W 10K80ME-C",
    power: "58,000 kW",
    speed: 23.5,
    fuelCapacity: 10000,
    fuelConsumption: {
      atSea: 175,
      inPort: 10,
    },
    currentFuel: 6500,
    maintenanceStatus: {
      engine: "Good",
      hull: "Maintenance Due in 30 days",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [
      { type: "Maintenance", message: "Hull maintenance due in 30 days", severity: "low" },
    ],
    cargo: {
      loaded: 9500,
      capacity: 11000,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Dubai, UAE",
      destination: "Hamburg, Germany",
      departureDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      estimatedArrival: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days from now
      progress: 40,
    },
    route: ["Dubai", "Hamburg"],
  },
  {
    id: 4,
    name: "Tokyo Voyager",
    type: "Container Ship",
    imo: "IMO 9876546",
    flag: "Japan",
    yearBuilt: 2021,
    length: 340,
    beam: 46,
    draft: 14.5,
    displacement: 150000,
    deadweight: 130000,
    capacity: "12,000 TEU",
    engine: "MAN B&W 11K85ME-C",
    power: "60,000 kW",
    speed: 24.0,
    fuelCapacity: 10500,
    fuelConsumption: {
      atSea: 180,
      inPort: 11,
    },
    currentFuel: 7000,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Maintenance Due in 60 days",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 10000,
      capacity: 12000,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Tokyo, Japan",
      destination: "Mumbai, India",
      departureDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      estimatedArrival: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
      progress: 25,
    },
    route: ["Tokyo", "Mumbai"],
  },
  {
    id: 5,
    name: "Cape Runner",
    type: "Container Ship",
    imo: "IMO 9876547",
    flag: "South Africa",
    yearBuilt: 2019,
    length: 330,
    beam: 45,
    draft: 14.0,
    displacement: 140000,
    deadweight: 120000,
    capacity: "10,500 TEU",
    engine: "MAN B&W 10K75ME-C",
    power: "55,000 kW",
    speed: 23.0,
    fuelCapacity: 9500,
    fuelConsumption: {
      atSea: 170,
      inPort: 10,
    },
    currentFuel: 8000,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Maintenance Due in 15 days",
    },
    alerts: [
      { type: "Maintenance", message: "Safety equipment check due in 15 days", severity: "medium" },
    ],
    cargo: {
      loaded: 9000,
      capacity: 10500,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Cape Town, South Africa",
      destination: "Sydney, Australia",
      departureDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      estimatedArrival: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // 16 days from now
      progress: 50,
    },
    route: ["Cape Town", "Sydney"],
  },
  {
    id: 6,
    name: "Singapore Express",
    type: "Container Ship",
    imo: "IMO 9876548",
    flag: "Singapore",
    yearBuilt: 2020,
    length: 345,
    beam: 47,
    draft: 14.6,
    displacement: 152000,
    deadweight: 132000,
    capacity: "12,500 TEU",
    engine: "MAN B&W 11K88ME-C",
    power: "61,000 kW",
    speed: 24.2,
    fuelCapacity: 10800,
    fuelConsumption: {
      atSea: 185,
      inPort: 12,
    },
    currentFuel: 7200,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 10500,
      capacity: 12500,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Singapore",
      destination: "Rotterdam",
      departureDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedArrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 30,
    },
    route: ["Singapore", "Rotterdam"],
  },
  {
    id: 7,
    name: "Mumbai Star",
    type: "Container Ship",
    imo: "IMO 9876549",
    flag: "India",
    yearBuilt: 2021,
    length: 335,
    beam: 46,
    draft: 14.3,
    displacement: 148000,
    deadweight: 128000,
    capacity: "11,500 TEU",
    engine: "MAN B&W 11K82ME-C",
    power: "59,000 kW",
    speed: 23.8,
    fuelCapacity: 10200,
    fuelConsumption: {
      atSea: 178,
      inPort: 11,
    },
    currentFuel: 6800,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 9800,
      capacity: 11500,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Mumbai",
      destination: "Tokyo",
      departureDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedArrival: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 28,
    },
    route: ["Mumbai", "Tokyo"],
  },
  {
    id: 8,
    name: "Sydney Mariner",
    type: "Container Ship",
    imo: "IMO 9876550",
    flag: "Australia",
    yearBuilt: 2019,
    length: 325,
    beam: 44,
    draft: 14.0,
    displacement: 142000,
    deadweight: 122000,
    capacity: "10,800 TEU",
    engine: "MAN B&W 10K78ME-C",
    power: "56,000 kW",
    speed: 23.2,
    fuelCapacity: 9800,
    fuelConsumption: {
      atSea: 172,
      inPort: 10,
    },
    currentFuel: 7500,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 9200,
      capacity: 10800,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Sydney",
      destination: "Cape Town",
      departureDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedArrival: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 42,
    },
    route: ["Sydney", "Cape Town"],
  },
  {
    id: 9,
    name: "LA Trader",
    type: "Container Ship",
    imo: "IMO 9876551",
    flag: "United States",
    yearBuilt: 2020,
    length: 338,
    beam: 46,
    draft: 14.4,
    displacement: 149000,
    deadweight: 129000,
    capacity: "11,800 TEU",
    engine: "MAN B&W 11K84ME-C",
    power: "59,500 kW",
    speed: 24.0,
    fuelCapacity: 10300,
    fuelConsumption: {
      atSea: 179,
      inPort: 11,
    },
    currentFuel: 7100,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 10000,
      capacity: 11800,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Los Angeles",
      destination: "Shanghai",
      departureDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedArrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 35,
    },
    route: ["Los Angeles", "Shanghai"],
  },
  {
    id: 10,
    name: "Hamburg Pioneer",
    type: "Container Ship",
    imo: "IMO 9876552",
    flag: "Germany",
    yearBuilt: 2021,
    length: 342,
    beam: 47,
    draft: 14.5,
    displacement: 151000,
    deadweight: 131000,
    capacity: "12,200 TEU",
    engine: "MAN B&W 11K86ME-C",
    power: "60,500 kW",
    speed: 24.3,
    fuelCapacity: 10600,
    fuelConsumption: {
      atSea: 182,
      inPort: 11,
    },
    currentFuel: 7300,
    maintenanceStatus: {
      engine: "Good",
      hull: "Good",
      propulsion: "Good",
      navigation: "Good",
      safety: "Good",
    },
    alerts: [],
    cargo: {
      loaded: 10500,
      capacity: 12200,
      details: "Mixed containerized cargo",
    },
    currentVoyage: {
      departure: "Hamburg",
      destination: "Dubai",
      departureDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedArrival: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 32,
    },
    route: ["Hamburg", "Dubai"],
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Update progress and dates for each ship
  const updatedShips = ships.map(ship => {
    const now = Date.now()
    const departure = new Date(ship.currentVoyage.departureDate).getTime()
    const arrival = new Date(ship.currentVoyage.estimatedArrival).getTime()
    const totalDuration = arrival - departure
    const elapsed = now - departure
    const progress = Math.min(Math.round((elapsed / totalDuration) * 100), 100)

    return {
      ...ship,
      currentVoyage: {
        ...ship.currentVoyage,
        progress
      }
    }
  })

  return NextResponse.json(updatedShips)
} 
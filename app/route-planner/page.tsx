"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Compass, Ship, Navigation, LifeBuoy } from "lucide-react"
import Map from "@/components/Map"
import WeatherInfo from "@/components/WeatherInfo"

// Mock data for ports
const mockPorts = [
  // Netherlands
  { id: "1", name: "Rotterdam", country: "Netherlands", position: [51.9225, 4.47917] as [number, number] },
  { id: "2", name: "Amsterdam", country: "Netherlands", position: [52.3676, 4.9041] as [number, number] },
  { id: "3", name: "Vlissingen", country: "Netherlands", position: [51.4536, 3.5963] as [number, number] },
  
  // Singapore
  { id: "4", name: "Singapore", country: "Singapore", position: [1.29027, 103.851] as [number, number] },
  { id: "5", name: "Jurong", country: "Singapore", position: [1.3273, 103.7216] as [number, number] },
  
  // China
  { id: "6", name: "Shanghai", country: "China", position: [31.2304, 121.474] as [number, number] },
  { id: "7", name: "Shenzhen", country: "China", position: [22.5431, 114.0579] as [number, number] },
  { id: "8", name: "Qingdao", country: "China", position: [36.0671, 120.3826] as [number, number] },
  { id: "9", name: "Guangzhou", country: "China", position: [23.1291, 113.2644] as [number, number] },
  
  // United States
  { id: "10", name: "Los Angeles", country: "United States", position: [33.7701, -118.1937] as [number, number] },
  { id: "11", name: "New York", country: "United States", position: [40.7128, -74.006] as [number, number] },
  { id: "12", name: "Houston", country: "United States", position: [29.7604, -95.3698] as [number, number] },
  { id: "13", name: "Seattle", country: "United States", position: [47.6062, -122.3321] as [number, number] },
  { id: "14", name: "Miami", country: "United States", position: [25.7617, -80.1918] as [number, number] },
  
  // Brazil
  { id: "15", name: "Santos", country: "Brazil", position: [-23.9618, -46.3322] as [number, number] },
  { id: "16", name: "Rio de Janeiro", country: "Brazil", position: [-22.9068, -43.1729] as [number, number] },
  { id: "17", name: "Salvador", country: "Brazil", position: [-12.9714, -38.5014] as [number, number] },
  
  // South Africa
  { id: "18", name: "Durban", country: "South Africa", position: [-29.8587, 31.0218] as [number, number] },
  { id: "19", name: "Cape Town", country: "South Africa", position: [-33.9249, 18.4241] as [number, number] },
  { id: "20", name: "Port Elizabeth", country: "South Africa", position: [-33.9608, 25.6022] as [number, number] },
  
  // Australia
  { id: "21", name: "Sydney", country: "Australia", position: [-33.8688, 151.2093] as [number, number] },
  { id: "22", name: "Melbourne", country: "Australia", position: [-37.8136, 144.9631] as [number, number] },
  { id: "23", name: "Brisbane", country: "Australia", position: [-27.4698, 153.0251] as [number, number] },
  { id: "24", name: "Perth", country: "Australia", position: [-31.9505, 115.8605] as [number, number] },
  
  // India
  { id: "25", name: "Mumbai", country: "India", position: [18.9387, 72.8353] as [number, number] },
  { id: "26", name: "Chennai", country: "India", position: [13.0827, 80.2707] as [number, number] },
  { id: "27", name: "Kolkata", country: "India", position: [22.5726, 88.3639] as [number, number] },
  
  // UAE
  { id: "28", name: "Dubai", country: "UAE", position: [25.2048, 55.2708] as [number, number] },
  { id: "29", name: "Abu Dhabi", country: "UAE", position: [24.4539, 54.3773] as [number, number] },
  
  // Germany
  { id: "30", name: "Hamburg", country: "Germany", position: [53.5511, 9.9937] as [number, number] },
  { id: "31", name: "Bremen", country: "Germany", position: [53.0793, 8.8017] as [number, number] },
  { id: "32", name: "Rostock", country: "Germany", position: [54.0924, 12.0991] as [number, number] },
  
  // Belgium
  { id: "33", name: "Antwerp", country: "Belgium", position: [51.2194, 4.4025] as [number, number] },
  { id: "34", name: "Zeebrugge", country: "Belgium", position: [51.3289, 3.2081] as [number, number] },
  
  // South Korea
  { id: "35", name: "Busan", country: "South Korea", position: [35.1796, 129.0756] as [number, number] },
  { id: "36", name: "Incheon", country: "South Korea", position: [37.4563, 126.7052] as [number, number] },
  
  // Japan
  { id: "37", name: "Tokyo", country: "Japan", position: [35.6762, 139.6503] as [number, number] },
  { id: "38", name: "Yokohama", country: "Japan", position: [35.4437, 139.6380] as [number, number] },
  { id: "39", name: "Osaka", country: "Japan", position: [34.6937, 135.5022] as [number, number] },
  
  // Canada
  { id: "40", name: "Vancouver", country: "Canada", position: [49.2827, -123.1207] as [number, number] },
  { id: "41", name: "Montreal", country: "Canada", position: [45.5017, -73.5673] as [number, number] },
  { id: "42", name: "Halifax", country: "Canada", position: [44.6476, -63.5728] as [number, number] },
  
  // UK
  { id: "43", name: "London", country: "United Kingdom", position: [51.5074, -0.1278] as [number, number] },
  { id: "44", name: "Southampton", country: "United Kingdom", position: [50.9097, -1.4044] as [number, number] },
  { id: "45", name: "Liverpool", country: "United Kingdom", position: [53.4084, -2.9916] as [number, number] },
  
  // Spain
  { id: "46", name: "Barcelona", country: "Spain", position: [41.3851, 2.1734] as [number, number] },
  { id: "47", name: "Valencia", country: "Spain", position: [39.4699, -0.3763] as [number, number] },
  { id: "48", name: "Algeciras", country: "Spain", position: [36.1275, -5.4512] as [number, number] },
]

// Mock function to generate route based on start and end points
const generateMockRoute = (
  start: [number, number],
  end: [number, number],
  routingOption: string,
): [number, number][] => {
  // Helper function to check if a point is on land (simplified approach)
  // In a real application, you would use a GeoJSON database of landmasses
  const isLand = (lat: number, lng: number): boolean => {
    // Major continents/landmasses defined as simplified rectangular regions
    // These are approximate bounding boxes for continents
    const landmasses = [
      // North America
      { minLat: 15, maxLat: 83, minLng: -170, maxLng: -50 },
      
      // South America
      { minLat: -58, maxLat: 12, minLng: -81, maxLng: -35 },
      
      // Africa
      { minLat: -35, maxLat: 37, minLng: -18, maxLng: 51 },
      
      // Europe
      { minLat: 36, maxLat: 71, minLng: -10, maxLng: 40 },
      
      // Asia
      { minLat: 0, maxLat: 77, minLng: 40, maxLng: 180 },
      
      // Australia
      { minLat: -43, maxLat: -10, minLng: 113, maxLng: 154 },
      
      // Antarctica
      { minLat: -90, maxLat: -60, minLng: -180, maxLng: 180 },
      
      // Greenland
      { minLat: 60, maxLat: 83, minLng: -73, maxLng: -12 },
      
      // Madagascar
      { minLat: -26, maxLat: -12, minLng: 43, maxLng: 50 },
      
      // Indonesia/Malaysia (simplified)
      { minLat: -10, maxLat: 6, minLng: 95, maxLng: 141 },
      
      // Japan (simplified)
      { minLat: 30, maxLat: 46, minLng: 130, maxLng: 146 },
      
      // New Zealand (simplified)
      { minLat: -47, maxLat: -34, minLng: 166, maxLng: 178 },
    ];
    
    // Check if point falls within any landmass
    for (const landmass of landmasses) {
      if (lat >= landmass.minLat && lat <= landmass.maxLat && 
          lng >= landmass.minLng && lng <= landmass.maxLng) {
        return true;
      }
    }
    
    // Additional check for more complex shapes using point-in-polygon would be better
    // but for simplicity we'll use some additional rules for key straits
    
    // Exclude known sea passages/straits from land check
    const seaPassages = [
      // Strait of Gibraltar
      { minLat: 35, maxLat: 37, minLng: -6, maxLng: -5 },
      
      // English Channel
      { minLat: 49, maxLat: 51, minLng: -4, maxLng: 2 },
      
      // Suez Canal area
      { minLat: 29, maxLat: 32, minLng: 32, maxLng: 33 },
      
      // Strait of Malacca
      { minLat: -1, maxLat: 6, minLng: 98, maxLng: 104 },
      
      // Panama Canal area
      { minLat: 8, maxLat: 10, minLng: -80, maxLng: -79 },
      
      // Bosporus Strait
      { minLat: 40, maxLat: 42, minLng: 28, maxLng: 30 },
    ];
    
    // Check if point is in a known sea passage
    for (const passage of seaPassages) {
      if (lat >= passage.minLat && lat <= passage.maxLat && 
          lng >= passage.minLng && lng <= passage.maxLng) {
        return false; // It's a sea passage, not land
      }
    }
    
    return false; // Default to water if not in a landmass
  };
  
  // Function to create a realistic sea route that avoids land
  const createSeaRoute = (
    startPoint: [number, number], 
    endPoint: [number, number], 
    numPoints: number,
    variation: number = 0.5
  ): [number, number][] => {
    // Check if direct route crosses major continents
    const needsDetour = (() => {
      // Check if start and end are on opposite sides of major landmasses
      const crossesAmerica = 
        ((startPoint[1] < -81 && endPoint[1] > -35) || (startPoint[1] > -35 && endPoint[1] < -81));
        
      const crossesEurasia = 
        ((startPoint[1] < -10 && endPoint[1] > 130) || (startPoint[1] > 130 && endPoint[1] < -10));
        
      const crossesAfrica = 
        ((startPoint[0] < 0 && endPoint[0] > 0 && startPoint[1] < 20 && endPoint[1] > 40) || 
         (startPoint[0] > 0 && endPoint[0] < 0 && startPoint[1] < 20 && endPoint[1] > 40));
      
      return crossesAmerica || crossesEurasia || crossesAfrica;
    })();
    
    // Generate route waypoints based on oceanic paths
    const generateWaypoints = (): [number, number][] => {
      const route: [number, number][] = [startPoint];
      
      // Determine which ocean route to take
      const startLng = startPoint[1];
      const endLng = endPoint[1];
      const lngDiff = Math.abs(endLng - startLng);
      
      // Check if route needs to go around continents
      if (needsDetour) {
        // If crossing between Atlantic and Pacific/Indian
        if ((startLng < -30 && endLng > 30) || (startLng > 30 && endLng < -30)) {
          // Decide whether to go via Cape of Good Hope or Cape Horn
          // based on which seems shorter considering latitudes
          const startLat = startPoint[0];
          const endLat = endPoint[0];
          const viaAfrica = (startLat > 0 && endLat > 0) || 
                           (startLat > 0 && endLat < 0 && startLng > 0) ||
                           (startLat < 0 && endLat > 0 && endLng > 0);
          
          if (viaAfrica) {
            // Route via Cape of Good Hope (southern Africa)
            // Add waypoints to navigate around Africa
            if (startLng < endLng) {
              // West to East
              route.push([-5, Math.min(startLng + 10, -15)] as [number, number]); // Mid-Atlantic
              route.push([-35, 18] as [number, number]); // Cape of Good Hope
              if (endLng > 60) {
                route.push([-20, 60] as [number, number]); // Indian Ocean
              }
            } else {
              // East to West
              if (startLng > 60) {
                route.push([-20, 60] as [number, number]); // Indian Ocean
              }
              route.push([-35, 18] as [number, number]); // Cape of Good Hope
              route.push([-5, Math.max(endLng - 10, -15)] as [number, number]); // Mid-Atlantic
            }
          } else {
            // Route via Cape Horn (southern South America)
            // Add waypoints to navigate around South America
            if (startLng < endLng) {
              // West to East
              route.push([-20, -45] as [number, number]); // South Atlantic
              route.push([-57, -67] as [number, number]); // Cape Horn
              route.push([-40, -100] as [number, number]); // South Pacific
            } else {
              // East to West
              route.push([-40, -100] as [number, number]); // South Pacific
              route.push([-57, -67] as [number, number]); // Cape Horn
              route.push([-20, -45] as [number, number]); // South Atlantic
            }
          }
        }
        // If route needs to go through Suez Canal but ships can't fit
        else if ((startLng < 30 && endLng > 40) || (startLng > 40 && endLng < 30)) {
          if (routingOption === "safety" || lngDiff > 100) {
            // Safety routes or large ships go around Africa
            if (startLng < endLng) {
              // West to East
              route.push([0, Math.min(startLng + 15, 15)] as [number, number]);
              route.push([-35, 18] as [number, number]); // Cape of Good Hope
              route.push([-10, 60] as [number, number]); // Indian Ocean
            } else {
              // East to West
              route.push([-10, 60] as [number, number]); // Indian Ocean
              route.push([-35, 18] as [number, number]); // Cape of Good Hope
              route.push([0, Math.max(endLng - 15, 15)] as [number, number]);
            }
          } else {
            // Other routes go through Suez
            route.push([35, 15] as [number, number]); // Mediterranean
            route.push([30, 32.5] as [number, number]); // Suez Canal
            route.push([15, 55] as [number, number]); // Red Sea/Arabian Sea
          }
        }
        // If route needs to go through Panama Canal
        else if ((startLng < -80 && endLng > -75) || (startLng > -75 && endLng < -80)) {
          if (routingOption === "safety" || lngDiff > 100) {
            // Safety routes or large ships go around South America
            if (startLng < endLng) {
              // West to East (Pacific to Atlantic)
              route.push([0, -100] as [number, number]); // Pacific
              route.push([-57, -67] as [number, number]); // Cape Horn
              route.push([-20, -45] as [number, number]); // South Atlantic
            } else {
              // East to West (Atlantic to Pacific)
              route.push([-20, -45] as [number, number]); // South Atlantic
              route.push([-57, -67] as [number, number]); // Cape Horn
              route.push([0, -100] as [number, number]); // Pacific
            }
          } else {
            // Other routes go through Panama
            route.push([9, -80] as [number, number]); // Panama Canal
          }
        }
      }
      
      // Add intermediate points with variations
      const waypoints = [...route];
      const finalRoute: [number, number][] = [startPoint];
      
      // Connect each segment of the route with additional points
      for (let i = 1; i < waypoints.length; i++) {
        const segStart = waypoints[i-1];
        const segEnd = waypoints[i];
        
        // Add intermediate points between each waypoint
        for (let j = 1; j <= numPoints; j++) {
          const fraction = j / (numPoints + 1);
          const baseLat = segStart[0] + (segEnd[0] - segStart[0]) * fraction;
          const baseLng = segStart[1] + (segEnd[1] - segStart[1]) * fraction;
          
          // Add variation to make route more natural
          // More variation in the middle, less at endpoints
          const sinCurve = Math.sin(Math.PI * fraction);
          
          // Apply different variations based on routing option
          let varLat = 0;
          let varLng = 0;
          
          if (routingOption === "fuel") {
            // Fuel-efficient routes follow ocean currents
            varLat = variation * sinCurve * Math.cos(baseLng / 30) * 2;
            varLng = variation * sinCurve * Math.sin(baseLat / 20) * 2;
          } else if (routingOption === "safety") {
            // Safety routes stay further from coasts
            varLat = variation * sinCurve * 3;
            varLng = variation * sinCurve * 3;
          } else if (routingOption === "speed") {
            // Speed routes have minimal deviation
            varLat = variation * sinCurve * 1;
            varLng = variation * sinCurve * 1;
          } else {
            // Balanced routes
            varLat = variation * sinCurve * 2;
            varLng = variation * sinCurve * 2;
          }
          
          // Add the variation
          let newLat = baseLat + varLat;
          let newLng = baseLng + varLng;
          
          // Check if point is on land, if so, move it offshore
          let attempts = 0;
          const maxAttempts = 5;
          
          while (isLand(newLat, newLng) && attempts < maxAttempts) {
            // Move point further out to sea in different directions
            const moveDistance = 2 + attempts;
            const angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
            
            // Try different angles to move away from land
            for (const angle of angles) {
              const testLat = newLat + moveDistance * Math.sin(angle);
              const testLng = newLng + moveDistance * Math.cos(angle);
              
              if (!isLand(testLat, testLng)) {
                newLat = testLat;
                newLng = testLng;
                break;
              }
            }
            
            attempts++;
          }
          
          // Add the waypoint
          finalRoute.push([newLat, newLng] as [number, number]);
        }
        
        // Add the segment endpoint
        if (i < waypoints.length - 1 || segEnd !== endPoint) {
          finalRoute.push(segEnd);
        }
      }
      
      // Add end point
      finalRoute.push(endPoint);
      
      return finalRoute;
    };
    
    return generateWaypoints();
  };
  
  // Create the sea route with different waypoint density based on routing option
  if (routingOption === "fuel") {
    // Fuel-efficient routes have more waypoints to follow currents
    return createSeaRoute(start, end, 4, 0.7);
  } else if (routingOption === "safety") {
    // Safety routes have more waypoints to avoid hazards
    return createSeaRoute(start, end, 6, 1.0);
  } else if (routingOption === "speed") {
    // Speed routes have fewer waypoints
    return createSeaRoute(start, end, 2, 0.3);
  } else {
    // Balanced routes
    return createSeaRoute(start, end, 3, 0.5);
  }
}

// Mock weather data
const mockWeatherData = {
  location: "North Atlantic",
  currentWeather: {
    temperature: 18,
    condition: "Partly Cloudy",
    windSpeed: 15,
    humidity: 65,
  },
  forecast: [
    { day: "Today", condition: "Partly Cloudy", high: 20, low: 15 },
    { day: "Tomorrow", condition: "Sunny", high: 22, low: 16 },
    { day: "Wed", condition: "Cloudy", high: 19, low: 14 },
    { day: "Thu", condition: "Rain", high: 17, low: 12 },
    { day: "Fri", condition: "Rain", high: 16, low: 11 },
    { day: "Sat", condition: "Partly Cloudy", high: 18, low: 13 },
    { day: "Sun", condition: "Sunny", high: 21, low: 15 },
    { day: "Mon", condition: "Sunny", high: 23, low: 17 },
    { day: "Tue", condition: "Partly Cloudy", high: 22, low: 16 },
    { day: "Wed", condition: "Cloudy", high: 20, low: 15 },
  ],
}

// Helper function to convert weather code to condition text
const getWeatherCondition = (weatherCode: number): string => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  const weatherCodes: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear", 
    2: "Partly cloudy", 
    3: "Overcast",
    45: "Fog", 
    48: "Depositing rime fog",
    51: "Light drizzle", 
    53: "Moderate drizzle", 
    55: "Dense drizzle",
    56: "Light freezing drizzle", 
    57: "Dense freezing drizzle",
    61: "Slight rain", 
    63: "Moderate rain", 
    65: "Heavy rain",
    66: "Light freezing rain", 
    67: "Heavy freezing rain",
    71: "Slight snow fall", 
    73: "Moderate snow fall", 
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers", 
    81: "Moderate rain showers", 
    82: "Violent rain showers",
    85: "Slight snow showers", 
    86: "Heavy snow showers",
    95: "Thunderstorm", 
    96: "Thunderstorm with slight hail", 
    99: "Thunderstorm with heavy hail"
  };
  
  return weatherCodes[weatherCode] || "Unknown";
};

// Helper function to get day name from date
const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Calculate the total distance of a route in nautical miles
const calculateRouteDistance = (route: [number, number][]): number => {
  let totalDistance = 0;
  
  for (let i = 1; i < route.length; i++) {
    const point1 = route[i - 1];
    const point2 = route[i];
    
    // Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    // Convert to nautical miles (1 km = 0.539957 nautical miles)
    const distanceNM = distance * 0.539957;
    
    totalDistance += distanceNM;
  }
  
  return Math.round(totalDistance);
};

// Calculate estimated travel information based on route and routing option
const calculateRouteInfo = (
  route: [number, number][],
  routingOption: string,
  shipType: string = "container"
): {
  distance: number;
  days: number;
  fuelConsumption: number;
  averageSpeed: number;
  co2Emissions: number;
} => {
  const distance = calculateRouteDistance(route);
  
  // Ship speed and consumption parameters based on ship type and routing option
  let baseSpeed = 0;
  let baseFuelRate = 0;
  
  // Set base parameters for different ship types
  switch (shipType) {
    case "container":
      baseSpeed = 20; // knots
      baseFuelRate = 80; // tons per day
      break;
    case "tanker":
      baseSpeed = 15; // knots
      baseFuelRate = 65; // tons per day
      break;
    case "bulk":
      baseSpeed = 14; // knots
      baseFuelRate = 50; // tons per day
      break;
    default:
      baseSpeed = 18; // knots
      baseFuelRate = 60; // tons per day
  }
  
  // Adjust speed and consumption based on routing option
  let speed = baseSpeed;
  let fuelRate = baseFuelRate;
  
  switch (routingOption) {
    case "speed":
      speed = baseSpeed * 1.2; // 20% faster
      fuelRate = baseFuelRate * 1.4; // 40% more fuel consumption
      break;
    case "fuel":
      speed = baseSpeed * 0.8; // 20% slower
      fuelRate = baseFuelRate * 0.7; // 30% less fuel consumption
      break;
    case "safety":
      speed = baseSpeed * 0.9; // 10% slower
      fuelRate = baseFuelRate * 0.9; // 10% less fuel consumption
      break;
    // balanced option uses base values
  }
  
  // Calculate travel time in days
  const travelTimeHours = distance / speed;
  const travelTimeDays = travelTimeHours / 24;
  
  // Round to 1 decimal place
  const days = Math.round(travelTimeDays * 10) / 10;
  
  // Calculate total fuel consumption in metric tons
  const fuelConsumption = Math.round(fuelRate * travelTimeDays);
  
  // Calculate CO2 emissions (rough estimate: 3.1 tons of CO2 per ton of fuel)
  const co2Emissions = Math.round(fuelConsumption * 3.1);
  
  return {
    distance,
    days,
    fuelConsumption,
    averageSpeed: Math.round(speed),
    co2Emissions
  };
};

export default function RoutePlanner() {
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null)
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null)
  const [route, setRoute] = useState<[number, number][] | null>(null)
  const [countryFilter, setCountryFilter] = useState("")
  const [routingOption, setRoutingOption] = useState("standard")
  const [startInputValue, setStartInputValue] = useState("")
  const [endInputValue, setEndInputValue] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<{
    location: string;
    currentWeather: {
      temperature: number;
      condition: string;
      windSpeed: number;
      humidity: number;
    };
    forecast: Array<{
      day: string;
      condition: string;
      high: number;
      low: number;
    }>;
  } | null>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [weatherSearchInput, setWeatherSearchInput] = useState<string>("")
  const [weatherSearchResults, setWeatherSearchResults] = useState<Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }> | null>(null)
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false)
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    days: number;
    fuelConsumption: number;
    averageSpeed: number;
    co2Emissions: number;
  } | null>(null)
  const [shipType, setShipType] = useState<string>("container")

  // Filter ports based on country name
  const filteredPorts = mockPorts.filter((port) =>
    port.country.toLowerCase().includes(countryFilter.toLowerCase())
  )

  // Function to fetch weather data for a location
  const fetchWeatherData = async (latitude: number, longitude: number, locationName: string) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    
    try {
      // Construct the Open-Meteo API URL
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Weather data fetch failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the API response to match our WeatherInfo component's expected format
      const transformedData = {
        location: locationName,
        currentWeather: {
          temperature: Math.round(data.current.temperature_2m),
          condition: getWeatherCondition(data.current.weather_code),
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: Math.round(data.current.relative_humidity_2m),
        },
        forecast: data.daily.time.map((date: string, index: number) => ({
          day: getDayName(date),
          condition: getWeatherCondition(data.daily.weather_code[index]),
          high: Math.round(data.daily.temperature_2m_max[index]),
          low: Math.round(data.daily.temperature_2m_min[index]),
        })),
      };
      
      setWeatherData(transformedData);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setWeatherError("Failed to fetch weather data. Please try again later.");
      // Fallback to mock data if fetch fails
      setWeatherData({
        location: locationName,
        currentWeather: mockWeatherData.currentWeather,
        forecast: mockWeatherData.forecast,
      });
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Modify the parseCoordinates and handleSubmit functions to include weather fetching
  const parseCoordinates = (input: string): [number, number] | null => {
    // Check if input is a port name
    const port = mockPorts.find((p) => p.name.toLowerCase() === input.toLowerCase() || 
                                       `${p.name}, ${p.country}`.toLowerCase() === input.toLowerCase());
    
    if (port) {
      return port.position;
    }
    
    // Regular expressions to match different coordinate formats
    const patterns = [
      /^\s*(-?\d+\.?\d*)\s*[,;]\s*(-?\d+\.?\d*)\s*$/, // Format: lat, lng
      /^\s*(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*$/, // Format: lat lng
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validate coordinates
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return [lat, lng];
        }
      }
    }
    
    return null;
  };

  // Update handleSubmit to include route information calculation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = parseCoordinates(startInputValue);
    const end = parseCoordinates(endInputValue);
    
    if (start && end) {
      setStartPoint(start);
      setEndPoint(end);
      
      // Generate a route based on the routing option
      const newRoute = generateMockRoute(start, end, routingOption);
      setRoute(newRoute);
      
      // Calculate route information
      const info = calculateRouteInfo(newRoute, routingOption, shipType);
      setRouteInfo(info);
      
      // Fetch weather data for the end point location
      const endPortName = mockPorts.find(
        p => p.position[0] === end[0] && p.position[1] === end[1]
      )?.name || `Destination (${end[0].toFixed(2)}, ${end[1].toFixed(2)})`;
      
      fetchWeatherData(end[0], end[1], endPortName);
    } else {
      alert("Please enter valid coordinates or port names for both start and end points.");
    }
  };

  // Handle selection of a port as the start point
  const handlePortSelectAsStart = (port: (typeof mockPorts)[0]) => {
    setStartPoint(port.position);
    setStartInputValue(`${port.name}, ${port.country}`);
    
    // If we already have an end point, calculate a route
    if (endPoint) {
      const newRoute = generateMockRoute(port.position, endPoint, routingOption);
      setRoute(newRoute);
      
      // Calculate route information
      const info = calculateRouteInfo(newRoute, routingOption, shipType);
      setRouteInfo(info);
      
      // Fetch weather data for the end point
      const endPortName = mockPorts.find(
        p => p.position[0] === endPoint[0] && p.position[1] === endPoint[1]
      )?.name || `Destination (${endPoint[0].toFixed(2)}, ${endPoint[1].toFixed(2)})`;
      
      fetchWeatherData(endPoint[0], endPoint[1], endPortName);
    }
  };

  // Update handlePortSelectAsEnd to include route information calculation
  const handlePortSelectAsEnd = (port: (typeof mockPorts)[0]) => {
    // If the port is already selected as end point, deselect it
    if (endPoint && endPoint[0] === port.position[0] && endPoint[1] === port.position[1]) {
      setEndPoint(null)
      setEndInputValue("")
      setRouteInfo(null) // Clear route info
      if (startPoint) {
        setRoute(null) // Clear route if we had one
      }
    } else {
      // Set this port as the end point
      setEndPoint(port.position)
      setEndInputValue(`${port.name}, ${port.country}`)
      
      // If we already have a start point, calculate a route
      if (startPoint) {
        const newRoute = generateMockRoute(startPoint, port.position, routingOption)
        setRoute(newRoute)
        
        // Calculate route information
        const info = calculateRouteInfo(newRoute, routingOption, shipType);
        setRouteInfo(info);
        
        // Fetch weather data for the selected port
        fetchWeatherData(port.position[0], port.position[1], port.name);
      }
    }
  }

  // Update handleSelectOption to update route info when routing option changes
  const handleSelectOption = (option: string) => {
    setRoutingOption(option);
    
    // If we have start and end points, recalculate the route
    if (startPoint && endPoint) {
      const newRoute = generateMockRoute(startPoint, endPoint, option);
      setRoute(newRoute);
      
      // Update route information with new routing option
      const info = calculateRouteInfo(newRoute, option, shipType);
      setRouteInfo(info);
      
      // Refresh weather data after route change
      const endPortName = mockPorts.find(
        p => p.position[0] === endPoint[0] && p.position[1] === endPoint[1]
      )?.name || `Destination (${endPoint[0].toFixed(2)}, ${endPoint[1].toFixed(2)})`;
      
      fetchWeatherData(endPoint[0], endPoint[1], endPortName);
    }
  };

  // Handle ship type selection
  const handleShipTypeChange = (type: string) => {
    setShipType(type);
    
    // If we have a route, recalculate route info with the new ship type
    if (route) {
      const info = calculateRouteInfo(route, routingOption, type);
      setRouteInfo(info);
    }
  };

  // Function to search for locations by name
  const searchLocation = async (query: string) => {
    setIsSearchingLocation(true);
    try {
      // Use the Open-Meteo Geocoding API to find the location
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error("Location search failed");
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Transform the API response to our format
        const transformedResults = data.results.map((result: any) => ({
          name: result.name,
          country: result.country,
          latitude: result.latitude,
          longitude: result.longitude
        }));
        
        setWeatherSearchResults(transformedResults);
      } else {
        setWeatherSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      setWeatherSearchResults([]);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Function to handle weather search submission
  const handleWeatherSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (weatherSearchInput.trim()) {
      searchLocation(weatherSearchInput.trim());
    }
  };

  // Function to handle selection of a location from search results
  const handleLocationSelect = (location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    // Fetch weather data for the selected location
    fetchWeatherData(
      location.latitude,
      location.longitude,
      `${location.name}, ${location.country}`
    );
    
    // Clear search results after selection
    setWeatherSearchResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Route Planner</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Route Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Plan Your Voyage</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="countryFilter" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Filter Ports by Country
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="countryFilter"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    placeholder="Type country name (e.g., United States, China)"
                  />
                  {countryFilter && (
                    <button
                      type="button"
                      onClick={() => setCountryFilter("")}
                      className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {[
                    "Australia", 
                    "Belgium", 
                    "Brazil", 
                    "Canada", 
                    "China",
                    "Germany", 
                    "India",
                    "Japan", 
                    "Netherlands", 
                    "Singapore", 
                    "South Africa", 
                    "South Korea",
                    "Spain",
                    "UAE",
                    "United Kingdom",
                    "United States"
                  ].map(country => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => setCountryFilter(country)}
                      className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800"
                    >
                      {country}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Filter the ports list below to find ports in specific countries.
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="startPoint" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Start Point
                </label>
                <input
                  type="text"
                  id="startPoint"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={startInputValue}
                  onChange={(e) => {
                    setStartInputValue(e.target.value);
                    const coords = parseCoordinates(e.target.value);
                    if (coords) {
                      setStartPoint(coords);
                    }
                  }}
                  placeholder="Enter latitude, longitude (e.g. 51.9225, 4.47917)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {startPoint ? `Valid coordinates: ${startPoint[0]}, ${startPoint[1]}` : "Select from ports below or enter coordinates manually"}
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="endPoint" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  End Point
                </label>
                <input
                  type="text"
                  id="endPoint"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={endInputValue}
                  onChange={(e) => {
                    setEndInputValue(e.target.value);
                    const coords = parseCoordinates(e.target.value);
                    if (coords) {
                      setEndPoint(coords);
                    }
                  }}
                  placeholder="Enter latitude, longitude (e.g. 1.29027, 103.851)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {endPoint ? `Valid coordinates: ${endPoint[0]}, ${endPoint[1]}` : "Select from ports below or enter coordinates manually"}
                </p>
              </div>

              {formError && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formError}
                </div>
              )}

              {/* Port selection UI */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Available Ports</h3>
                <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                  {filteredPorts.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Port Name</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Country</th>
                          <th className="px-4 py-2 text-right text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {filteredPorts.map((port) => (
                          <tr key={port.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-4 py-2 whitespace-nowrap text-gray-800 dark:text-gray-100 font-medium">{port.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-200">{port.country}</td>
                            <td className="px-3 py-2 whitespace-nowrap space-x-1">
                              <button
                                type="button"
                                onClick={() => handlePortSelectAsStart(port)}
                                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded mr-1 hover:bg-blue-200 dark:hover:bg-blue-700"
                              >
                                Start
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePortSelectAsEnd(port)}
                                className="text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-1 rounded hover:bg-green-200 dark:hover:bg-green-700"
                              >
                                End
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-3 text-gray-500 dark:text-gray-400 text-center">No ports found matching your filter.</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Use "Filter Ports by Country" to find ports from specific countries.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Routing Optimization</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                    <input
                      type="radio"
                      name="routingOption"
                      value="fuel"
                      checked={routingOption === "fuel"}
                      onChange={() => handleSelectOption("fuel")}
                      className="form-radio text-blue-600"
                    />
                    <span className="flex items-center">
                      <Ship className="h-4 w-4 mr-1" />
                      Fuel Efficiency
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                    <input
                      type="radio"
                      name="routingOption"
                      value="speed"
                      checked={routingOption === "speed"}
                      onChange={() => handleSelectOption("speed")}
                      className="form-radio text-blue-600"
                    />
                    <span className="flex items-center">
                      <Compass className="h-4 w-4 mr-1" />
                      Speed
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                    <input
                      type="radio"
                      name="routingOption"
                      value="safety"
                      checked={routingOption === "safety"}
                      onChange={() => handleSelectOption("safety")}
                      className="form-radio text-blue-600"
                    />
                    <span className="flex items-center">
                      <LifeBuoy className="h-4 w-4 mr-1" />
                      Safety
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                    <input
                      type="radio"
                      name="routingOption"
                      value="balanced"
                      checked={routingOption === "balanced"}
                      onChange={() => handleSelectOption("balanced")}
                      className="form-radio text-blue-600"
                    />
                    <span className="flex items-center">
                      <Navigation className="h-4 w-4 mr-1" />
                      Balanced
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-200"
              >
                Calculate Route
              </button>
            </form>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[600px]">
              <Map
                startPoint={startPoint || undefined}
                endPoint={endPoint || undefined}
                route={route || undefined}
                ports={filteredPorts}
              />
            </div>

            {/* Route Information */}
            {routeInfo && (
              <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Navigation className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Route Information
                </h2>
                
                {/* Ship Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vessel Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleShipTypeChange("container")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        shipType === "container"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Container Ship
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShipTypeChange("tanker")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        shipType === "tanker"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Tanker
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShipTypeChange("bulk")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        shipType === "bulk"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      Bulk Carrier
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Distance</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                      {routeInfo.distance} <span className="text-sm ml-1">nm</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Est. Travel Time</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                      {routeInfo.days} <span className="text-sm ml-1">days</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Speed</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                      {routeInfo.averageSpeed} <span className="text-sm ml-1">knots</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Fuel Consumption</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                      {routeInfo.fuelConsumption} <span className="text-sm ml-1">tons</span>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">CO₂ Emissions</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-baseline">
                      {routeInfo.co2Emissions} <span className="text-sm ml-1">tons</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Routing Mode</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {routingOption}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Note: Calculations are estimates based on average vessel parameters.
                </div>
              </div>
            )}
          </div>

          {/* Weather Information */}
          <div className="lg:col-span-3 mt-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weather Search</h2>
              <form onSubmit={handleWeatherSearch} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={weatherSearchInput}
                    onChange={(e) => setWeatherSearchInput(e.target.value)}
                    placeholder="Enter city or port name..."
                    className="flex-grow px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                    disabled={isSearchingLocation}
                  >
                    {isSearchingLocation ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : "Search"}
                  </button>
                </div>
              </form>

              {weatherSearchResults && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Search Results ({weatherSearchResults.length})
                  </h3>
                  {weatherSearchResults.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No locations found. Try a different search term.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {weatherSearchResults.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left p-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">{location.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{location.country}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isLoadingWeather ? (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
              </div>
            ) : weatherError ? (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <div className="text-red-500 text-center">
                  <p>{weatherError}</p>
                  <p className="mt-2 text-sm">Showing fallback weather data instead.</p>
                </div>
                <WeatherInfo
                  location={weatherData?.location || "Destination"}
                  currentWeather={weatherData?.currentWeather || mockWeatherData.currentWeather}
                  forecast={weatherData?.forecast || mockWeatherData.forecast}
                />
              </div>
            ) : (
              <WeatherInfo
                location={weatherData?.location || "Destination"}
                currentWeather={weatherData?.currentWeather || mockWeatherData.currentWeather}
                forecast={weatherData?.forecast || mockWeatherData.forecast}
              />
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Smart Voyage Optimization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


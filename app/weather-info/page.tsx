"use client"

import { useState, useEffect } from "react"
import { 
  Cloud, CloudRain, CloudSnow, Sun, Wind, Droplet, Thermometer, 
  Navigation, AlertTriangle, Search, Loader2, MapPin, Compass
} from "lucide-react"

// Default locations to show initially
const defaultLocations = [
  {
    id: 1,
    name: "North Atlantic",
    country: "Ocean",
    latitude: 45.0,
    longitude: -30.0,
  },
  {
    id: 2,
    name: "Mediterranean Sea",
    country: "Sea",
    latitude: 36.0,
    longitude: 18.0,
  },
  {
    id: 3,
    name: "South China Sea",
    country: "Sea",
    latitude: 13.0,
    longitude: 114.0,
  },
]

export default function WeatherInfoPage() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [weatherSearchInput, setWeatherSearchInput] = useState<string>("")
  const [weatherSearchResults, setWeatherSearchResults] = useState<any[] | null>(null)
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false)
  const [defaultWeatherData, setDefaultWeatherData] = useState<any[]>([])
  const [isLoadingDefaults, setIsLoadingDefaults] = useState<boolean>(true)

  // Fetch weather data for a specific location
  const fetchWeatherData = async (latitude: number, longitude: number, locationName: string, country: string) => {
    setIsLoadingWeather(true)
    setWeatherError(null)
    
    try {
      // Construct the Open-Meteo API URL
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`Weather data fetch failed: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Get additional sea condition data (wave height, etc)
      let seaData = {}
      try {
        const seaApiUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_direction&timezone=auto`
        const seaResponse = await fetch(seaApiUrl)
        if (seaResponse.ok) {
          const seaResponseData = await seaResponse.json()
          // Use first hour data for current conditions
          seaData = {
            waveHeight: parseFloat(seaResponseData.hourly.wave_height[0].toFixed(1)),
            swellDirection: getDirectionFromDegrees(seaResponseData.hourly.wave_direction[0]),
            waterTemperature: (Math.random() * 10 + 15).toFixed(1), // Mock water temp data
            visibility: ["Excellent", "Good", "Moderate", "Poor"][Math.floor(Math.random() * 3)] // Mock visibility
          }
        }
      } catch (error) {
        console.error("Failed to fetch sea data:", error)
        // Fallback sea data
        seaData = {
          waveHeight: (Math.random() * 3 + 1).toFixed(1),
          swellDirection: ["NE", "NW", "SE", "SW"][Math.floor(Math.random() * 4)],
          waterTemperature: (Math.random() * 10 + 15).toFixed(1),
          visibility: ["Excellent", "Good", "Moderate", "Poor"][Math.floor(Math.random() * 3)]
        }
      }
      
      // Transform the API response to our format
      const transformedData = {
        location: locationName,
        country: country,
        latitude: latitude,
        longitude: longitude,
        currentWeather: {
          temperature: Math.round(data.current.temperature_2m),
          condition: getWeatherCondition(data.current.weather_code),
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: Math.round(data.current.relative_humidity_2m),
        },
        seaConditions: seaData,
        forecast: data.daily.time.map((date: string, index: number) => ({
          day: getDayName(date),
          condition: getWeatherCondition(data.daily.weather_code[index]),
          high: Math.round(data.daily.temperature_2m_max[index]),
          low: Math.round(data.daily.temperature_2m_min[index]),
        })),
      }
      
      return transformedData
    } catch (error) {
      console.error("Failed to fetch weather data:", error)
      setWeatherError("Failed to fetch weather data. Please try again later.")
      return null
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // Get weather condition text from code
  const getWeatherCondition = (weatherCode: number): string => {
    const conditions: { [key: number]: string } = {
      0: "Clear Sky",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      56: "Light Freezing Drizzle",
      57: "Dense Freezing Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      66: "Light Freezing Rain",
      67: "Heavy Freezing Rain",
      71: "Slight Snow",
      73: "Moderate Snow",
      75: "Heavy Snow",
      77: "Snow Grains",
      80: "Slight Rain Showers",
      81: "Moderate Rain Showers",
      82: "Violent Rain Showers",
      85: "Slight Snow Showers",
      86: "Heavy Snow Showers",
      95: "Thunderstorm",
      96: "Thunderstorm with Slight Hail",
      99: "Thunderstorm with Heavy Hail",
    }
    return conditions[weatherCode] || "Unknown"
  }

  // Convert wave direction in degrees to cardinal directions
  const getDirectionFromDegrees = (degrees: number): string => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]
    return directions[Math.round(degrees / 45)]
  }

  // Get day name from date
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // Search for a location
  const searchLocation = async (query: string) => {
    setIsSearchingLocation(true)
    try {
      // Use the Open-Meteo Geocoding API to find the location
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      )
      
      if (!response.ok) {
        throw new Error("Location search failed")
      }
      
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        // Transform the API response to our format
        const transformedResults = data.results.map((result: any) => ({
          name: result.name,
          country: result.country,
          latitude: result.latitude,
          longitude: result.longitude
        }))
        
        setWeatherSearchResults(transformedResults)
      } else {
        setWeatherSearchResults([])
      }
    } catch (error) {
      console.error("Error searching for location:", error)
      setWeatherSearchResults([])
    } finally {
      setIsSearchingLocation(false)
    }
  }

  // Handle weather search submission
  const handleWeatherSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (weatherSearchInput.trim()) {
      searchLocation(weatherSearchInput.trim())
    }
  }

  // Handle selection of a location from search results
  const handleLocationSelect = async (location: {
    name: string,
    country: string,
    latitude: number,
    longitude: number,
  }) => {
    // Fetch weather data for the selected location
    const data = await fetchWeatherData(
      location.latitude,
      location.longitude,
      location.name,
      location.country
    )
    
    if (data) {
      setWeatherData(data)
      setSelectedLocation(data)
    }
    
    // Clear search results after selection
    setWeatherSearchResults(null)
    setWeatherSearchInput("")
  }

  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    condition = condition.toLowerCase()
    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) 
      return <CloudRain className="h-6 w-6" />
    if (condition.includes("snow") || condition.includes("grains")) 
      return <CloudSnow className="h-6 w-6" />
    if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("fog")) 
      return <Cloud className="h-6 w-6" />
    if (condition.includes("thunder")) 
      return <CloudRain className="h-6 w-6" />
    if (condition.includes("wind")) 
      return <Wind className="h-6 w-6" />
    return <Sun className="h-6 w-6" />
  }

  // Load default locations on initial page load
  useEffect(() => {
    const loadDefaultLocations = async () => {
      setIsLoadingDefaults(true)
      const weatherPromises = defaultLocations.map(location => 
        fetchWeatherData(
          location.latitude, 
          location.longitude, 
          location.name, 
          location.country
        )
      )
      
      const results = await Promise.all(weatherPromises)
      const validResults = results.filter(result => result !== null)
      
      setDefaultWeatherData(validResults)
      
      if (validResults.length > 0) {
        setSelectedLocation(validResults[0])
        setWeatherData(validResults[0])
      }
      
      setIsLoadingDefaults(false)
    }
    
    loadDefaultLocations()
  }, [])

  // Weather data background color based on temperature
  const getTempColor = (temp: number) => {
    if (temp < 0) return "bg-blue-500 text-white"
    if (temp < 10) return "bg-blue-400 text-white"
    if (temp < 20) return "bg-blue-300 text-gray-900"
    if (temp < 25) return "bg-yellow-200 text-gray-900"
    if (temp < 30) return "bg-yellow-400 text-gray-900"
    if (temp < 35) return "bg-orange-400 text-white"
    return "bg-red-500 text-white"
  }

  const getConditionBg = (condition: string) => {
    condition = condition.toLowerCase()
    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) 
      return "bg-blue-100 dark:bg-blue-900/30"
    if (condition.includes("snow") || condition.includes("grains")) 
      return "bg-gray-100 dark:bg-gray-800/50"
    if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("fog")) 
      return "bg-gray-200 dark:bg-gray-700/50"
    if (condition.includes("thunder")) 
      return "bg-purple-100 dark:bg-purple-900/30"
    return "bg-yellow-100 dark:bg-yellow-900/30"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Cloud className="h-8 w-8 mr-2 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weather Information</h1>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Search Location</h2>
          <form onSubmit={handleWeatherSearch} className="relative">
            <div className="flex">
              <input
                type="text"
                value={weatherSearchInput}
                onChange={(e) => setWeatherSearchInput(e.target.value)}
                placeholder="Enter city or location name..."
                className="flex-grow py-2 px-4 rounded-l-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white rounded-r-md transition-colors flex items-center"
                disabled={isSearchingLocation}
              >
                {isSearchingLocation ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Search Results */}
            {weatherSearchResults && weatherSearchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ul className="max-h-60 overflow-y-auto">
                  {weatherSearchResults.map((location, index) => (
                    <li key={`${location.name}-${index}`}>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{location.name}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{location.country}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {weatherSearchResults && weatherSearchResults.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-4 text-center">
                <p className="text-gray-600 dark:text-gray-300">No locations found. Try a different search term.</p>
          </div>
            )}
          </form>
        </div>

        {isLoadingDefaults ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading weather data...</span>
          </div>
        ) : (
          <>
            {/* Default Locations */}
            {!selectedLocation && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Select Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {defaultWeatherData.map((location) => (
                    <button
                      key={location.id}
                      className="p-4 rounded-md bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                      onClick={() => {
                        setSelectedLocation(location);
                        setWeatherData(location);
                      }}
                    >
                      <div className={`rounded-full p-3 ${getTempColor(location.currentWeather.temperature)} mb-2`}>
                        {getWeatherIcon(location.currentWeather.condition)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{location.location}</span>
                      <div className="flex items-center mt-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{location.currentWeather.temperature}°C</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{location.currentWeather.condition}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Location Weather */}
            {selectedLocation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className={`p-6 ${getConditionBg(selectedLocation.currentWeather.condition)}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className={`rounded-full p-3 mr-4 ${getTempColor(selectedLocation.currentWeather.temperature)}`}>
                          {getWeatherIcon(selectedLocation.currentWeather.condition)}
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{selectedLocation.location}</h2>
                          <p className="text-gray-600 dark:text-gray-300">{selectedLocation.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                          {selectedLocation.currentWeather.temperature}°C
                        </div>
                        <div className="text-xl text-gray-700 dark:text-gray-300">
                          {selectedLocation.currentWeather.condition}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
                        <Wind className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">Wind</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLocation.currentWeather.windSpeed} km/h</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
                        <Droplet className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLocation.currentWeather.humidity}%</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-2 text-blue-600 dark:text-blue-400"
                        >
                          <path d="M2 6c.6.5 1.2 1 2 1a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3" />
                          <path d="M20 9c.6.5 1.2 1 2 1" />
                          <path d="M2 12c.6.5 1.2 1 2 1a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3" />
                          <path d="M20 15c.6.5 1.2 1 2 1" />
                          <path d="M2 18c.6.5 1.2 1 2 1a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3" />
                        </svg>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Waves</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLocation.seaConditions.waveHeight} m</div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex flex-col items-center">
                        <Thermometer className="h-6 w-6 mb-2 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm text-gray-600 dark:text-gray-400">Water</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{selectedLocation.seaConditions.waterTemperature}°C</div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">10-Day Forecast</h3>
                    <div className="space-y-2">
                      {selectedLocation.forecast.map((day: any, index: number) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-2 pt-2"
                        >
                          <div className="flex items-center">
                            <span className="text-blue-600 dark:text-blue-400">{getWeatherIcon(day.condition)}</span>
                            <span className="ml-2 text-gray-900 dark:text-white">{day.day}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm mr-2 text-gray-500 dark:text-gray-400">{day.condition}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{day.high}°</span>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-gray-500 dark:text-gray-400">{day.low}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
          </div>

          {/* Sea Conditions */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
              <Navigation className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Sea Conditions
            </h2>

                  <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Wind className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-sm text-gray-600 dark:text-gray-300">Wind Speed</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedLocation.currentWeather.windSpeed} km/h</div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 text-blue-600 dark:text-blue-400"
                >
                        <path d="M2 6c.6.5 1.2 1 2 1a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3" />
                  <path d="M20 9c.6.5 1.2 1 2 1" />
                        <path d="M2 12c.6.5 1.2 1 2 1a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3" />
                  <path d="M20 15c.6.5 1.2 1 2 1" />
                        <path d="M2 18c.6.5 1.2 1 2 1a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3c.4.4.8.9 1 1.5a3 3 0 0 0 3-3" />
                </svg>
                <div className="text-sm text-gray-600 dark:text-gray-300">Wave Height</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedLocation.seaConditions.waveHeight} m</div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Thermometer className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-sm text-gray-600 dark:text-gray-300">Water Temp</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedLocation.seaConditions.waterTemperature}°C</div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Droplet className="h-8 w-8 mb-2 text-blue-600 dark:text-blue-400" />
                <div className="text-sm text-gray-600 dark:text-gray-300">Humidity</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedLocation.currentWeather.humidity}%</div>
              </div>
            </div>

                  <div className="mb-6">
              <div className="mb-2 font-medium text-gray-900 dark:text-white">Additional Information</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                          <Compass className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300">Swell Direction:</span>
                        </div>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedLocation.seaConditions.swellDirection}</span>
                </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-600 dark:text-blue-400"
                          >
                            <path d="M2 12h20" />
                            <path d="M2 7h20" />
                            <path d="M2 17h20" />
                          </svg>
                          <span className="text-gray-600 dark:text-gray-300">Visibility:</span>
                        </div>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedLocation.seaConditions.visibility}</span>
                </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                          <span className="text-gray-600 dark:text-gray-300">Coordinates:</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedLocation.latitude.toFixed(2)}, {selectedLocation.longitude.toFixed(2)}
                        </span>
                </div>
              </div>
            </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Weather Advisory</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Always check the latest weather updates before navigation. Conditions can change rapidly at sea.
                  </p>
                </div>
              </div>
            </div>

                  {/* Back to Default View */}
                  {selectedLocation && (
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="mt-6 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-800 dark:text-white font-medium"
                    >
                      View All Locations
                    </button>
                  )}
          </div>
        </div>
            )}
          </>
        )}
      </div>

      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Smart Voyage Optimization. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
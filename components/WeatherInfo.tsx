import { Cloud, CloudRain, CloudSnow, Sun, Wind } from "lucide-react"

interface WeatherInfoProps {
  location: string
  currentWeather: {
    temperature: number
    condition: string
    windSpeed: number
    humidity: number
  }
  forecast: Array<{
    day: string
    condition: string
    high: number
    low: number
  }>
}

export default function WeatherInfo({ location, currentWeather, forecast }: WeatherInfoProps) {
  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    condition = condition.toLowerCase()
    if (condition.includes("rain")) return <CloudRain className="h-6 w-6" />
    if (condition.includes("snow")) return <CloudSnow className="h-6 w-6" />
    if (condition.includes("cloud")) return <Cloud className="h-6 w-6" />
    if (condition.includes("wind")) return <Wind className="h-6 w-6" />
    return <Sun className="h-6 w-6" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{location} Weather</h2>
        <span className="text-blue-600 dark:text-blue-400">{getWeatherIcon(currentWeather.condition)}</span>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{currentWeather.temperature}°C</div>
            <div className="text-gray-600 dark:text-gray-300">{currentWeather.condition}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Wind: {currentWeather.windSpeed} km/h</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Humidity: {currentWeather.humidity}%</div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">10-Day Forecast</h3>
      <div className="space-y-2">
        {forecast.map((day, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-2 pt-2"
          >
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-blue-400">{getWeatherIcon(day.condition)}</span>
              <span className="ml-2 text-gray-900 dark:text-white">{day.day}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900 dark:text-white">{day.high}°</span>
              <span className="text-gray-500 dark:text-gray-400">{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


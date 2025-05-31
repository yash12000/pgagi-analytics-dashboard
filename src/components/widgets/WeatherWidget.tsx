'use client'

import { useEffect, useState } from 'react'
import { useGetWeatherQuery } from '@/services/weather'
import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react'
import { Card } from '@/components/ui/card'

const weatherIcons: Record<string, React.ReactNode> = {
  Clear: <Sun className="h-8 w-8 text-yellow-500" />,
  Clouds: <Cloud className="h-8 w-8 text-gray-500" />,
  Rain: <CloudRain className="h-8 w-8 text-blue-500" />,
  Snow: <CloudSnow className="h-8 w-8 text-blue-300" />,
  Thunderstorm: <CloudRain className="h-8 w-8 text-purple-500" />,
  Drizzle: <CloudRain className="h-8 w-8 text-blue-400" />,
  Mist: <Cloud className="h-8 w-8 text-gray-400" />,
}

export function WeatherWidget() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const { data: weather, isLoading, error } = useGetWeatherQuery(
    location || { lat: 0, lon: 0 },
    { skip: !location }
  )

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-24 w-full rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to load weather data</div>
      </Card>
    )
  }

  const currentWeather = weather.current.weather[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Weather
          </h2>
          {weatherIcons[currentWeather.main] || (
            <Cloud className="h-8 w-8 text-gray-500" />
          )}
        </div>

        <div className="mt-4">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {Math.round(weather.current.temp)}°C
          </div>
          <div className="mt-2 text-gray-600 dark:text-gray-400">
            {currentWeather.description}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Humidity</div>
            <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
              {weather.current.humidity}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Wind</div>
            <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
              {weather.current.wind_speed} m/s
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            7-Day Forecast
          </h3>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {weather.daily.slice(0, 7).map((day, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </div>
                <div className="mt-1">
                  {weatherIcons[day.weather[0].main] || (
                    <Cloud className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {Math.round(day.temp.day)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 
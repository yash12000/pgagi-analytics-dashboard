"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudDrizzle, CloudRain, Loader2, MapPin, Search, Sun, Wind, Eye, Droplets } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchWeatherData } from "@/store/slices/weather-slice"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { motion } from "framer-motion"
import { APIService } from "@/services/api"

interface LocationSuggestion {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

export function EnhancedWeatherWidget() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dispatch = useAppDispatch()
  const { data, loading, error, location } = useAppSelector((state) => state.weather)

  useEffect(() => {
    if (location) {
      dispatch(fetchWeatherData(location))
    }
  }, [dispatch, location])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(
        fetchWeatherData({
          lat: 0,
          lon: 0,
          city: searchQuery.trim(),
        }),
      )
      setSearchQuery("")
      setShowSuggestions(false)
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 2) {
      try {
        const results = await APIService.geocodeLocation(value)
        setSuggestions(results.slice(0, 5))
        setShowSuggestions(true)
      } catch (error) {
        console.error("Failed to fetch location suggestions:", error)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    dispatch(
      fetchWeatherData({
        lat: suggestion.lat,
        lon: suggestion.lon,
        city: suggestion.name,
      }),
    )
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "clouds":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "drizzle":
        return <CloudDrizzle className="h-8 w-8 text-blue-400" />
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />
    }
  }

  const forecastData = data?.daily?.slice(0, 7).map((day: any) => ({
    name: new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    temp: Math.round(day.temp.day),
    min: Math.round(day.temp.min),
    max: Math.round(day.temp.max),
    humidity: day.humidity,
  }))

  const hourlyData = data?.hourly?.slice(0, 24).map((hour: any) => ({
    time: new Date(hour.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      hour12: false,
    }),
    temp: Math.round(hour.temp),
    humidity: hour.humidity,
  }))

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather Forecast</CardTitle>
        <div className="relative w-full max-w-sm">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={handleInputChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-accent transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.state ? `${suggestion.state}, ` : ""}
                        {suggestion.country}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-destructive">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border p-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                  {getWeatherIcon(data.current.weather[0]?.main)}
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold">{Math.round(data.current.temp)}°C</h3>
                  <p className="text-muted-foreground capitalize">{data.current.weather[0]?.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Feels like {Math.round(data.current.feels_like || data.current.temp)}°C
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.city || "Current Location"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.current.wind_speed} m/s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.current.humidity}% humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{(data.current.visibility / 1000).toFixed(1)} km</span>
                </div>
              </div>
            </div>

            {hourlyData && (
              <div className="h-48">
                <h3 className="mb-2 font-medium">24-Hour Forecast</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis tick={{ fontSize: 12 }} tickMargin={10} unit="°" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="h-64">
              <h3 className="mb-2 font-medium">7-Day Forecast</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={10} unit="°" domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="High"
                  />
                  <Line
                    type="monotone"
                    dataKey="min"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Low"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-muted-foreground">
              Search for a location or allow location access to view weather data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

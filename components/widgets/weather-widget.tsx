"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudDrizzle, CloudRain, Loader2, MapPin, Search, Sun, Thermometer, Wind } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchWeatherData } from "@/store/slices/weather-slice"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

export function WeatherWidget() {
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch = useAppDispatch()
  const { data, loading, error, location } = useAppSelector((state) => state.weather)

  useEffect(() => {
    if (location) {
      dispatch(fetchWeatherData(location))
    }
  }, [dispatch, location])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      dispatch(
        fetchWeatherData({
          lat: 0, // Will be overridden by geocoding
          lon: 0, // Will be overridden by geocoding
          city: searchQuery.trim(),
        }),
      )
      setSearchQuery("")
    }
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

  const forecastData = data?.daily?.slice(0, 7).map((day) => ({
    name: new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    temp: Math.round(day.temp.day),
    min: Math.round(day.temp.min),
    max: Math.round(day.temp.max),
  }))

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather Forecast</CardTitle>
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-destructive">Error loading weather data. Please try again.</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 rounded-lg border p-4 sm:flex-row">
              <div className="flex items-center gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                  {getWeatherIcon(data.current.weather[0]?.main)}
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">{Math.round(data.current.temp)}°C</h3>
                  <p className="text-muted-foreground">{data.current.weather[0]?.description}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{data.city || "Current Location"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <span>{data.current.wind_speed} m/s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span>{data.current.humidity}% humidity</span>
                </div>
              </div>
            </div>

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

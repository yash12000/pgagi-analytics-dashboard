"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStockData } from "@/store/slices/finance-slice"
import { BarChart3, Loader2, Search, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { APIService } from "@/services/api"

const timeRanges = [
  { value: "1D", label: "1 Day" },
  { value: "5D", label: "5 Days" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "1Y", label: "1 Year" },
]

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "META", name: "Meta" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "NFLX", name: "Netflix" },
]

interface StockSuggestion {
  symbol: string
  name: string
  type: string
  region: string
}

export function EnhancedFinanceWidget() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [timeRange, setTimeRange] = useState("1M")
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.finance)

  useEffect(() => {
    dispatch(fetchStockData({ symbol: selectedStock, range: timeRange }))
  }, [dispatch, selectedStock, timeRange])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSelectedStock(searchQuery.toUpperCase().trim())
      setSearchQuery("")
      setShowSuggestions(false)
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.length > 1) {
      try {
        const results = await APIService.searchStockSymbol(value)
        if (results.bestMatches) {
          setSuggestions(results.bestMatches.slice(0, 5))
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Failed to fetch stock suggestions:", error)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: StockSuggestion) => {
    setSelectedStock(suggestion.symbol)
    setSearchQuery("")
    setShowSuggestions(false)
  }

  const handleStockSelect = (stock: string) => {
    setSelectedStock(stock)
  }

  const chartData = data?.timeSeries?.map((point: any) => ({
    date: new Date(point.date).toLocaleDateString(),
    price: Number.parseFloat(point.close),
    open: Number.parseFloat(point.open),
    high: Number.parseFloat(point.high),
    low: Number.parseFloat(point.low),
    volume: Number.parseInt(point.volume),
  }))

  const currentPrice = chartData && chartData.length ? chartData[chartData.length - 1].price : 0
  const previousPrice = chartData && chartData.length > 1 ? chartData[chartData.length - 2].price : currentPrice
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Stock Market
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>

        <div className="relative w-full max-w-sm">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search stock symbol..."
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
                      <div className="font-medium">{suggestion.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate">{suggestion.name}</div>
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

        <div className="flex flex-wrap gap-2">
          {popularStocks.map((stock) => (
            <Button
              key={stock.symbol}
              variant={selectedStock === stock.symbol ? "default" : "outline"}
              size="sm"
              onClick={() => handleStockSelect(stock.symbol)}
              className="text-xs"
            >
              {stock.symbol}
            </Button>
          ))}
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
        ) : data && chartData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h3 className="text-2xl font-bold">{selectedStock}</h3>
                  <p className="text-sm text-muted-foreground">{data.metaData?.name || "Stock"}</p>
                </div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-right"
                >
                  <p className="text-2xl font-bold">${currentPrice.toFixed(2)}</p>
                  <p className={`flex items-center text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(2)} ({priceChangePercent >= 0 ? "+" : ""}
                    {priceChangePercent.toFixed(2)}%)
                  </p>
                </motion.div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Day's Range</div>
                <div className="text-lg font-semibold">
                  ${Math.min(...chartData.map((d) => d.low)).toFixed(2)} - $
                  {Math.max(...chartData.map((d) => d.high)).toFixed(2)}
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-semibold">
                  {chartData.length ? formatVolume(chartData[chartData.length - 1].volume) : "N/A"}
                </div>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    tickFormatter={(value) => {
                      if (timeRange === "1D") {
                        return new Date(value).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                      return value
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={priceChange >= 0 ? "#10b981" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-muted-foreground">Search for a stock symbol to view data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

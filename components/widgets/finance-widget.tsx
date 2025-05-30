"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchStockData } from "@/store/slices/finance-slice"
import { ArrowDown, ArrowUp, BarChart3, Loader2, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const timeRanges = [
  { value: "1D", label: "1 Day" },
  { value: "5D", label: "5 Days" },
  { value: "1M", label: "1 Month" },
  { value: "3M", label: "3 Months" },
  { value: "1Y", label: "1 Year" },
]

const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

export function FinanceWidget() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState("AAPL")
  const [timeRange, setTimeRange] = useState("1M")
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.finance)

  useEffect(() => {
    dispatch(fetchStockData({ symbol: selectedStock, range: timeRange }))
  }, [dispatch, selectedStock, timeRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      setSelectedStock(searchQuery.toUpperCase())
      setSearchQuery("")
    }
  }

  const handleStockSelect = (stock: string) => {
    setSelectedStock(stock)
  }

  const chartData = data?.timeSeries?.map((point) => ({
    date: new Date(point.date).toLocaleDateString(),
    price: Number.parseFloat(point.close),
  }))

  const priceChange = chartData && chartData.length > 1 ? chartData[chartData.length - 1].price - chartData[0].price : 0
  const priceChangePercent = chartData && chartData.length > 1 ? (priceChange / chartData[0].price) * 100 : 0

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Stock Market
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24">
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
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Search stock symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((stock) => (
            <Button
              key={stock}
              variant={selectedStock === stock ? "default" : "outline"}
              size="sm"
              onClick={() => handleStockSelect(stock)}
            >
              {stock}
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
            <p className="text-center text-destructive">Error loading stock data. Please try again.</p>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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
                <p className="text-2xl font-bold">
                  ${chartData && chartData.length ? chartData[chartData.length - 1].price.toFixed(2) : "N/A"}
                </p>
                <p className={`flex items-center text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {priceChange >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                  {Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercent).toFixed(2)}%)
                </p>
              </motion.div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    tickFormatter={(value) => {
                      if (timeRange === "1D" || timeRange === "5D") {
                        return value.split("/")[1]
                      }
                      return value
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    domain={["dataMin - 5", "dataMax + 5"]}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
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

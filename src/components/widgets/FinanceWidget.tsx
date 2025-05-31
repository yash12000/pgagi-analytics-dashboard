'use client'

import { useState } from 'react'
import { useGetStockQuoteQuery, useGetStockTimeSeriesQuery } from '@/services/finance'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'

const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']

export function FinanceWidget() {
  const [selectedStock, setSelectedStock] = useState('AAPL')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const { data: quote, isLoading: isLoadingQuote } = useGetStockQuoteQuery(
    selectedStock
  )
  const { data: timeSeries, isLoading: isLoadingTimeSeries } =
    useGetStockTimeSeriesQuery({
      symbol: selectedStock,
      interval: '5min',
    })

  const isLoading = isLoadingQuote || isLoadingTimeSeries

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </Card>
    )
  }

  if (!quote || !timeSeries) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to load stock data</div>
      </Card>
    )
  }

  const isPositive = quote.change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Finance
          </h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {showSearch && (
          <div className="mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        )}

        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {popularStocks.map((symbol) => (
            <button
              key={symbol}
              onClick={() => setSelectedStock(symbol)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                selectedStock === symbol
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {symbol}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quote.price.toFixed(2)}
              </h3>
              <div
                className={`mt-1 flex items-center text-sm ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Volume
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {quote.volume.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries.data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="timestamp"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
                />
                <YAxis
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6',
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                  formatter={(value: number) => [value.toFixed(2), 'Price']}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
              <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {quote.open.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
              <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {quote.high.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Low</div>
              <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {quote.low.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Previous Close
              </div>
              <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {quote.previousClose.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 
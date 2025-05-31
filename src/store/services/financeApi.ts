import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
}

interface StockTimeSeries {
  symbol: string
  interval: string
  data: {
    timestamp: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }[]
}

export const financeApi = createApi({
  reducerPath: 'financeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.alphavantage.co/query',
  }),
  endpoints: (builder) => ({
    getStockQuote: builder.query<StockQuote, string>({
      query: (symbol) => ({
        url: '',
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
        },
      }),
      transformResponse: (response: any) => ({
        symbol: response['Global Quote']['01. symbol'],
        price: parseFloat(response['Global Quote']['05. price']),
        change: parseFloat(response['Global Quote']['09. change']),
        changePercent: parseFloat(response['Global Quote']['10. change percent'].replace('%', '')),
        volume: parseInt(response['Global Quote']['06. volume']),
        high: parseFloat(response['Global Quote']['03. high']),
        low: parseFloat(response['Global Quote']['04. low']),
        open: parseFloat(response['Global Quote']['02. open']),
        previousClose: parseFloat(response['Global Quote']['08. previous close']),
      }),
    }),
    getStockTimeSeries: builder.query<StockTimeSeries, { symbol: string; interval: string }>({
      query: ({ symbol, interval }) => ({
        url: '',
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
        },
      }),
      transformResponse: (response: any) => {
        const timeSeriesKey = `Time Series (${response['Meta Data']['4. Interval']})`
        const data = Object.entries(response[timeSeriesKey]).map(([timestamp, values]: [string, any]) => ({
          timestamp,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
        }))

        return {
          symbol: response['Meta Data']['2. Symbol'],
          interval: response['Meta Data']['4. Interval'],
          data,
        }
      },
    }),
  }),
})

export const { useGetStockQuoteQuery, useGetStockTimeSeriesQuery } = financeApi 
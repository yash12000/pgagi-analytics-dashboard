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
  data: Array<{
    timestamp: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
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
      transformResponse: (response: any) => {
        const quote = response['Global Quote']
        return {
          symbol: quote['01. symbol'],
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: parseInt(quote['06. volume']),
          high: parseFloat(quote['03. high']),
          low: parseFloat(quote['04. low']),
          open: parseFloat(quote['02. open']),
          previousClose: parseFloat(quote['08. previous close']),
        }
      },
    }),
    getStockTimeSeries: builder.query<
      StockTimeSeries,
      { symbol: string; interval: '1min' | '5min' | '15min' | '30min' | '60min' }
    >({
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
        const timeSeries = response[timeSeriesKey]
        return {
          symbol: response['Meta Data']['2. Symbol'],
          interval: response['Meta Data']['4. Interval'],
          data: Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => ({
            timestamp,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume']),
          })),
        }
      },
    }),
  }),
})

export const { useGetStockQuoteQuery, useGetStockTimeSeriesQuery } = financeApi 
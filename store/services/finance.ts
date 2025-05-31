import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const financeApi = createApi({
  reducerPath: "financeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.alphavantage.co/query",
  }),
  endpoints: (builder) => ({
    getStockQuote: builder.query({
      query: (symbol: string) => ({
        url: "",
        params: {
          function: "GLOBAL_QUOTE",
          symbol,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
        },
      }),
    }),
    getStockDaily: builder.query({
      query: (symbol: string) => ({
        url: "",
        params: {
          function: "TIME_SERIES_DAILY",
          symbol,
          apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
        },
      }),
    }),
  }),
})

export const { useGetStockQuoteQuery, useGetStockDailyQuery } = financeApi 
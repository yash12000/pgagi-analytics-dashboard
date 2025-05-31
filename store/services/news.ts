import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://newsapi.org/v2",
  }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query({
      query: (category: string) => ({
        url: "/top-headlines",
        params: {
          country: "us",
          category,
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        },
      }),
    }),
    searchNews: builder.query({
      query: (query: string) => ({
        url: "/everything",
        params: {
          q: query,
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        },
      }),
    }),
  }),
})

export const { useGetTopHeadlinesQuery, useSearchNewsQuery } = newsApi 
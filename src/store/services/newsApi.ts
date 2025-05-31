import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface NewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://newsapi.org/v2',
  }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<NewsResponse, { category?: string; page?: number }>({
      query: ({ category, page = 1 }) => ({
        url: '/top-headlines',
        params: {
          country: 'us',
          category,
          page,
          pageSize: 10,
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        },
      }),
    }),
    searchNews: builder.query<NewsResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => ({
        url: '/everything',
        params: {
          q: query,
          page,
          pageSize: 10,
          sortBy: 'publishedAt',
          apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
        },
      }),
    }),
  }),
})

export const { useGetTopHeadlinesQuery, useSearchNewsQuery } = newsApi 
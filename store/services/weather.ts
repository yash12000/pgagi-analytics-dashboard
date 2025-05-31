import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.openweathermap.org/data/2.5",
  }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query({
      query: (city: string) => ({
        url: "/weather",
        params: {
          q: city,
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          units: "metric",
        },
      }),
    }),
    getForecast: builder.query({
      query: (city: string) => ({
        url: "/forecast",
        params: {
          q: city,
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          units: "metric",
        },
      }),
    }),
  }),
})

export const { useGetCurrentWeatherQuery, useGetForecastQuery } = weatherApi 
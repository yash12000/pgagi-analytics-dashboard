import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface WeatherResponse {
  current: {
    temp: number
    humidity: number
    wind_speed: number
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
  }
  daily: Array<{
    dt: number
    temp: {
      day: number
      min: number
      max: number
    }
    humidity: number
    wind_speed: number
    weather: Array<{
      main: string
      description: string
      icon: string
    }>
  }>
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  }),
  endpoints: (builder) => ({
    getWeather: builder.query<WeatherResponse, { lat: number; lon: number }>({
      query: ({ lat, lon }) => ({
        url: '/onecall',
        params: {
          lat,
          lon,
          exclude: 'minutely,hourly,alerts',
          units: 'metric',
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
        },
      }),
    }),
  }),
})

export const { useGetWeatherQuery } = weatherApi 
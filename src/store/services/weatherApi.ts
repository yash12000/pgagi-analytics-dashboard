import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    weather: {
      main: string
      description: string
      icon: string
    }[]
  }
  daily: {
    dt: number
    temp: {
      day: number
      min: number
      max: number
    }
    weather: {
      main: string
      description: string
      icon: string
    }[]
  }[]
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  }),
  endpoints: (builder) => ({
    getWeather: builder.query<WeatherData, { lat: number; lon: number }>({
      query: ({ lat, lon }) => ({
        url: '/onecall',
        params: {
          lat,
          lon,
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          units: 'metric',
          exclude: 'minutely,hourly,alerts',
        },
      }),
    }),
    getWeatherByCity: builder.query<WeatherData, string>({
      query: (city) => ({
        url: '/weather',
        params: {
          q: city,
          appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }),
    }),
  }),
})

export const { useGetWeatherQuery, useGetWeatherByCityQuery } = weatherApi 
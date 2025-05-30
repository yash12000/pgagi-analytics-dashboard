import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface WeatherLocation {
  lat: number
  lon: number
  city?: string
}

interface WeatherState {
  data: any
  loading: boolean
  error: string | null
  location: WeatherLocation | null
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  location: null,
}

export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async (location: WeatherLocation) => {
  try {
    const API_KEY = "65feaf256c88c53ac524651cb93a9338"

    let lat = location.lat
    let lon = location.lon
    let cityName = location.city

    if (location.city && !location.lat) {
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location.city)}&limit=1&appid=${API_KEY}`,
      )

      if (!geocodeResponse.ok) {
        throw new Error("Failed to geocode location")
      }

      const geocodeData = await geocodeResponse.json()

      if (geocodeData.length === 0) {
        throw new Error("Location not found")
      }

      lat = geocodeData[0].lat
      lon = geocodeData[0].lon
      cityName = geocodeData[0].name
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherResponse.json()

    return {
      city: cityName || "Current Location",
      current: {
        temp: weatherData.current.temp,
        weather: weatherData.current.weather,
        humidity: weatherData.current.humidity,
        wind_speed: weatherData.current.wind_speed,
      },
      daily: weatherData.daily,
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch weather data")
  }
})

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<WeatherLocation>) => {
      state.location = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch weather data"
      })
  },
})

export const { setLocation } = weatherSlice.actions
export default weatherSlice.reducer

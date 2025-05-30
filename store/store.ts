import { configureStore } from "@reduxjs/toolkit"
import weatherReducer from "./slices/weather-slice"
import newsReducer from "./slices/news-slice"
import financeReducer from "./slices/finance-slice"

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    news: newsReducer,
    finance: financeReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import Dashboard from "@/components/dashboard/dashboard"
import weatherReducer from "@/store/slices/weather-slice"
import newsReducer from "@/store/slices/news-slice"
import financeReducer from "@/store/slices/finance-slice"

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
}
global.navigator.geolocation = mockGeolocation

const createTestStore = () => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
      news: newsReducer,
      finance: financeReducer,
    },
  })
}

describe("Dashboard", () => {
  beforeEach(() => {
    mockGeolocation.getCurrentPosition.mockClear()
  })

  it("renders dashboard components", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
    )

    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Weather Forecast")).toBeInTheDocument()
    expect(screen.getByText("Latest News")).toBeInTheDocument()
    expect(screen.getByText("Stock Market")).toBeInTheDocument()
  })

  it("requests geolocation on mount", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>,
    )

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
  })
})

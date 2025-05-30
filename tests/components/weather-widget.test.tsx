import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { WeatherWidget } from "@/components/widgets/weather-widget"
import weatherReducer from "@/store/slices/weather-slice"

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      weather: weatherReducer,
    },
    preloadedState: {
      weather: {
        data: null,
        loading: false,
        error: null,
        location: null,
        ...initialState,
      },
    },
  })
}

describe("WeatherWidget", () => {
  it("renders weather widget", () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>,
    )

    expect(screen.getByText("Weather Forecast")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search location...")).toBeInTheDocument()
  })

  it("shows loading state", () => {
    const store = createTestStore({ loading: true })

    render(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>,
    )

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("handles search form submission", async () => {
    const store = createTestStore()

    render(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>,
    )

    const searchInput = screen.getByPlaceholderText("Search location...")
    const searchButton = screen.getByRole("button", { name: /search/i })

    fireEvent.change(searchInput, { target: { value: "London" } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(searchInput).toHaveValue("London")
    })
  })
})

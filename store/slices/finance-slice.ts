import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface FinanceState {
  data: any
  loading: boolean
  error: string | null
}

interface StockParams {
  symbol: string
  range: string
}

const initialState: FinanceState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchStockData = createAsyncThunk("finance/fetchStockData", async ({ symbol, range }: StockParams) => {
  try {
    const API_KEY = "458K5RP3RCP0CURB"

    let apiFunction = "TIME_SERIES_DAILY"
    let outputSize = "compact"

    if (range === "1D") {
      apiFunction = "TIME_SERIES_INTRADAY"
    } else if (range === "1Y") {
      outputSize = "full"
    }

    let url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&apikey=${API_KEY}&outputsize=${outputSize}`

    if (apiFunction === "TIME_SERIES_INTRADAY") {
      url += "&interval=60min"
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch stock data")
    }

    const data = await response.json()

    if (data["Error Message"]) {
      throw new Error("Invalid stock symbol or API error")
    }

    if (data["Note"]) {
      throw new Error("API call frequency limit reached. Please try again later.")
    }

    let timeSeries: any[] = []
    let metaData: any = {}

    if (apiFunction === "TIME_SERIES_INTRADAY") {
      const timeSeriesKey = Object.keys(data).find((key) => key.includes("Time Series"))
      if (timeSeriesKey) {
        const rawData = data[timeSeriesKey]
        timeSeries = Object.entries(rawData)
          .map(([date, values]: [string, any]) => ({
            date,
            open: values["1. open"],
            high: values["2. high"],
            low: values["3. low"],
            close: values["4. close"],
            volume: values["5. volume"],
          }))
          .slice(0, 24)
      }
      metaData = data["Meta Data"] || {}
    } else {
      const timeSeriesKey = Object.keys(data).find((key) => key.includes("Time Series"))
      if (timeSeriesKey) {
        const rawData = data[timeSeriesKey]
        let dataPoints = 30

        switch (range) {
          case "5D":
            dataPoints = 5
            break
          case "1M":
            dataPoints = 30
            break
          case "3M":
            dataPoints = 90
            break
          case "1Y":
            dataPoints = 365
            break
        }

        timeSeries = Object.entries(rawData)
          .slice(0, dataPoints)
          .map(([date, values]: [string, any]) => ({
            date,
            open: values["1. open"],
            high: values["2. high"],
            low: values["3. low"],
            close: values["4. close"],
            volume: values["5. volume"],
          }))
          .reverse()
      }
      metaData = data["Meta Data"] || {}
    }

    return {
      metaData: {
        symbol: metaData["2. Symbol"] || symbol,
        name: getCompanyName(symbol),
        lastRefreshed: metaData["3. Last Refreshed"] || new Date().toISOString(),
      },
      timeSeries,
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch stock data")
  }
})

function getCompanyName(symbol: string): string {
  const companies: Record<string, string> = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
    TSLA: "Tesla, Inc.",
    FB: "Meta Platforms, Inc.",
    NFLX: "Netflix, Inc.",
  }

  return companies[symbol] || symbol
}

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch stock data"
      })
  },
})

export default financeSlice.reducer

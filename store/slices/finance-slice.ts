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

export const fetchStockData = createAsyncThunk(
  "finance/fetchStockData",
  async ({ symbol, range }: { symbol: string; range: string }) => {
    // Mock data for now
    const mockData = {
      metaData: {
        name: `${symbol} Stock`,
      },
      timeSeries: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        open: 100 + Math.random() * 10,
        high: 105 + Math.random() * 10,
        low: 95 + Math.random() * 10,
        close: 100 + Math.random() * 10,
        volume: Math.floor(Math.random() * 1000000),
      })),
    }
    return mockData
  }
)

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

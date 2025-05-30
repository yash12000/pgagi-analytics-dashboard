import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface NewsState {
  data: any
  loading: boolean
  error: string | null
}

const initialState: NewsState = {
  data: null,
  loading: false,
  error: null,
}

export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async (category: string) => {
  try {
    const API_KEY = "150feca50dea4495bd275bb890898cb4"

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=20&apiKey=${API_KEY}`,
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again later.")
      }
      throw new Error("Failed to fetch news data")
    }

    const data = await response.json()

    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch news data")
    }

    return {
      articles: data.articles.filter(
        (article: any) =>
          article.title && article.title !== "[Removed]" && article.description && article.description !== "[Removed]",
      ),
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch news data")
  }
})

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch news data"
      })
  },
})

export default newsSlice.reducer

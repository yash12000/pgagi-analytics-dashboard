const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com"

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchData<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data: any, options?: RequestInit) =>
    fetchData<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any, options?: RequestInit) =>
    fetchData<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchData<T>(endpoint, { ...options, method: "DELETE" }),
}

export class APIService {
  private static readonly WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  private static readonly NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY
  private static readonly FINANCE_API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY

  static async geocodeLocation(city: string) {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${this.WEATHER_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to geocode location")
    }

    return response.json()
  }

  static async getWeatherData(lat: number, lon: number) {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${this.WEATHER_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    return response.json()
  }

  static async getTopHeadlines(category = "general", country = "us") {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=20&apiKey=${this.NEWS_API_KEY}`,
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again later.")
      }
      throw new Error("Failed to fetch news data")
    }

    return response.json()
  }

  static async searchNews(query: string) {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${this.NEWS_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to search news")
    }

    return response.json()
  }

  static async getStockData(symbol: string, range = "1M") {
    let apiFunction = "TIME_SERIES_DAILY"
    let outputSize = "compact"

    if (range === "1D") {
      apiFunction = "TIME_SERIES_INTRADAY"
    } else if (range === "1Y") {
      outputSize = "full"
    }

    let url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&apikey=${this.FINANCE_API_KEY}&outputsize=${outputSize}`

    if (apiFunction === "TIME_SERIES_INTRADAY") {
      url += "&interval=60min"
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch stock data")
    }

    return response.json()
  }

  static async searchStockSymbol(keywords: string) {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${this.FINANCE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to search stock symbols")
    }

    return response.json()
  }

  static async getCompanyOverview(symbol: string) {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.FINANCE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch company overview")
    }

    return response.json()
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export const handleAPIError = (error: unknown): string => {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return "Invalid API key. Please check your configuration."
      case 429:
        return "API rate limit exceeded. Please try again later."
      case 404:
        return "Data not found. Please check your search terms."
      default:
        return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred. Please try again."
}

export const retryWithBackoff = async <T>(\
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
)
: Promise<T> =>
{
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")

      if (i === maxRetries - 1) {
        throw lastError
      }

      const delay = baseDelay * Math.pow(2, i)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

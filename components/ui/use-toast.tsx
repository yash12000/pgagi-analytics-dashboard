"use client"

import * as React from "react"

export type Toast = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const ToastContext = React.createContext<{
  toast: (toast: Toast) => void
} | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  )
} 
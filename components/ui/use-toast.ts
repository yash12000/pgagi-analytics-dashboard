"use client"

import * as React from "react"

export type Toast = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (toast: Toast) => void
  toasts: Toast[]
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }, [])

  const value = React.useMemo(() => ({
    toast,
    toasts
  }), [toast, toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
} 
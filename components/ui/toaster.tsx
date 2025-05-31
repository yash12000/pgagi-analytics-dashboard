"use client"

import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts = [] } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`mb-4 rounded-lg p-4 shadow-lg ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
          }`}
        >
          {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
          {toast.description && <p className="mt-1">{toast.description}</p>}
        </div>
      ))}
    </div>
  )
} 
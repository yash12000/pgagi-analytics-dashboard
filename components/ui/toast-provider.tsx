"use client"

import * as React from "react"
import { useToast } from "./use-toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast()

  return (
    <>
      {children}
      {toasts.map(({ id, title, description, action, ...props }) => (
        <div
          key={id}
          className={`fixed bottom-4 right-4 z-50 rounded-lg p-4 shadow-lg ${
            props.variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
          }`}
          {...props}
        >
          {title && <h3 className="font-semibold">{title}</h3>}
          {description && <p className="mt-1">{description}</p>}
          {action}
        </div>
      ))}
    </>
  )
} 
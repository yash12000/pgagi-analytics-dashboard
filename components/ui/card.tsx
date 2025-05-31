import * as React from "react"

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white rounded shadow p-4 ${className}`} {...props}>{children}</div>
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-2 ${className}`} {...props}>{children}</div>
}

export function CardTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <h3 className={`font-bold text-lg ${className}`} {...props}>{children}</h3>
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>
} 
'use client'

import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Header />
      <main className="pt-16 pl-64">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  )
} 
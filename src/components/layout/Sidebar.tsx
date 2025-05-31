'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RootState } from '@/store'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'
import {
  Cloud,
  Newspaper,
  LineChart,
  Menu,
  Moon,
  Sun,
  Settings,
  User,
} from 'lucide-react'

const navigation = [
  { name: 'Weather', href: '/weather', icon: Cloud },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Finance', href: '/finance', icon: LineChart },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const dispatch = useDispatch()
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <motion.aside
      initial={{ width: 0 }}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      className="fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            PGAGI Analytics
          </h1>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <nav className="mt-4 space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {sidebarOpen && (
            <span className="ml-3">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  )
} 
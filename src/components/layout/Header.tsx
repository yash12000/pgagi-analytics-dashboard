'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { addNotification } from '@/store/slices/uiSlice'
import { cn } from '@/lib/utils'

export function Header() {
  const { data: session } = useSession()
  const dispatch = useDispatch()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    dispatch(
      addNotification({
        type: 'info',
        message: 'Search functionality coming soon!',
      })
    )
  }

  return (
    <header className="fixed top-0 right-0 z-30 h-16 w-[calc(100%-240px)] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex h-full items-center justify-between px-4">
        <form onSubmit={handleSearch} className="relative w-96">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </form>

        <div className="flex items-center space-x-4">
          <button
            onClick={() =>
              dispatch(
                addNotification({
                  type: 'info',
                  message: 'No new notifications',
                })
              )
            }
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {session?.user?.name || 'User'}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-500 transition-transform',
                  isProfileOpen && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800"
                >
                  <button
                    onClick={() => signOut()}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
} 
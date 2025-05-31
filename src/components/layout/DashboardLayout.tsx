'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { RootState } from '@/store'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar())
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header
        onMenuClick={handleSidebarToggle}
        onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
} 
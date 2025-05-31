"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"
import { NewsWidget } from "../widgets/news-widget"
import { PerformanceWidget } from "../widgets/performance-widget"
import { AnalyticsOverview } from "../widgets/analytics-overview"
import { RealTimeWidget } from "../widgets/real-time-widget"
import { DashboardGrid } from "./dashboard-grid"
import { useAppDispatch } from "../../store/hooks"
import { setLocation } from "../../store/slices/weather-slice"
import { useToast } from "../ui/use-toast"
import { EnhancedWeatherWidget } from "../widgets/enhanced-weather-widget"
import { EnhancedFinanceWidget } from "../widgets/enhanced-finance-widget"

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          )
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please enable location access or search for a specific location.",
            variant: "destructive",
          })
          dispatch(
            setLocation({
              lat: 40.7128,
              lon: -74.006,
            }),
          )
        },
      )
    }
  }, [dispatch, toast])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <DashboardGrid>
            <AnalyticsOverview />
            <EnhancedWeatherWidget />
            <NewsWidget />
            <EnhancedFinanceWidget />
            <PerformanceWidget />
            <RealTimeWidget />
          </DashboardGrid>
        </main>
      </div>
    </div>
  )
}

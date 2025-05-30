"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Globe, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface RealTimeEvent {
  id: string
  type: "user_join" | "page_view" | "purchase" | "error"
  message: string
  timestamp: Date
  location?: string
}

const eventTypes = {
  user_join: { icon: Users, color: "bg-green-500", label: "User Joined" },
  page_view: { icon: Globe, color: "bg-blue-500", label: "Page View" },
  purchase: { icon: TrendingUp, color: "bg-purple-500", label: "Purchase" },
  error: { icon: Activity, color: "bg-red-500", label: "Error" },
}

export function RealTimeWidget() {
  const [events, setEvents] = useState<RealTimeEvent[]>([])
  const [activeUsers, setActiveUsers] = useState(1247)

  useEffect(() => {
    const interval = setInterval(() => {
      const eventType = Object.keys(eventTypes)[
        Math.floor(Math.random() * Object.keys(eventTypes).length)
      ] as keyof typeof eventTypes
      const locations = ["New York", "London", "Tokyo", "Sydney", "Berlin", "Paris", "Toronto"]

      const newEvent: RealTimeEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: eventType,
        message: generateEventMessage(eventType),
        timestamp: new Date(),
        location: locations[Math.floor(Math.random() * locations.length)],
      }

      setEvents((prev) => [newEvent, ...prev.slice(0, 9)])

      setActiveUsers((prev) => {
        const change = Math.floor(Math.random() * 10) - 5
        return Math.max(1000, prev + change)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const generateEventMessage = (type: keyof typeof eventTypes): string => {
    switch (type) {
      case "user_join":
        return "New user signed up"
      case "page_view":
        return "Page viewed: /dashboard"
      case "purchase":
        return "Purchase completed: $299"
      case "error":
        return "API error: 500 Internal Server Error"
      default:
        return "Unknown event"
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Activity
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            {activeUsers.toLocaleString()} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {events.map((event) => {
              const EventIcon = eventTypes[event.type].icon
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className={`p-1.5 rounded-full ${eventTypes[event.type].color}`}>
                    <EventIcon className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{event.timestamp.toLocaleTimeString()}</span>
                      {event.location && (
                        <>
                          <span>•</span>
                          <span>{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

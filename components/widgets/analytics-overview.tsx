"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Eye, MousePointer, Users, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const analyticsData = [
  { name: "Desktop", value: 65, color: "#3b82f6" },
  { name: "Mobile", value: 30, color: "#10b981" },
  { name: "Tablet", value: 5, color: "#f59e0b" },
]

const trafficData = [
  { name: "Mon", visits: 1200, pageviews: 2400 },
  { name: "Tue", visits: 1900, pageviews: 3200 },
  { name: "Wed", visits: 1600, pageviews: 2800 },
  { name: "Thu", visits: 2200, pageviews: 3800 },
  { name: "Fri", visits: 2800, pageviews: 4200 },
  { name: "Sat", visits: 2100, pageviews: 3600 },
  { name: "Sun", visits: 1800, pageviews: 3000 },
]

const metrics = [
  {
    title: "Total Users",
    value: "24,532",
    change: "+12.5%",
    isPositive: true,
    icon: Users,
  },
  {
    title: "Page Views",
    value: "89,432",
    change: "+8.2%",
    isPositive: true,
    icon: Eye,
  },
  {
    title: "Click Rate",
    value: "3.24%",
    change: "-2.1%",
    isPositive: false,
    icon: MousePointer,
  },
  {
    title: "Bounce Rate",
    value: "42.3%",
    change: "-5.4%",
    isPositive: true,
    icon: Zap,
  },
]

export function AnalyticsOverview() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-lg border p-3"
            >
              <div className="flex items-center justify-between">
                <metric.icon className="h-4 w-4 text-muted-foreground" />
                <div className={`flex items-center text-xs ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {metric.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Device Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Weekly Traffic</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="visits" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

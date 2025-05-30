"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Cpu, HardDrive, Wifi } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ThreeScene } from "../three-scene"

interface PerformanceMetrics {
  cpu: number
  memory: number
  network: number
  storage: number
}

export function PerformanceWidget() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 0,
    memory: 0,
    network: 0,
    storage: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 100,
        memory: 60 + Math.random() * 30,
        network: Math.random() * 100,
        storage: 75 + Math.random() * 15,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const performanceData = [metrics.cpu, metrics.memory, metrics.network, metrics.storage]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-32">
          <ThreeScene data={performanceData} className="w-full h-full rounded-lg" />
        </div>

        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">CPU</span>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.cpu.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.cpu} className="h-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.memory.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.memory} className="h-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Network</span>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.network.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.network} className="h-2" />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

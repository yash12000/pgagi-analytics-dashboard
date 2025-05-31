"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()

  const handleViewDetails = (section: string) => {
    toast({
      title: `${section} Details`,
      description: `Viewing details for ${section.toLowerCase()} section`,
      variant: "default"
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          PGAGI Analytics Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Weather</h2>
            <p className="text-gray-600 dark:text-gray-300">Weather data will be displayed here</p>
            <Button 
              className="mt-4"
              onClick={() => handleViewDetails("Weather")}
            >
              View Details
            </Button>
          </div>

          {/* News Card */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">News</h2>
            <p className="text-gray-600 dark:text-gray-300">Latest news will be displayed here</p>
            <Button 
              className="mt-4"
              onClick={() => handleViewDetails("News")}
            >
              View Details
            </Button>
          </div>

          {/* Finance Card */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Finance</h2>
            <p className="text-gray-600 dark:text-gray-300">Financial data will be displayed here</p>
            <Button 
              className="mt-4"
              onClick={() => handleViewDetails("Finance")}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
} 
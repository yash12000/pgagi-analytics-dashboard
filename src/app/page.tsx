'use client'

import { Layout } from '@/components/layout/Layout'
import { WeatherWidget } from '@/components/widgets/WeatherWidget'
import { NewsWidget } from '@/components/widgets/NewsWidget'
import { FinanceWidget } from '@/components/widgets/FinanceWidget'

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WeatherWidget />
        <NewsWidget />
        <FinanceWidget />
      </div>
    </Layout>
  )
} 
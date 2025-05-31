'use client'

import { useState } from 'react'
import { useGetTopHeadlinesQuery } from '@/services/news'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  'general',
  'business',
  'technology',
  'sports',
  'entertainment',
  'health',
  'science',
]

export function NewsWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string>('general')
  const [currentPage, setCurrentPage] = useState(1)
  const { data: news, isLoading, error } = useGetTopHeadlinesQuery({
    category: selectedCategory,
    page: currentPage,
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (error || !news) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to load news</div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            News
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!news.articles.length}
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <AnimatePresence mode="wait">
            {news.articles.map((article, index) => (
              <motion.article
                key={article.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="group cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-500"
              >
                <div className="flex items-start space-x-4">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-500 dark:text-white dark:group-hover:text-blue-400">
                      {article.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {article.description}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{article.source.name}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
} 
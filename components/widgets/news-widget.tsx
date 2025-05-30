"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchNewsData } from "@/store/slices/news-slice"
import { Loader2, Newspaper } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

const newsCategories = [
  { value: "general", label: "General" },
  { value: "technology", label: "Tech" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
]

export function NewsWidget() {
  const dispatch = useAppDispatch()
  const { data, loading, error } = useAppSelector((state) => state.news)
  const [selectedArticle, setSelectedArticle] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchNewsData("general"))
  }, [dispatch])

  const handleCategoryChange = (category: string) => {
    dispatch(fetchNewsData(category))
  }

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article)
    setIsDialogOpen(true)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Latest News
        </CardTitle>
        <Tabs defaultValue="general" onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {newsCategories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-destructive">Error loading news data. Please try again.</p>
          </div>
        ) : data?.articles?.length ? (
          <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
            {data.articles.slice(0, 5).map((article: any, index: number) => (
              <motion.div
                key={index}
                className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent"
                variants={item}
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex gap-3">
                  {article.urlToImage ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={article.urlToImage || "/placeholder.svg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                      <Newspaper className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="line-clamp-2 font-medium">{article.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString()}
                      {article.source?.name ? ` • ${article.source.name}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p className="text-center text-muted-foreground">No news articles found.</p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedArticle && (
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{selectedArticle.title}</DialogTitle>
                <DialogDescription>
                  {selectedArticle.source?.name ? `${selectedArticle.source.name} • ` : ""}
                  {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              {selectedArticle.urlToImage && (
                <div className="relative h-56 w-full overflow-hidden rounded-md">
                  <Image
                    src={selectedArticle.urlToImage || "/placeholder.svg"}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=224&width=448"
                    }}
                  />
                </div>
              )}
              <p className="text-sm">{selectedArticle.description}</p>
              <p className="text-sm">{selectedArticle.content}</p>
              <div className="flex justify-end">
                <Button as="a" href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { ToastProvider } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PGAGI Analytics Dashboard",
  description: "A comprehensive analytics dashboard for PGAGI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ReduxProvider>
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

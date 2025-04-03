import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Using CSS file as a fallback
import { TimeProvider } from "@/context/time-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Akatosh - Time Tracking",
  description: "Track your daily work time efficiently",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TimeProvider>{children}</TimeProvider>
      </body>
    </html>
  )
}



import './globals.css'
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/lib/redux/provider"
import { TranslationProvider } from "@/contexts/TranslationContext"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Astrology Services",
  description: "Professional astrology services including Kundli, horoscope matching, and spiritual guidance",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <TranslationProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}

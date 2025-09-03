import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Header from "@/components/site/Header"

export const metadata: Metadata = {
  title: "CoreTech",
  description: "Linux · Server · Network 학습 허브",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}

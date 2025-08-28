import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Header from '@/components/site/Header'

export const metadata: Metadata = {
  title: 'CoreTech — Linux 학습',
  description: 'Coretech Linux 교육 사이트',
  generator: 'coretech',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}

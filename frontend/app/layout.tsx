import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Header from "@/components/site/Header"
import { ThemeProvider } from "@/components/site/ThemeProvider"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { MobileSidebarProvider } from "@/lib/MobileSidebarContext"
import MobileSidebar from "@/components/site/MobileSidebar" // New import
import IdleLogout from "@/components/auth/IdleLogout"

export const metadata: Metadata = {
  title: "CoreTech",
  description: "Linux · Server · Network 학습 허브",
}

// Force dynamic rendering globally to avoid prerender/export errors on routes
// that depend on runtime auth, middleware redirects, or dynamic imports.
export const dynamic = "force-dynamic"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="coretech-theme-v2"
          disableTransitionOnChange
        >
          <AuthProvider>
            <MobileSidebarProvider>
              <Header />
              <IdleLogout />
              {children}
              <MobileSidebar /> {/* Render MobileSidebar here */}
            </MobileSidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

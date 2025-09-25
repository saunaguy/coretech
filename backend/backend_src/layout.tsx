import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Header from "@/components/site/Header"
import Script from "next/script"
import ScrollToTopOnPath from "@/components/site/ScrollToTopOnPath"

export const metadata: Metadata = {
  title: "CoreTech",
  description: "Linux · Server · Network 학습 허브",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Script id="force-top-on-load" strategy="beforeInteractive">
          {`
            try {
              if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
              const toTop = () => { if (location.hash) return; window.scrollTo(0, 0); document.documentElement.scrollTop = 0; document.body.scrollTop = 0; };
              // Initial DOM ready
              if (document.readyState === 'complete' || document.readyState === 'interactive') { toTop(); }
              else { window.addEventListener('DOMContentLoaded', toTop, { once: true }); }
              // BFCache restore case
              window.addEventListener('pageshow', (e) => { if ((e as any).persisted) toTop(); });
            } catch {}
          `}
        </Script>
        <Header />
        {/* Scroll to top on route/content change */}
        <ScrollToTopOnPath />
        {children}
      </body>
    </html>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function ScrollToTopOnPath() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    // Ensure the browser doesn't try to restore prior scroll on full navigations
    try { (window.history as any).scrollRestoration = "manual" } catch {}
    // If navigating to an anchor, don't override browser default
    if (window.location.hash) return

    const doScroll = () => {
      // Force top on all possible scrolling elements
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      const main = document.querySelector("main") as HTMLElement | null
      if (main) main.scrollTop = 0
    }

    // 1) immediate
    doScroll()
    // 2) next frame (after initial layout)
    const raf = requestAnimationFrame(doScroll)
    // 3) after small delay (fonts/images/layout shifts)
    timers.current.push(window.setTimeout(doScroll, 120))
    timers.current.push(window.setTimeout(doScroll, 300))
    // 4) after fonts ready (if supported)
    if ((document as any).fonts?.ready) {
      ;(document as any).fonts.ready.then(() => doScroll()).catch(() => {})
    }

    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach((t) => clearTimeout(t))
      timers.current = []
    }
  }, [pathname, searchParams?.toString()])

  return null
}

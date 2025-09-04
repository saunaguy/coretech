import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
  const styles = variant === "outline"
    ? "border border-border text-foreground"
    : "bg-primary/10 text-primary"
  return <span className={cn(base, styles, className)} {...props} />
}


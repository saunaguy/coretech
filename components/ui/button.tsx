import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    const variants: Record<string, string> = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border bg-background hover:bg-muted",
    }
    const sizes: Record<string, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-9 px-4",
      lg: "h-10 px-6 text-base",
    }
    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export default Button


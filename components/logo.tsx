import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizes[size])}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="40" height="40" rx="8" className="fill-primary" />
          <path
            d="M10 20L15 15L20 25L25 12L30 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          />
          <circle cx="30" cy="20" r="3" className="fill-primary-foreground" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", textSizes[size])}>
          <span className="text-primary">CVV</span>
          <span className="text-foreground">INVEST</span>
        </span>
      )}
    </div>
  )
}

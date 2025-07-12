import { cn } from "@/lib/utils"

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl"

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "h-3 w-3 border-[1.5px]",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-t-transparent",
        sizeClasses[size],
        className
      )}
      aria-label="読み込み中"
    />
  )
}


import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const unifiedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark border-2 border-primary shadow-lg shadow-primary/25 font-semibold",
        primary: "bg-primary text-white hover:bg-primary-dark border-2 border-primary shadow-lg shadow-primary/25 font-semibold",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-secondary font-medium",
        destructive: "bg-destructive text-white hover:bg-destructive/90 border-2 border-destructive font-semibold",
        outline: "border-2 border-primary/20 bg-background text-foreground hover:bg-primary/10 hover:border-primary/40 shadow-md font-medium",
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary border-2 border-transparent font-medium",
        link: "text-primary underline-offset-4 hover:underline border-none shadow-none font-medium",
        success: "bg-success text-white hover:bg-success/90 border-2 border-success font-semibold",
        warning: "bg-warning text-white hover:bg-warning/90 border-2 border-warning font-semibold",
        info: "bg-info text-white hover:bg-info/90 border-2 border-info font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface UnifiedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof unifiedButtonVariants> {
  asChild?: boolean
}

const UnifiedButton = React.forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(unifiedButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
UnifiedButton.displayName = "UnifiedButton"

export { UnifiedButton, unifiedButtonVariants }

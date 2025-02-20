import { forwardRef, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@/lib/utils"

export const PageTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    action?: ReactNode
    subtitle?: ReactNode
  }
>(({ action, children, className, ...otherProps }, ref) => {
  if (!children) return null

  return (
    <header
      ref={ref}
      className={cn("mb-8 min-h-10", className)}
      {...otherProps}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-foreground">{children}</h1>
        {action}
      </div>

      {otherProps.subtitle && (
        <p className="text-surface-500 text-base leading-8">
          {otherProps.subtitle}
        </p>
      )}
    </header>
  )
})

PageTitle.displayName = "PageTitle"


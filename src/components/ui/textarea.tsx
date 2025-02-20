import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 1, ...props }, ref) => {
    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      const target = event.target as HTMLTextAreaElement
      target.style.height = "auto"
      target.style.height = `${target.scrollHeight}px`
    }

    return (
      <textarea
        className={cn(
          "text-md placeholder:text-dark-600 resize-none px-1 py-3 text-base outline-none transition-colors duration-200 focus:ring-0",
          className
        )}
        ref={ref}
        rows={rows}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
TextArea.displayName = "Textarea"

export { TextArea }

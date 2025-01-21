"use client"

import { forwardRef, type ComponentProps, type ElementRef } from "react"
import { Button, Loading } from "@lemonsqueezy/wedges"
import { useFormStatus } from "react-dom"

type ButtonElement = ElementRef<typeof Button>
type ButtonProps = ComponentProps<typeof Button>

export const SubmitButton = forwardRef<ButtonElement, ButtonProps>(
  (props, ref) => {
    const { pending } = useFormStatus()
    const before = pending ? (
      <Loading size="sm" className="dark" color="secondary" />
    ) : (
      props.before
    )

    return (
      <Button
        {...props}
        before={before}
        ref={ref}
        disabled={pending || props.disabled}
      />
    )
  }
)

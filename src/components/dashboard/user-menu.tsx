"use client"

import { useState } from "react"
import { logout } from "@/actions/subscription-action"
import { Avatar, DropdownMenu, Loading } from "@lemonsqueezy/wedges"
import { ChevronRightIcon, MoreVertical } from "lucide-react"
import { type User } from "next-auth"

export function UserMenu(props: { user?: User }) {
  const { user } = props
  const [loading, setLoading] = useState(false)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger
        className="text-surface-700 hover:bg-surface-700/10 hover:text-surface-900 focus-visible:bg-surface-900/5 focus-visible:text-surface-900 group flex w-full items-center justify-between gap-3 rounded-md px-4 py-2 transition-colors focus:outline-none disabled:pointer-events-none"
        disabled={loading}
      >
        <>
          {loading ? (
            <div className="bg-surface-200/50 flex size-8 items-center justify-center rounded-full">
              <Loading size="sm" className="size-5" />
            </div>
          ) : (
            <Avatar
              className="group-disabled:opacity-50"
              size="sm"
              src={user.image ?? undefined}
              alt={user.name ?? undefined}
            />
          )}

          <div className="text-start leading-5 group-disabled:opacity-50">
            <div className="max-w-[130px] truncate font-medium">
              {user.name}
            </div>
          </div>

          <MoreVertical
            size={16}
            className="ml-auto shrink-0 opacity-70 group-disabled:opacity-50"
            strokeWidth={1.5}
          />
        </>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="min-w-[226px]">
        <DropdownMenu.Group>
          <DropdownMenu.Item
            onClick={async () => {
              setLoading(true)
              await logout()
            }}
          >
            <>
              <span>Sign out</span>
              <ChevronRightIcon className="ml-auto" aria-hidden size="16" />
            </>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

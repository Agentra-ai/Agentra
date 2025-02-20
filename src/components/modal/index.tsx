import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import clsx from "clsx"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// https://headlessui.com/react/dialog

type IModal = {
  className?: string
  wrapperClassName?: string
  isShow: boolean
  onClose?: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  closableIcon?: boolean
  overflowVisible?: boolean
}

export default function Modal({
  className,
  wrapperClassName,
  isShow,
  onClose = () => {},
  title,
  description,
  children,
  closableIcon = false,
  overflowVisible = false,
}: IModal) {
  return (
    <Transition appear show={isShow} as={Fragment}>
      <Dialog as="div" className={clsx("")} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={cn("fixed inset-0 bg-black/30", wrapperClassName)} />
        </Transition.Child>

        <div
          className="fixed inset-0 z-40 overflow-y-auto"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center text-sm">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "relative z-40 rounded-lg bg-white p-4 shadow-xl",
                  overflowVisible ? "overflow-visible" : "overflow-hidden",
                  className
                )}
              >
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-2 text-xs font-normal text-gray-500">
                    {description}
                  </Dialog.Description>
                )}
                {closableIcon && (
                  <div className="absolute right-6 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-2xl hover:cursor-pointer hover:bg-gray-100">
                    <X
                      className="h-4 w-4 text-gray-500"
                      fill="black"
                      onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                      }}
                    />
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

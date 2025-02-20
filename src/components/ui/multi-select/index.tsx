import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { ArrowDown } from "lucide-react"

interface Option {
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: Option[]
  onChange: (value: Option[]) => void
  className?: string
  disabled?: boolean
}

const MultiSelect = ({
  options,
  selected,
  onChange,
  className = "",
  disabled = false,
}: MultiSelectProps) => {
  // Filter out duplicates based on label
  const handleChange = (newSelection: Option[]) => {
    const uniqueSelection = newSelection.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.label === item.label)
    )
    onChange(uniqueSelection)
  }

  // Add handler for removing individual items
  const handleRemoveItem = (itemToRemove: Option) => {
    const newSelection = selected.filter(
      (item) => item.label !== itemToRemove.label
    )
    onChange(newSelection)
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Listbox
        value={selected}
        onChange={handleChange}
        multiple
        disabled={disabled}
      >
        <Listbox.Button
          className={clsx(
            "relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2",
            {
              "pointer-events-none cursor-not-allowed bg-gray-50 text-gray-400":
                disabled,
            }
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length === 0 ? (
              <span className="text-gray-500">Select options...</span>
            ) : (
              selected.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-sm "
                >
                  {item.label}
                  <span
                    onClick={(e) => {
                      e.stopPropagation() // Prevent Listbox from opening
                      handleRemoveItem(item)
                    }}
                    className="ml-1 block cursor-pointer hover:text-red-500"
                  >
                    <span>&times;</span>
                  </span>
                </span>
              ))
            )}
          </div>
          <ArrowDown
            className={clsx(
              "fill-dark-800 absolute right-[16px] top-[16px] w-[6px] rotate-90",
              {
                "fill-gray-400": disabled,
              }
            )}
          />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute top-full !z-50 mt-2 max-h-[200px] w-full overflow-y-auto rounded-[4px] bg-white px-2 py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {options.map((option) => (
              <Listbox.Option
                key={option.label}
                value={option}
                className={({ active, selected }) =>
                  `my-1 cursor-pointer select-none rounded-[4px] px-3 py-1.5 text-[14px] text-[#05192D] ${
                    (active || selected) && "bg-[#3039690f]"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  )
}

export default MultiSelect

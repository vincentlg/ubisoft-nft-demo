import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils/utils"
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  onInputUpdate?: (value: string) => void
}

import React from 'react';
import { trimDecimals } from "@/lib/utils/priceUtil";
import globalConfig from "@/config/globalConfig";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    const [value, setValue] = React.useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value
      if(type == 'number') {
        value = trimDecimals(event.target.value, globalConfig.decimals.inputMaxDecimals)
      }

      setValue(value)
      if (props.onInputUpdate) {
        props.onInputUpdate(value)
      }
    }

    // Clear the input
    const handleClear = () => {
      setValue("")

      // Creating a synthetic event
      const event = new Event("input", { bubbles: true })
      // If the ref is attached to the input element, manually set its value to empty string
      if (ref && "current" in ref && ref.current) {
        ref.current.value = ""
        // Dispatch the event from the input element
        ref.current.dispatchEvent(event)
      }
      if (props.onInputUpdate) {
        props.onInputUpdate("")
      }
    }

    return (
      <div
        className={cn(
          "relative flex h-12 items-center rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className="mr-3">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          className="h-full w-full bg-background text-sm font-medium outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-semibold placeholder:text-muted-foreground"
          ref={ref}
          {...props}
        />
        {value && (
          <button onClick={handleClear} className="ml-2 text-sm">
            <XIcon size={16} />
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

import { cn } from "@/lib/utils"
import { SpinnerIosRegular } from "@fluentui/react-icons"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <SpinnerIosRegular data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }

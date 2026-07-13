"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckmarkCircleRegular, InfoRegular, WarningRegular, DismissCircleRegular, SpinnerIosRegular } from "@fluentui/react-icons"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CheckmarkCircleRegular className="size-4" />
        ),
        info: (
          <InfoRegular className="size-4" />
        ),
        warning: (
          <WarningRegular className="size-4" />
        ),
        error: (
          <DismissCircleRegular className="size-4" />
        ),
        loading: (
          <SpinnerIosRegular className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

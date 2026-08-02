import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { UserProfile } from '@/components/shared/sidebar'

export const Route = createFileRoute('/_admin/events/list')({
  beforeLoad: () => {
    try {
      const rawUser = sessionStorage.getItem("currentUser")
      if (rawUser) {
        const user = JSON.parse(rawUser) as UserProfile
        if (user.role === "ADMIN_HR") {
          throw redirect({ to: "/dashboard" })
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("Redirect")) throw e;
    }
  },
  component: EventsRoute,
})

function EventsRoute() {
  return <div>Event Logistics Management</div>
}

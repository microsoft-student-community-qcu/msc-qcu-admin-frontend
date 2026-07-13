import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/events/list')({
  component: EventsRoute,
})

function EventsRoute() {
  return <div>Event Logistics Management</div>
}

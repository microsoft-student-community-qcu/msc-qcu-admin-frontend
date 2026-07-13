import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/events/')({
  component: EventsRoute,
})

function EventsRoute() {
  return <div>Event Logistics Management</div>
}

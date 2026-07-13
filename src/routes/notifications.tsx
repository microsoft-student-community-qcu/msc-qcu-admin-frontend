import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notifications')({
  component: NotificationsRoute,
})

function NotificationsRoute() {
  return <div>Inbox / Notifications</div>
}

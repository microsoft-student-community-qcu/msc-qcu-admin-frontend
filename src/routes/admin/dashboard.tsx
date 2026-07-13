import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return <div>Admin Dashboard</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/applications/')({
  component: ApplicationsRoute,
})

function ApplicationsRoute() {
  return <div>Applicant Tracking List</div>
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/applications/$applicationId')({
  component: ApplicationDetailRoute,
})

function ApplicationDetailRoute() {
  const { applicationId } = Route.useParams()
  return <div>Details for Application: {applicationId}</div>
}

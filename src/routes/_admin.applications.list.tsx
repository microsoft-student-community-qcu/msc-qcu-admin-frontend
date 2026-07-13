import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/applications/list')({
  component: ApplicationsRoute,
})

function ApplicationsRoute() {
  return <div>Applicant Tracking List</div>
}

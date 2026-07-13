import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/events/scan')({
  component: ScannerRoute,
})

function ScannerRoute() {
  return <div>QR Scanner UI</div>
}

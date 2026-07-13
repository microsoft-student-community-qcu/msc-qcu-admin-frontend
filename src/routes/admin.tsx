import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar would go here */}
      <aside className="w-64 bg-gray-100 p-4">Admin Sidebar</aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}

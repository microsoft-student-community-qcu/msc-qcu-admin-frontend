import { ChartConfig } from "@/components/ui/chart"

export const applicationsData = [
  { month: "Jan", apps: 120 },
  { month: "Feb", apps: 150 },
  { month: "Mar", apps: 180 },
  { month: "Apr", apps: 220 },
  { month: "May", apps: 250 },
  { month: "Jun", apps: 310 },
]

export const appChartConfig = {
  apps: {
    label: "Applications",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export const departmentData = [
  { department: "Engineering", students: 275, fill: "var(--color-Engineering)" },
  { department: "Design", students: 200, fill: "var(--color-Design)" },
  { department: "Marketing", students: 150, fill: "var(--color-Marketing)" },
  { department: "Operations", students: 100, fill: "var(--color-Operations)" },
  { department: "Research", students: 80, fill: "var(--color-Research)" },
  { department: "General", students: 87, fill: "var(--color-General)" },
]

export const deptChartConfig = {
  students: {
    label: "Students",
  },
  Engineering: {
    label: "Engineering & Dev",
    color: "var(--color-chart-1)",
  },
  Design: {
    label: "Design & Creatives",
    color: "var(--color-chart-2)",
  },
  Marketing: {
    label: "Marketing & Comms",
    color: "var(--color-chart-3)",
  },
  Operations: {
    label: "Operations & Logistics",
    color: "var(--color-chart-4)",
  },
  Research: {
    label: "Research & Curriculum",
    color: "var(--color-chart-5)",
  },
  General: {
    label: "General Member",
    color: "var(--color-muted-foreground)",
  },
} satisfies ChartConfig

export const recentApplications = [
  { id: "APP-001", name: "Juan Dela Cruz", role: "Engineering / Development", status: "PENDING_REVIEW", manual_application: true, time: "2 hours ago" },
  { id: "APP-002", name: "Maria Santos", role: "Design & Creatives", status: "APPROVED", manual_application: false, time: "5 hours ago" },
  { id: "APP-003", name: "Pedro Penduko", role: "Engineering / Development", status: "REJECTED", manual_application: false, time: "1 day ago" },
  { id: "APP-004", name: "Ana Reyes", role: "Marketing & Communications", status: "PENDING_REVIEW", manual_application: false, time: "1 day ago" },
]

export const recentEvents = [
  { id: "EVT-001", name: "Tech Summit 2026", date: "Aug 15, 2026", status: "Upcoming", attendees: 120, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop" },
  { id: "EVT-002", name: "React Workshop", date: "Jul 20, 2026", status: "Upcoming", attendees: 45, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop" },
  { id: "EVT-003", name: "General Assembly", date: "Jul 10, 2026", status: "Completed", attendees: 250, image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop" },
]

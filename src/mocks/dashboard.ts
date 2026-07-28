import { ChartConfig } from "@/components/ui/chart";

export const applicationsData = [
  { month: "Jan", apps: 120 },
  { month: "Feb", apps: 150 },
  { month: "Mar", apps: 180 },
  { month: "Apr", apps: 220 },
  { month: "May", apps: 250 },
  { month: "Jun", apps: 310 },
];

export const appChartConfig = {
  apps: {
    label: "Applications",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export const departmentData = [
  { department: "Secretariat", students: 45, fill: "var(--color-chart-1)" },
  { department: "Relations", students: 60, fill: "var(--color-chart-2)" },
  { department: "Finance", students: 30, fill: "var(--color-chart-3)" },
  { department: "Logistics", students: 80, fill: "var(--color-chart-4)" },
  { department: "Creatives", students: 120, fill: "var(--color-chart-5)" },
  { department: "ManagementDev", students: 150, fill: "var(--color-chart-6)" },
  { department: "StartupDevelopers", students: 95, fill: "var(--color-chart-7)" },
];

export const deptChartConfig = {
  students: {
    label: "Students",
  },
  Secretariat: {
    label: "Secretariat Office",
    color: "var(--color-chart-1)",
  },
  Relations: {
    label: "Relations Office",
    color: "var(--color-chart-2)",
  },
  Finance: {
    label: "Finance Office",
    color: "var(--color-chart-3)",
  },
  Logistics: {
    label: "Logistics Office",
    color: "var(--color-chart-4)",
  },
  Creatives: {
    label: "Creatives Office",
    color: "var(--color-chart-5)",
  },
  ManagementDev: {
    label: "Management & Dev. Office",
    color: "var(--color-chart-6)",
  },
  StartupDevelopers: {
    label: "Startup Developers Office",
    color: "var(--color-chart-7)",
  },
} satisfies ChartConfig;

export const recentApplications = [
  {
    id: "APP-001",
    name: "Juan Dela Cruz",
    role: "Management & Dev. Office",
    status: "PENDING_REVIEW",
    manual_application: true,
    time: "2 hours ago",
  },
  {
    id: "APP-002",
    name: "Maria Santos",
    role: "Creatives Office",
    status: "APPROVED",
    manual_application: false,
    time: "5 hours ago",
  },
  {
    id: "APP-003",
    name: "Pedro Penduko",
    role: "Startup Developers Office",
    status: "REJECTED",
    manual_application: false,
    time: "1 day ago",
  },
  {
    id: "APP-004",
    name: "Ana Reyes",
    role: "Relations Office",
    status: "PENDING_REVIEW",
    manual_application: false,
    time: "1 day ago",
  },
];

export const recentEvents = [
  {
    id: "EVT-001",
    name: "Tech Summit 2026",
    date: "Aug 15, 2026",
    status: "Upcoming",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop",
  },
  {
    id: "EVT-002",
    name: "React Workshop",
    date: "Jul 20, 2026",
    status: "Upcoming",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop",
  },
  {
    id: "EVT-003",
    name: "General Assembly",
    date: "Jul 10, 2026",
    status: "Completed",
    attendees: 250,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop",
  },
];

export const eventAttendanceData = [
  { event: "General Assembly", registered: 260, attended: 250 },
  { event: "React Workshop", registered: 55, attended: 45 },
  { event: "Tech Summit", registered: 140, attended: 120 },
  { event: "Dev Showdown", registered: 95, attended: 80 },
];

export const eventChartConfig = {
  registered: {
    label: "Registered",
    color: "var(--color-primary)",
  },
  attended: {
    label: "Attended (Checked In)",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export const eventRatingsData = [
  { rating: "5 Stars", count: 230 },
  { rating: "4 Stars", count: 110 },
  { rating: "3 Stars", count: 32 },
  { rating: "2 Stars", count: 12 },
  { rating: "1 Star", count: 5 },
];

export const eventRatingsConfig = {
  count: {
    label: "Reviews",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

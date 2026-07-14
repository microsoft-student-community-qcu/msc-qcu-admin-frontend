import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, XAxis, Pie, PieChart, Label } from "recharts"
import { Users, Calendar, ClipboardList, Activity, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { Badge } from '@/components/ui/badge'
import {
  applicationsData,
  appChartConfig,
  departmentData,
  deptChartConfig,
  recentApplications,
  recentEvents
} from '@/mocks/dashboard'

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  const totalStudents = React.useMemo(() => {
    return departmentData.reduce((acc, curr) => acc + curr.students, 0)
  }, [])

  return (
    <div className="flex flex-col gap-size320 h-[calc(100vh-7.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-size240 shrink-0">
        <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-medium">+12%</span>&nbsp;from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Next event in 7 days
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">14</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Requires your attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-4 border-transparent bg-background overflow-hidden relative group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 z-10 relative">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-2%</span>&nbsp;from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-size240 flex-1 min-h-0">
        
        {/* Row 1 Left Side: Equal-width Charts Container */}
        <div className="lg:col-span-3 lg:row-span-1 grid grid-cols-1 md:grid-cols-5 gap-size240 min-h-0">
          <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0 md:col-span-3">
            <CardHeader className="shrink-0">
              <CardTitle>Application Growth</CardTitle>
              <CardDescription>
                Showing total applications for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 min-h-0 flex flex-col">
              <ChartContainer config={appChartConfig} className="aspect-auto flex-1 w-full min-h-0">
                <AreaChart
                  data={applicationsData}
                  margin={{
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    type="monotone"
                    dataKey="apps"
                    fill="var(--color-apps)"
                    fillOpacity={0.2}
                    stroke="var(--color-apps)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0 md:col-span-2">
            <CardHeader className="shrink-0">
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Breakdown of active members by department</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4 flex flex-row items-center justify-between gap-size240 min-h-0">
              <div className="w-[58%] h-full flex items-center justify-center relative">
                <ChartContainer config={deptChartConfig} className="aspect-square w-full h-full max-h-[280px]">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={departmentData}
                      dataKey="students"
                      nameKey="department"
                      innerRadius="60%"
                      outerRadius="98%"
                      strokeWidth={5}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl sm:text-2xl font-bold text-foreground leading-none">
                    {totalStudents.toLocaleString()}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">
                    Total Students
                  </span>
                </div>
              </div>
              <div className="w-[42%] flex flex-col gap-size80 pr-size160 justify-center min-w-0">
                {departmentData.map((item) => {
                  const config = deptChartConfig[item.department as keyof typeof deptChartConfig];
                  return (
                    <div key={item.department} className="flex items-center gap-size80 text-xs min-w-0">
                      <div 
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]" 
                        style={{ backgroundColor: `var(--color-${item.department})` }}
                      />
                      <span className="text-muted-foreground truncate flex-1 min-w-0" title={config?.label}>
                        {config?.label}
                      </span>
                      <span className="font-semibold text-foreground shrink-0 tabular-nums ml-2">{item.students}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-4 border-transparent bg-background flex flex-col lg:col-span-1 lg:row-span-2 h-full min-h-0">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest membership applications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-y-auto pb-4">
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{app.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{app.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {(() => {
                      if (app.status === "APPROVED") {
                        return (
                          <Badge 
                            variant="default"
                            className="font-normal text-xs bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15"
                          >
                            Approved
                          </Badge>
                        )
                      }
                      if (app.status === "REJECTED") {
                        return (
                          <Badge variant="destructive" className="font-normal text-xs">
                            Rejected
                          </Badge>
                        )
                      }
                      if (app.status === "PENDING_REVIEW") {
                        if (app.manual_application) {
                          return (
                            <Badge 
                              variant="outline"
                              className="font-normal text-xs bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-emerald-400 border border-amber-500/30 hover:bg-amber-500/15"
                            >
                              Quarantined
                            </Badge>
                          )
                        }
                        return (
                          <Badge variant="secondary" className="font-normal text-xs">
                            Pending Review
                          </Badge>
                        )
                      }
                      return (
                        <Badge variant="outline" className="font-normal text-xs">
                          {app.status}
                        </Badge>
                      )
                    })()}
                    <span className="text-xs flex items-center text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {app.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-4 border-transparent bg-background flex flex-col h-full lg:col-span-2 min-h-0">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming & Recent Events</CardTitle>
                <CardDescription>Events schedule and history</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-size160 flex-1 min-h-0">
              {recentEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="group flex flex-col overflow-hidden border border-border bg-card hover:bg-muted/50 shadow-2 h-full">
                  <div className="aspect-video w-full overflow-hidden bg-muted border-b border-border">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div className="mb-4">
                      <p className="font-semibold leading-none">{event.name}</p>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-medium text-muted-foreground">
                        {event.attendees} attendees
                      </span>
                      <Badge 
                        variant={event.status === 'Upcoming' ? 'default' : 'outline'}
                        className={event.status === 'Upcoming' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inbox / Notifications */}
        <Card className="shadow-4 border-transparent bg-background flex flex-col h-full lg:col-span-1 min-h-0">
          <CardHeader className="shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>Recent notifications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-y-auto pb-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Update</span>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">Maintenance scheduled for tomorrow at 2 AM.</p>
              </div>
              <div className="flex flex-col gap-2 p-3 bg-card border border-border hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New Message</span>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">Sarah commented on your recent proposal.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

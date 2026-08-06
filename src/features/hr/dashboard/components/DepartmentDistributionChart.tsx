import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useDashboardStats } from "@/features/hr/shared/hooks/useDashboardStats";

const deptChartConfig = {
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

const getDeptKey = (deptStr: string): string => {
  if (!deptStr) return "Secretariat";
  const upper = deptStr.toUpperCase().trim();
  const map: Record<string, string> = {
    SECRETARIAT_OFFICE: "Secretariat",
    RELATIONS_OFFICE: "Relations",
    FINANCE_OFFICE: "Finance",
    LOGISTICS_OFFICE: "Logistics",
    CREATIVES_OFFICE: "Creatives",
    MANAGEMENT_AND_DEVELOPMENT_OFFICE: "ManagementDev",
    STARTUP_DEVELOPERS_OFFICE: "StartupDevelopers",
  };
  
  if (map[upper]) return map[upper];

  const lower = deptStr.toLowerCase();
  if (lower.includes("secretariat")) return "Secretariat";
  if (lower.includes("relations")) return "Relations";
  if (lower.includes("finance")) return "Finance";
  if (lower.includes("logistics")) return "Logistics";
  if (lower.includes("creative") || lower.includes("design")) return "Creatives";
  if (lower.includes("startup")) return "StartupDevelopers";
  if (lower.includes("management") || lower.includes("dev")) return "ManagementDev";
  return "Secretariat";
};

export const DepartmentDistributionChart: React.FC = () => {
  const { data: stats } = useDashboardStats();
  const departmentDistribution = stats?.departmentDistribution || [];

  const departmentData = React.useMemo(() => {
    const counts = {
      Secretariat: 0,
      Relations: 0,
      Finance: 0,
      Logistics: 0,
      Creatives: 0,
      ManagementDev: 0,
      StartupDevelopers: 0,
    };
    departmentDistribution.forEach((item: { department: string; count: number }) => {
      const key = getDeptKey(item.department);
      if (key in counts) {
        counts[key as keyof typeof counts] += item.count;
      }
    });

    return [
      { department: "Secretariat", students: counts.Secretariat, fill: "var(--color-chart-1)" },
      { department: "Relations", students: counts.Relations, fill: "var(--color-chart-2)" },
      { department: "Finance", students: counts.Finance, fill: "var(--color-chart-3)" },
      { department: "Logistics", students: counts.Logistics, fill: "var(--color-chart-4)" },
      { department: "Creatives", students: counts.Creatives, fill: "var(--color-chart-5)" },
      { department: "ManagementDev", students: counts.ManagementDev, fill: "var(--color-chart-6)" },
      { department: "StartupDevelopers", students: counts.StartupDevelopers, fill: "var(--color-chart-7)" },
    ];
  }, [departmentDistribution]);

  const totalStudents = React.useMemo(() => {
    return departmentData.reduce((acc, curr) => acc + curr.students, 0);
  }, [departmentData]);

  return (
    <Card className="shadow-4 border-transparent bg-card flex flex-col h-full min-h-0 md:col-span-2">
      <CardHeader className="shrink-0">
        <CardTitle>Office Distribution</CardTitle>
        <CardDescription>Breakdown of active members by office</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 flex flex-row items-center justify-between gap-size240 min-h-0">
        <div className="w-[58%] h-full flex items-center justify-center relative">
          <ChartContainer
            config={deptChartConfig}
            className="aspect-square w-full h-full max-h-70"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
            const config = deptChartConfig[item.department as keyof typeof deptChartConfig] as { label: string; color?: string };
            return (
              <div key={item.department} className="flex items-center gap-size80 text-xs min-w-0">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-xs"
                  style={{ backgroundColor: config?.color || "var(--color-chart-1)" }}
                />
                <span
                  className="text-muted-foreground truncate flex-1 min-w-0"
                  title={config?.label}
                >
                  {config?.label}
                </span>
                <span className="font-semibold text-foreground shrink-0 tabular-nums ml-2">
                  {item.students}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentDistributionChart;

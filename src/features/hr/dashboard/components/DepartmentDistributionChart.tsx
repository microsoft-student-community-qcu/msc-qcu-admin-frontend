import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { deptChartConfig } from "@/mocks/dashboard";
import { useApplicants } from "@/features/hr/shared/hooks/useApplicants";

const getDeptKey = (deptStr: string): string => {
  const lower = deptStr.toLowerCase();
  if (lower.includes("engineering") || lower.includes("dev")) return "Engineering";
  if (lower.includes("design") || lower.includes("creative")) return "Design";
  if (lower.includes("marketing") || lower.includes("comm")) return "Marketing";
  if (lower.includes("operation") || lower.includes("logistics")) return "Operations";
  if (lower.includes("research") || lower.includes("curriculum")) return "Research";
  return "General";
};

export const DepartmentDistributionChart: React.FC = () => {
  const { data: applicants = [] } = useApplicants();

  const departmentData = React.useMemo(() => {
    const counts = {
      Engineering: 0,
      Design: 0,
      Marketing: 0,
      Operations: 0,
      Research: 0,
      General: 0,
    };

    const activeMembers = applicants.filter(app => app.status === "APPROVED");
    activeMembers.forEach(app => {
      const key = getDeptKey(app.department);
      counts[key as keyof typeof counts] += 1;
    });

    return [
      { department: "Engineering", students: counts.Engineering, fill: "var(--color-Engineering)" },
      { department: "Design", students: counts.Design, fill: "var(--color-Design)" },
      { department: "Marketing", students: counts.Marketing, fill: "var(--color-Marketing)" },
      { department: "Operations", students: counts.Operations, fill: "var(--color-Operations)" },
      { department: "Research", students: counts.Research, fill: "var(--color-Research)" },
      { department: "General", students: counts.General, fill: "var(--color-General)" },
    ];
  }, [applicants]);

  const totalStudents = React.useMemo(() => {
    return departmentData.reduce((acc, curr) => acc + curr.students, 0);
  }, [departmentData]);

  return (
    <Card className="shadow-4 border-transparent bg-background flex flex-col h-full min-h-0 md:col-span-2">
      <CardHeader className="shrink-0">
        <CardTitle>Department Distribution</CardTitle>
        <CardDescription>Breakdown of active members by department</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 flex flex-row items-center justify-between gap-size240 min-h-0">
        <div className="w-[58%] h-full flex items-center justify-center relative">
          <ChartContainer
            config={deptChartConfig}
            className="aspect-square w-full h-full max-h-[280px]"
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
            const config = deptChartConfig[item.department as keyof typeof deptChartConfig];
            return (
              <div key={item.department} className="flex items-center gap-size80 text-xs min-w-0">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: `var(--color-${item.department})` }}
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

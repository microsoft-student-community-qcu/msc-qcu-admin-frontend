import { useQuery } from "@tanstack/react-query";
import { fetchApplicants, fetchDashboardStats } from "../services/applicantApi";

export interface DashboardStats {
  applicationGrowth: {
    month: string; // YYYY-MM
    count: number;
  }[];
  departmentDistribution: {
    department: string;
    count: number;
  }[];
  campusDistribution: {
    campus: string;
    count: number;
  }[];
  verificationMethodDistribution?: {
    automatedOcr: number;
    manualUpload: number;
  };
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async (): Promise<DashboardStats> => {
      try {
        return await fetchDashboardStats();
      } catch (err) {
        console.warn("New dashboard stats endpoint failed, using fallback:", err);
        
        // Fallback: Fetch all/large page of applicants to compute statistics client-side
        const res = await fetchApplicants({ limit: 1000 });
        const applicants = res.applicants;

        // 1. Applications Growth (submissionDates) grouped by YYYY-MM
        const growthCounts: Record<string, number> = {};
        // Initialize last 6 months with 0 counts
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const yyyymm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          growthCounts[yyyymm] = 0;
        }

        applicants.forEach((app) => {
          const d = new Date(app.submissionDate);
          const yyyymm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          if (yyyymm in growthCounts) {
            growthCounts[yyyymm]++;
          }
        });

        const applicationGrowth = Object.entries(growthCounts)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, count]) => ({ month, count }));

        // 2. Department Distribution (APPROVED only)
        const approved = applicants.filter((app) => app.status === "APPROVED");
        
        const deptCounts: Record<string, number> = {};
        approved.forEach((app) => {
          deptCounts[app.department] = (deptCounts[app.department] || 0) + 1;
        });
        const departmentDistribution = Object.entries(deptCounts).map(([department, count]) => ({
          department,
          count,
        }));

        // 3. Campus Distribution (APPROVED only)
        const campusCounts: Record<string, number> = {};
        approved.forEach((app) => {
          campusCounts[app.campus] = (campusCounts[app.campus] || 0) + 1;
        });
        const campusDistribution = Object.entries(campusCounts).map(([campus, count]) => ({
          campus,
          count,
        }));

        // 4. Verification Method Distribution (OCR vs Manual)
        let automatedOcr = 0;
        let manualUpload = 0;
        applicants.forEach((app) => {
          if (app.manualApplication) {
            manualUpload++;
          } else {
            automatedOcr++;
          }
        });
        const verificationMethodDistribution = { automatedOcr, manualUpload };

        return {
          applicationGrowth,
          departmentDistribution,
          campusDistribution,
          verificationMethodDistribution,
        };
      }
    },
    retry: false,
  });
}

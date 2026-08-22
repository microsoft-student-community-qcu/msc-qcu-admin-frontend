import * as React from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAdminUsers, updateUserRole } from "../services/adminApi";
import type { AdminUsersResponse } from "../types/adminTypes";
import type { UserRole } from "@/types/roles";
import { useDebounce } from "@/hooks/useDebounce";

export interface UseAdminUsersOptions {
  initialSearch?: string;
  initialRole?: string;
  initialPageSize?: number;
  debounceMs?: number;
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRole(userId, role),
    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });
      const previousQueries = queryClient.getQueriesData({
        queryKey: ["admin", "users"],
      });

      queryClient.setQueriesData<InfiniteData<AdminUsersResponse>>(
        { queryKey: ["admin", "users"] },
        (old) => {
          if (!old || !Array.isArray(old.pages)) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                users: Array.isArray(page.data?.users)
                  ? page.data.users.map((u) => (u.id === userId ? { ...u, role } : u))
                  : [],
              },
            })),
          };
        },
      );

      return { previousQueries };
    },
    onSuccess: (data) => {
      toast.success(data.message || "User role updated successfully");
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to update user role");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedApplicants"] });
      queryClient.invalidateQueries({ queryKey: ["applicantCounts"] });
    },
  });
}

export function useAdminUsers(options?: UseAdminUsersOptions) {
  const [search, setSearch] = React.useState(options?.initialSearch ?? "");
  const [role, setRole] = React.useState(options?.initialRole ?? "ALL");
  const pageSize = options?.initialPageSize ?? 15;

  const debouncedSearch = useDebounce(search, options?.debounceMs ?? 300);

  const query = useInfiniteQuery({
    queryKey: ["admin", "users", "infinite", debouncedSearch, role, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      fetchAdminUsers({
        search: debouncedSearch.trim() || undefined,
        role: role && role !== "ALL" ? role : undefined,
        page: pageParam,
        pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
    gcTime: 1000 * 60 * 15, // 15 minutes garbage collection time
    placeholderData: keepPreviousData,
  });

  const users = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((p) => p.data.users);
  }, [query.data]);

  const total = query.data?.pages[0]?.data.pagination.total ?? 0;
  const updateUserRoleMutation = useUpdateUserRole();

  return {
    ...query,
    users,
    total,
    search,
    setSearch,
    debouncedSearch,
    role,
    setRole,
    updateUserRole: updateUserRoleMutation,
  };
}

export default useAdminUsers;

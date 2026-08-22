import * as React from "react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAuditLogs } from "../services/adminApi";
import type { AuditAction } from "../types/adminTypes";
import { useDebounce } from "@/hooks/useDebounce";

export interface UseAuditLogsOptions {
  initialAction?: AuditAction | "ALL";
  initialActorId?: string;
  initialFrom?: string;
  initialTo?: string;
  initialPageSize?: number;
}

export function useAuditLogs(options?: UseAuditLogsOptions) {
  const [action, setAction] = React.useState<AuditAction | "ALL" | undefined>(
    options?.initialAction ?? "ALL",
  );
  const [actorId, setActorId] = React.useState(options?.initialActorId ?? "");
  const [from, setFrom] = React.useState(options?.initialFrom ?? "");
  const [to, setTo] = React.useState(options?.initialTo ?? "");
  const pageSize = options?.initialPageSize ?? 20;

  const debouncedActorId = useDebounce(actorId, 300);

  const query = useInfiniteQuery({
    queryKey: ["admin", "audit-logs", "infinite", action, debouncedActorId, from, to, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      fetchAuditLogs({
        action: action && action !== "ALL" ? action : undefined,
        actorId: debouncedActorId.trim() || undefined,
        from: from.trim() || undefined,
        to: to.trim() || undefined,
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
    placeholderData: keepPreviousData,
  });

  const logs = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.pages.flatMap((p) => p.data.logs);
  }, [query.data]);

  const total = query.data?.pages[0]?.data.pagination.total ?? 0;
  const integrity = query.data?.pages[0]?.data.integrity ?? {
    integrityOk: true,
    total: 0,
    breakIndex: null,
  };

  const resetFilters = React.useCallback(() => {
    setAction(options?.initialAction ?? "ALL");
    setActorId(options?.initialActorId ?? "");
    setFrom(options?.initialFrom ?? "");
    setTo(options?.initialTo ?? "");
  }, [options]);

  return {
    ...query,
    logs,
    total,
    integrity,
    action,
    setAction,
    actorId,
    setActorId,
    from,
    setFrom,
    to,
    setTo,
    resetFilters,
  };
}

export default useAuditLogs;

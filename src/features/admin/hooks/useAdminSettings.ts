import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSystemSettings, updateSystemSettings } from "../services/adminApi";
import type {
  SystemSettingsResponse,
  SystemSetting,
  SettingKey,
  UpdateSettingsInput,
} from "../types/adminTypes";

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsInput) => updateSystemSettings(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "settings"] });
      const prevSettings = queryClient.getQueryData<SystemSettingsResponse>(["admin", "settings"]);

      if (prevSettings) {
        queryClient.setQueryData<SystemSettingsResponse>(["admin", "settings"], {
          ...prevSettings,
          data: {
            ...prevSettings.data,
            settings: prevSettings.data.settings.map((s) => {
              if (s.key in newSettings) {
                return {
                  ...s,
                  value: newSettings[s.key as keyof UpdateSettingsInput] ?? s.value,
                  updatedAt: new Date().toISOString(),
                };
              }
              return s;
            }),
          },
        });
      }

      return { prevSettings };
    },
    onSuccess: (data) => {
      toast.success(data.message || "System settings updated successfully");
    },
    onError: (error: Error, _vars, context) => {
      if (context?.prevSettings) {
        queryClient.setQueryData(["admin", "settings"], context.prevSettings);
      }
      toast.error(error.message || "Failed to update system settings");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
}

export function useAdminSettings() {
  const query = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: fetchSystemSettings,
  });

  const updateMutation = useUpdateSystemSettings();

  const settingsData = query.data?.data.settings;
  const settings = React.useMemo(() => settingsData ?? [], [settingsData]);

  const settingsMap = React.useMemo(() => {
    const map: Partial<Record<SettingKey, SystemSetting>> = {};
    if (settingsData) {
      for (const item of settingsData) {
        map[item.key] = item;
      }
    }
    return map;
  }, [settingsData]);

  const updateSetting = React.useCallback(
    (key: SettingKey, value: boolean) => {
      return updateMutation.mutateAsync({ [key]: value });
    },
    [updateMutation],
  );

  return {
    ...query,
    settings,
    settingsMap,
    updateSettings: updateMutation,
    updateSetting,
    isUpdating: updateMutation.isPending,
  };
}

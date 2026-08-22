import React from "react";
import {
  CalendarRegular,
  ShoppingBagRegular,
  WrenchRegular,
  ArrowClockwiseRegular,
  WarningRegular,
  InfoRegular,
} from "@fluentui/react-icons";

import { useAdminSettings } from "../hooks/useAdminSettings";
import type { SettingKey, SystemSetting } from "../types/adminTypes";

import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingCardConfig {
  key: SettingKey;
  title: string;
  description: string;
  icon: React.ElementType;
  activeLabel: string;
  inactiveLabel: string;
  isDangerous?: boolean;
}

const SETTING_CONFIGS: SettingCardConfig[] = [
  {
    key: "events_registration_open",
    title: "Event Registrations",
    description:
      "Governs whether event registration forms and attendance pipelines across the student portal are open to members and applicants.",
    icon: CalendarRegular,
    activeLabel: "Open",
    inactiveLabel: "Closed",
  },
  {
    key: "merch_shop_open",
    title: "Merchandise Pre-orders",
    description:
      "Governs pre-orders, product listings, and storefront checkout access for official community merchandise.",
    icon: ShoppingBagRegular,
    activeLabel: "Open",
    inactiveLabel: "Closed",
  },
  {
    key: "maintenance_mode",
    title: "System Maintenance Mode",
    description:
      "Places the entire student portal into maintenance mode. Non-admin visitors will be redirected to the maintenance standby screen.",
    icon: WrenchRegular,
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    isDangerous: true,
  },
];

export const SystemSettingsTab: React.FC = () => {
  const { settingsMap, isLoading, isError, refetch, isFetching, updateSetting, isUpdating } =
    useAdminSettings();

  const handleToggle = async (key: SettingKey, currentValue: boolean) => {
    const newValue = !currentValue;
    try {
      await updateSetting(key, newValue);
    } catch {
      // Toast notification is automatically dispatched by the hook mutation
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Default (unmodified)";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const isMaintenanceActive = settingsMap["maintenance_mode"]?.value ?? false;

  return (
    <div className="space-y-size200 w-full">
      {/* Maintenance Mode Emergency Alert Banner */}
      {isMaintenanceActive && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-foreground rounded-none shadow-4">
          <WarningRegular className="w-4 h-4 text-destructive" />
          <AlertTitle className="text-xs font-semibold text-destructive">
            System Maintenance Mode Active
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            Student portal traffic is currently restricted to maintenance standby.
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-size200">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="rounded-none border-transparent bg-card shadow-4 flex flex-col justify-between">
              <CardHeader className="space-y-size160 p-size200">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-9 w-9 rounded-none" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </CardHeader>
              <CardFooter className="border-t border-border/60 p-size120 bg-muted/10">
                <Skeleton className="h-3 w-1/2" />
              </CardFooter>
            </Card>
          ))
        ) : isError ? (
          <div className="col-span-full p-size320 flex flex-col items-center justify-center text-center bg-card shadow-4 ring-1 ring-foreground/10 py-16 text-destructive">
            <WarningRegular className="w-8 h-8 mb-2" />
            <p className="text-sm font-semibold">Failed to load system settings</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              Unable to communicate with the administrative settings API.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="text-xs rounded-none cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        ) : (
          SETTING_CONFIGS.map((config) => {
            const setting: SystemSetting | undefined = settingsMap[config.key];
            const isChecked = setting?.value ?? false;
            const Icon = config.icon;

            return (
              <Card
                key={config.key}
                className="rounded-none border-0 bg-card shadow-4 ring-1 ring-foreground/10 hover:bg-muted/30 transition-colors flex flex-col justify-between"
              >
                <CardHeader className="space-y-size160 p-size200">
                  {/* Top Bar: Icon + Status + Switch */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-size120">
                      <div className="p-2 bg-primary/10 text-primary border border-primary/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-foreground leading-tight">
                          {config.title}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={`mt-1 rounded-none text-xs py-0 h-4.5 px-2 font-medium tracking-wide inline-flex items-center border-transparent ${
                            isChecked
                              ? config.isDangerous
                                ? "bg-destructive/10 text-destructive font-semibold"
                                : "bg-primary/10 text-primary font-semibold"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isChecked ? config.activeLabel : config.inactiveLabel}
                        </Badge>
                      </div>
                    </div>

                    <Switch
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(config.key, isChecked)}
                      disabled={isUpdating}
                      aria-label={config.title}
                      className="cursor-pointer shrink-0"
                    />
                  </div>

                  {/* Description */}
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {config.description}
                  </CardDescription>

                  {/* Notice for Dangerous Switches */}
                  {config.isDangerous && isChecked && (
                    <div className="p-size80 bg-destructive/5 border border-destructive/20 text-xs text-destructive flex items-start gap-size60">
                      <InfoRegular className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>Student traffic is blocked while maintenance mode is active.</span>
                    </div>
                  )}
                </CardHeader>

                {/* Footer Metadata */}
                <CardFooter className="border-t border-border p-size120 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {config.key}
                  </span>
                  <span title={setting?.updatedAt || undefined}>
                    Updated {formatDate(setting?.updatedAt)}
                  </span>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SystemSettingsTab;

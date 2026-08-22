import React, { useState } from "react";
import {
  PeopleSettingsRegular,
  OptionsRegular,
  HistoryRegular,
} from "@fluentui/react-icons";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { RoleManagementTab } from "./RoleManagementTab";
import { SystemSettingsTab } from "./SystemSettingsTab";
import { AuditLogsTab } from "./AuditLogsTab";

export const SuperAdminHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("roles");

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col bg-card shadow-4 ring-1 ring-foreground/10 overflow-hidden w-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col min-h-0 gap-0"
      >
        {/* Centered Card Tabs Header with Solid Blue Active State and Guaranteed White Text */}
        <div className="h-14 px-size200 border-b border-border bg-card shrink-0 flex items-center">
          <TabsList className="h-9 gap-1.5 bg-transparent p-0 flex items-center">
            <TabsTrigger
              value="roles"
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-none cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-active:!bg-primary data-active:!text-primary-foreground data-active:hover:!text-primary-foreground data-active:shadow-1 after:hidden border-0 shadow-none outline-none transition-colors"
            >
              <PeopleSettingsRegular className="w-4 h-4 shrink-0" />
              <span>Roles & Permissions</span>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-none cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-active:!bg-primary data-active:!text-primary-foreground data-active:hover:!text-primary-foreground data-active:shadow-1 after:hidden border-0 shadow-none outline-none transition-colors"
            >
              <OptionsRegular className="w-4 h-4 shrink-0" />
              <span>System Switches</span>
            </TabsTrigger>

            <TabsTrigger
              value="audit"
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-none cursor-pointer flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 data-active:!bg-primary data-active:!text-primary-foreground data-active:hover:!text-primary-foreground data-active:shadow-1 after:hidden border-0 shadow-none outline-none transition-colors"
            >
              <HistoryRegular className="w-4 h-4 shrink-0" />
              <span>Audit Trail</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Panels */}
        <TabsContent
          value="roles"
          className="flex-1 min-h-0 flex flex-col overflow-hidden outline-none p-0 m-0"
        >
          <RoleManagementTab />
        </TabsContent>

        <TabsContent
          value="settings"
          className="flex-1 min-h-0 overflow-y-auto outline-none p-size200 m-0"
        >
          <SystemSettingsTab />
        </TabsContent>

        <TabsContent
          value="audit"
          className="flex-1 min-h-0 flex flex-col overflow-hidden outline-none p-0 m-0"
        >
          <AuditLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminHub;

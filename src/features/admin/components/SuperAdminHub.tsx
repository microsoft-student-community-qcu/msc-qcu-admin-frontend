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
    <div className="h-[calc(100vh-7.5rem)] flex flex-col gap-size160 overflow-hidden w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col gap-size160 overflow-hidden w-full">
        {/* Tabs Card Bar */}
        <div className="bg-card shadow-4 ring-1 ring-foreground/10 p-size120 w-full flex items-center justify-start shrink-0">
          <TabsList className="w-full justify-start gap-1 bg-transparent p-0 border-0 h-auto">
            <TabsTrigger
              value="roles"
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-none cursor-pointer flex items-center gap-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground after:hidden border-0 shadow-none outline-none transition-colors"
            >
              <PeopleSettingsRegular className="w-4 h-4" />
              <span>Roles & Permissions</span>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-none cursor-pointer flex items-center gap-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground after:hidden border-0 shadow-none outline-none transition-colors"
            >
              <OptionsRegular className="w-4 h-4" />
              <span>System Switches</span>
            </TabsTrigger>

            <TabsTrigger
              value="audit"
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-none cursor-pointer flex items-center gap-2 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground after:hidden border-0 shadow-none outline-none transition-colors"
            >
              <HistoryRegular className="w-4 h-4" />
              <span>Audit Trail</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents - strictly constrained to available height without outer scrolling */}
        <TabsContent value="roles" className="flex-1 min-h-0 flex flex-col overflow-hidden outline-none mt-0">
          <RoleManagementTab />
        </TabsContent>

        <TabsContent value="settings" className="flex-1 min-h-0 overflow-y-auto outline-none mt-0">
          <SystemSettingsTab />
        </TabsContent>

        <TabsContent value="audit" className="flex-1 min-h-0 flex flex-col overflow-hidden outline-none mt-0">
          <AuditLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminHub;

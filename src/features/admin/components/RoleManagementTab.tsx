import React, { useState } from "react";
import {
  SearchRegular,
  PersonEditRegular,
  PersonRegular,
  DismissRegular,
  WarningRegular,
  ArrowClockwiseRegular,
  ShieldPersonRegular,
  FilterRegular,
} from "@fluentui/react-icons";

import { useAdminUsers } from "../hooks/useAdminUsers";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { AdminUser } from "../types/adminTypes";
import { ALL_ROLES, ADMIN_ROLES, type UserRole } from "@/types/roles";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  SUPERADMIN: "Super Admin",
  ADMIN_HR: "HR Admin",
  ADMIN_LOGISTICS: "Logistics Admin",
  ADMIN_LOGISTICS_HEAD: "Logistics Head",
  ADMIN_FINANCE: "Finance Admin",
  ADMIN_FINANCE_HEAD: "Finance Head",
  STARTUP_DEV: "Startup Developer",
  MEMBER: "Member",
  APPLICANT: "Applicant",
};

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  SUPERADMIN: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  ADMIN_HR: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  ADMIN_LOGISTICS: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
  ADMIN_LOGISTICS_HEAD:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  ADMIN_FINANCE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  ADMIN_FINANCE_HEAD: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
  STARTUP_DEV: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
  MEMBER: "bg-primary/10 text-primary border-primary/20",
  APPLICANT: "bg-muted text-muted-foreground border-border",
};

export const RoleManagementTab: React.FC = () => {
  const {
    users,
    total,
    search,
    setSearch,
    role,
    setRole,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    updateUserRole,
  } = useAdminUsers({ initialPageSize: 20 });

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: () => fetchNextPage?.(),
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("MEMBER");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleOpenEditRole = (user: AdminUser) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleConfirmRoleChange = async () => {
    if (!editingUser) return;
    try {
      await updateUserRole.mutateAsync({
        userId: editingUser.id,
        role: selectedRole,
      });
      handleCloseDialog();
    } catch {
      // Error handled by mutation hook toast
    }
  };

  const formatDate = (dateString: string) => {
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

  const selectedRoleLabel = !role || role === "ALL" ? "All Roles" : ROLE_DISPLAY_NAMES[role as UserRole] || role;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden w-full">
      {/* Search & Filter Toolbar */}
      <div className="p-size200 border-b border-border bg-muted/10 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-size160">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-size120 max-w-2xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 !h-9 text-xs sm:text-sm rounded-none bg-background placeholder:text-muted-foreground"
            />
          </div>

          {/* Role Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs gap-size60 shrink-0 rounded-none bg-background font-medium cursor-pointer"
              >
                <FilterRegular className="w-3.5 h-3.5" />
                <span>{selectedRoleLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none shadow-8">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Filter by Role
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setRole("ALL")}
                  className={`text-xs ${role === "ALL" ? "font-semibold bg-accent" : ""}`}
                >
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Administrative Roles
                </DropdownMenuLabel>
                {ADMIN_ROLES.map((r) => (
                  <DropdownMenuItem
                    key={r}
                    onClick={() => setRole(r)}
                    className={`text-xs ${role === r ? "font-semibold bg-accent" : ""}`}
                  >
                    {ROLE_DISPLAY_NAMES[r]}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                  General Accounts
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setRole("MEMBER")}
                  className={`text-xs ${role === "MEMBER" ? "font-semibold bg-accent" : ""}`}
                >
                  Member
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setRole("APPLICANT")}
                  className={`text-xs ${role === "APPLICANT" ? "font-semibold bg-accent" : ""}`}
                >
                  Applicant
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-size80 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 text-xs gap-size60 cursor-pointer rounded-none"
          >
            <ArrowClockwiseRegular
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Users Table with Infinite Scroll */}
      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-20 bg-card [&_tr]:border-0 [&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:bg-card [&_th]:border-b [&_th]:border-border [&_th]:shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] pl-size200 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User
              </TableHead>
              <TableHead className="w-[140px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Student ID
              </TableHead>
              <TableHead className="w-[160px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </TableHead>
              <TableHead className="w-[150px] px-size160 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Joined
              </TableHead>
              <TableHead className="w-[100px] pr-size200 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-size200">
                    <div className="flex items-center gap-size120">
                      <Skeleton className="h-8 w-8 rounded-none" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-3.5 w-20" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="px-size160">
                    <Skeleton className="h-3.5 w-20" />
                  </TableCell>
                  <TableCell className="pr-size200 text-right">
                    <Skeleton className="h-7 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={5} className="h-72 sm:h-80 text-center text-destructive p-0 border-0">
                  <div className="flex flex-col items-center justify-center gap-size80 h-full w-full select-none">
                    <WarningRegular className="w-8 h-8" />
                    <p className="text-xs font-medium">Failed to load user accounts.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="text-xs rounded-none cursor-pointer mt-size40"
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={5} className="h-72 sm:h-80 text-center text-muted-foreground p-0 border-0">
                  <div className="flex flex-col items-center justify-center gap-size80 h-full w-full select-none">
                    <PersonRegular className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-sm font-semibold text-foreground">No users found</p>
                    <p className="text-xs text-muted-foreground">
                      No accounts matched the specified search or filter criteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pl-size200">
                    <div className="flex items-center gap-size120">
                      <Avatar className="h-8 w-8 rounded-none border border-border/60">
                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                        <AvatarFallback className="rounded-none bg-primary/10 text-primary text-xs font-semibold">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-size160 font-mono text-xs text-muted-foreground">
                    {user.studentId || "-"}
                  </TableCell>
                  <TableCell className="px-size160">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium py-0 h-5 px-2 rounded-none border ${
                        ROLE_BADGE_CLASSES[user.role] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ROLE_DISPLAY_NAMES[user.role] || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-size160 text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="pr-size200 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditRole(user)}
                      className="h-7 text-xs px-2.5 rounded-none font-medium gap-size40 cursor-pointer"
                    >
                      <PersonEditRegular className="w-3.5 h-3.5" />
                      <span>Edit Role</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Infinite Scroll Sentinel */}
        {hasNextPage && <div ref={sentinelRef} className="h-4 w-full" />}

        {isFetchingNextPage && (
          <div className="p-size120 flex justify-center text-xs text-muted-foreground animate-pulse">
            Loading more users...
          </div>
        )}
      </div>

      {/* Role Mutation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-size80 text-base font-bold">
              <ShieldPersonRegular className="w-5 h-5 text-primary" />
              Modify User Role Assignment
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign a new access role and associated administrative permissions to this account.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-size160 py-size80">
              {/* Target User Info Card */}
              <div className="flex items-center gap-size120 p-size120 bg-muted/40 border border-border/60">
                <Avatar className="h-10 w-10 rounded-none border border-border/60">
                  {editingUser.image && (
                    <AvatarImage src={editingUser.image} alt={editingUser.name} />
                  )}
                  <AvatarFallback className="rounded-none bg-primary/10 text-primary font-semibold text-xs">
                    {editingUser.name ? editingUser.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {editingUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{editingUser.email}</p>
                  <div className="mt-1 flex items-center gap-size60">
                    <span className="text-xs text-muted-foreground">Current:</span>
                    <Badge
                      variant="outline"
                      className={`text-xs py-0 h-4.5 px-1.5 rounded-none border ${
                        ROLE_BADGE_CLASSES[editingUser.role] || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ROLE_DISPLAY_NAMES[editingUser.role] || editingUser.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div className="space-y-size80">
                <label className="text-xs font-semibold text-foreground block">Select New Role</label>
                <Select
                  value={selectedRole}
                  onValueChange={(val) => {
                    if (val) setSelectedRole(val as UserRole);
                  }}
                >
                  <SelectTrigger className="w-full text-xs h-9">
                    <SelectValue placeholder="Select a role">
                      {ROLE_DISPLAY_NAMES[selectedRole] || selectedRole}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        <div className="flex items-center justify-between w-full">
                          <span>{ROLE_DISPLAY_NAMES[r]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Warning Alert if selecting SUPERADMIN */}
              {selectedRole === "SUPERADMIN" && (
                <Alert
                  variant="destructive"
                  className="border-amber-500/50 bg-amber-500/10 text-foreground"
                >
                  <WarningRegular className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Elevated Privileges Warning
                  </AlertTitle>
                  <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
                    Granting SUPERADMIN status gives full access to user management, global system
                    switches, and audit records. Please verify that this elevation is strictly
                    authorized.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCloseDialog}
              disabled={updateUserRole.isPending}
              className="text-xs rounded-none cursor-pointer"
            >
              <DismissRegular className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRoleChange}
              disabled={
                updateUserRole.isPending ||
                (editingUser !== null && editingUser.role === selectedRole)
              }
              className="text-xs rounded-none cursor-pointer"
            >
              {updateUserRole.isPending ? "Updating Role..." : "Confirm Role Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagementTab;

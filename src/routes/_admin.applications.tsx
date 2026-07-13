import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  SearchRegular,
  CheckmarkCircleRegular,
  MailRegular,
  OpenRegular,
  PeopleRegular,
  PersonRegular,
  ClockRegular,
  EyeRegular,
  DocumentRegular,
} from "@fluentui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mockApplicants, Applicant } from "@/mocks/applicants";

export const Route = createFileRoute("/_admin/applications")({
  component: ApplicationsRoute,
});

type FilterTab = "ALL" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";

function ApplicationsRoute() {
  const [applicants, setApplicants] = React.useState<Applicant[]>(mockApplicants);
  const [selectedId, setSelectedId] = React.useState<string | null>(mockApplicants[0]?.id || null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<FilterTab>("ALL");
  const [isPendingSmtp, setIsPendingSmtp] = React.useState(false);

  // Status Mutation Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [pendingStatus, setPendingStatus] = React.useState<Applicant["status"] | null>(null);

  // ID Image Zoom State
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [zoomImageSrc, setZoomImageSrc] = React.useState<string>("");
  const [zoomTitle, setZoomTitle] = React.useState<string>("");

  // Preview State
  const [activePreview, setActivePreview] = React.useState<"ID" | "COR" | "CV">("ID");

  // Reset preview state to 'ID' when applicant changes
  React.useEffect(() => {
    setActivePreview("ID");
  }, [selectedId]);

  const selectedApplicant = React.useMemo(() => {
    return applicants.find((app) => app.id === selectedId) || null;
  }, [applicants, selectedId]);

  // Count metrics for tabs
  const tabCounts = React.useMemo(() => {
    return {
      ALL: applicants.length,
      PENDING_REVIEW: applicants.filter((app) => app.status === "PENDING_REVIEW").length,
      APPROVED: applicants.filter((app) => app.status === "APPROVED").length,
      REJECTED: applicants.filter((app) => app.status === "REJECTED").length,
    };
  }, [applicants]);

  // Filtered applicants
  const filteredApplicants = React.useMemo(() => {
    return applicants.filter((app) => {
      // 1. Filter by Tab
      if (activeTab === "PENDING_REVIEW" && app.status !== "PENDING_REVIEW") return false;
      if (activeTab === "APPROVED" && app.status !== "APPROVED") return false;
      if (activeTab === "REJECTED" && app.status !== "REJECTED") return false;

      // 2. Filter by Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(query) ||
          app.studentId.toLowerCase().includes(query) ||
          app.id.toLowerCase().includes(query) ||
          app.department.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [applicants, activeTab, searchQuery]);

  // Auto-select first item in filtered list if current selected is not in the filtered list
  React.useEffect(() => {
    if (filteredApplicants.length > 0) {
      const isStillInList = filteredApplicants.some((app) => app.id === selectedId);
      if (!isStillInList) {
        setSelectedId(filteredApplicants[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredApplicants, selectedId]);

  const triggerStatusChange = (status: Applicant["status"]) => {
    // Don't open the confirmation dialog if the status hasn't actually changed
    if (selectedApplicant?.status === status) return;
    setPendingStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!selectedId || !pendingStatus) return;

    setIsPendingSmtp(true);
    setIsConfirmOpen(false);

    // Simulate network delay for DB update & email dispatch
    setTimeout(() => {
      setIsPendingSmtp(false);
      setApplicants((prev) =>
        prev.map((app) => (app.id === selectedId ? { ...app, status: pendingStatus } : app)),
      );
      toast.success(`Applicant status updated to ${pendingStatus}.`, {
        description: `Branded email dispatched successfully.`,
      });
      setPendingStatus(null);
    }, 1000);
  };

  return (
    <div className="flex gap-size240 h-[calc(100vh-7.5rem)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* LEFT COLUMN: Master List */}
      <div className="w-[380px] shrink-0 flex flex-col h-full bg-background border border-border shadow-4">
        {/* Search & Tabs Header */}
        <div className="p-size160 border-b border-border space-y-size120">
          <div className="relative">
            <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Inline Tab Filters */}
          <div className="flex flex-wrap gap-size40">
            <Button
              variant={activeTab === "ALL" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ALL")}
              className="h-7 text-xs px-2.5 rounded-none font-medium"
            >
              All ({tabCounts.ALL})
            </Button>
            <Button
              variant={activeTab === "PENDING_REVIEW" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("PENDING_REVIEW")}
              className="h-7 text-xs px-2.5 rounded-none font-medium"
            >
              Pending ({tabCounts.PENDING_REVIEW})
            </Button>
            <Button
              variant={activeTab === "APPROVED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("APPROVED")}
              className="h-7 text-xs px-2.5 rounded-none font-medium"
            >
              Approved ({tabCounts.APPROVED})
            </Button>
            <Button
              variant={activeTab === "REJECTED" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("REJECTED")}
              className="h-7 text-xs px-2.5 rounded-none font-medium"
            >
              Rejected ({tabCounts.REJECTED})
            </Button>
          </div>
        </div>

        {/* Scrollable List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="divide-y divide-border/60">
            {filteredApplicants.length > 0 ? (
              filteredApplicants.map((applicant) => {
                const isSelected = applicant.id === selectedId;

                return (
                  <button
                    key={applicant.id}
                    onClick={() => setSelectedId(applicant.id)}
                    className={cn(
                      "w-full text-left p-size160 flex items-start gap-size120 transition-colors border-l-2 cursor-pointer relative",
                      isSelected
                        ? "bg-accent border-l-primary"
                        : "hover:bg-muted/40 border-l-transparent bg-transparent",
                    )}
                  >
                    <Avatar className="h-9 w-9 rounded-none shrink-0 border border-border/50">
                      <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xs font-semibold">
                        {applicant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-size40">
                        <span className="font-semibold text-sm truncate text-foreground">
                          {applicant.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {applicant.id}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground truncate">
                        {applicant.department}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-size80">
                          {applicant.status === "PENDING_REVIEW" && (
                            <Badge
                              variant="outline"
                              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Pending Review
                            </Badge>
                          )}
                          {applicant.status === "APPROVED" && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Approved
                            </Badge>
                          )}
                          {applicant.status === "REJECTED" && (
                            <Badge
                              variant="outline"
                              className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-[10px] font-medium py-0 h-5 px-1.5 rounded-none"
                            >
                              Rejected
                            </Badge>
                          )}
                        </div>

                        <span className="text-[10px] text-muted-foreground font-mono">
                          {applicant.studentId}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-size320 text-center text-muted-foreground text-sm space-y-2">
                <PeopleRegular className="w-8 h-8 mx-auto text-muted-foreground/50" />
                <p>No applicants found matching filters.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT COLUMN: Detail View */}
      <div className="flex-1 flex flex-col bg-background border border-border shadow-4 overflow-hidden">
        {selectedApplicant ? (
          <div className="flex-1 flex flex-col h-full min-h-0">
            {/* Detail Header */}
            <div className="p-size240 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-size160 bg-muted/10 shrink-0">
              <div className="flex items-center gap-size160">
                <Avatar className="h-16 w-16 rounded-none border border-border">
                  <AvatarImage src="" alt={selectedApplicant.name} />
                  <AvatarFallback className="rounded-none bg-primary/10 text-primary text-xl font-bold">
                    {selectedApplicant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-foreground leading-tight">
                    {selectedApplicant.name}
                  </h2>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <MailRegular className="w-4 h-4 shrink-0" />
                    <span>{selectedApplicant.email}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
                    <ClockRegular className="w-3.5 h-3.5" />
                    <span>
                      Applied on{" "}
                      {new Date(selectedApplicant.submissionDate).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Mutator Selector */}
              <div className="flex flex-col gap-2 md:items-end">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="status-select"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Status:
                  </Label>
                  <Select
                    value={selectedApplicant.status}
                    disabled={isPendingSmtp}
                    onValueChange={(val) => triggerStatusChange(val as Applicant["status"])}
                  >
                    <SelectTrigger
                      id="status-select"
                      className="w-[160px] h-9 rounded-none font-medium"
                    >
                      <SelectValue>
                        {{
                          PENDING_REVIEW: "Pending Review",
                          APPROVED: "Approved",
                          REJECTED: "Rejected",
                          CANCELLED: "Cancelled",
                        }[selectedApplicant.status] ?? selectedApplicant.status}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-none shadow-8">
                      <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                      <SelectItem value="APPROVED">Approve / Member</SelectItem>
                      <SelectItem value="REJECTED">Reject Application</SelectItem>
                      <SelectItem value="CANCELLED">Cancel Application</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Detail Cards Area */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="p-size240 flex-1 min-h-0 flex flex-col">
                {/* 12-Column Grid Layout containing Left (Applicant Info) and Right (ID Photo + Attachments at Top, Questionnaire at Bottom) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-size240 items-stretch flex-1 min-h-0 overflow-hidden pr-2">
                  
                  {/* Left Column: Applicant Info goes first visually via order, but ID/Attachments span 8 */}
                  <div className="lg:col-span-8 lg:order-2 flex flex-col gap-size240 h-full min-h-0">
                    
                    {/* Top Row: ID Photo & Attachments side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-size240 items-stretch shrink-0">
                      {/* Attachments Card — now on the left */}
                      <Card className="border border-border shadow-2 rounded-none py-0 gap-0 flex flex-col min-h-0">
                        <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10 shrink-0">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <OpenRegular className="w-4 h-4 text-primary" />
                            Attachments
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-size120 text-xs flex flex-col justify-between gap-4 max-h-[320px]">
                          {/* COR */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                              Certificate of Registration (COR)
                            </span>
                            <a
                              href={selectedApplicant.corUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                              title="Open COR in new tab"
                            >
                              <span className="truncate">Open COR Document</span>
                              <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          </div>

                          {/* CV */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                              Curriculum Vitae (CV)
                            </span>
                            <a
                              href={selectedApplicant.cvUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                              title="Open CV in new tab"
                            >
                              <span className="truncate">Open CV Document</span>
                              <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          </div>

                          {/* Portfolio */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                              Project Portfolio
                            </span>
                            {selectedApplicant.portfolioUrl ? (
                              <a
                                href={selectedApplicant.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                                title={selectedApplicant.portfolioUrl}
                              >
                                <span className="truncate">{selectedApplicant.portfolioUrl}</span>
                                <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            ) : (
                              <div className="flex items-center p-1.5 border border-border/50 border-dashed text-muted-foreground/60 text-xs rounded-none">
                                <span className="italic">Not provided</span>
                              </div>
                            )}
                          </div>

                          {/* GitHub */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                              GitHub / Projects
                            </span>
                            {selectedApplicant.githubUrl ? (
                              <a
                                href={selectedApplicant.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                                title={selectedApplicant.githubUrl}
                              >
                                <span className="truncate">{selectedApplicant.githubUrl}</span>
                                <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            ) : (
                              <div className="flex items-center p-1.5 border border-border/50 border-dashed text-muted-foreground/60 text-xs rounded-none">
                                <span className="italic">Not provided</span>
                              </div>
                            )}
                          </div>

                          {/* Facebook */}
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-semibold text-muted-foreground uppercase">
                              Facebook Profile
                            </span>
                            {selectedApplicant.facebookUrl ? (
                              <a
                                href={selectedApplicant.facebookUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                                title={selectedApplicant.facebookUrl}
                              >
                                <span className="truncate">{selectedApplicant.facebookUrl}</span>
                                <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            ) : (
                              <div className="flex items-center p-1.5 border border-border/50 border-dashed text-muted-foreground/60 text-xs rounded-none">
                                <span className="italic">Not provided</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Student ID Photo Card — now on the right */}
                      <Card className="border border-border shadow-2 rounded-none py-0 gap-0">
                        <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <PersonRegular className="w-4 h-4 text-primary" />
                            Student ID Photo
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-size120 flex flex-col items-center gap-2">
                          <div
                            onClick={() => {
                              setZoomImageSrc(selectedApplicant.idCardUrl);
                              setZoomTitle(`${selectedApplicant.name} - Student ID`);
                              setIsZoomOpen(true);
                            }}
                            className="w-full h-[280px] bg-muted/30 border border-border overflow-hidden relative cursor-pointer group flex items-center justify-center"
                          >
                            <img
                              src={selectedApplicant.idCardUrl}
                              alt="Student ID card"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <span className="text-white text-xs font-semibold flex items-center gap-1">
                                <EyeRegular className="w-4 h-4" /> Click to Zoom
                              </span>
                            </div>
                          </div>
                          <a
                            href={selectedApplicant.idCardUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 p-1.5 border border-border hover:bg-muted/30 transition-colors text-center font-medium text-xs rounded-none cursor-pointer text-foreground"
                            title="Open Student ID in new tab"
                          >
                            <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                            <span>Open Full Image</span>
                          </a>
                        </CardContent>
                      </Card>
                    </div>


                    {/* Bottom Row: Profile & Questionnaire */}
                    <div className="flex-1 min-h-0">
                      <Card className="border border-border shadow-2 rounded-none h-full flex flex-col min-h-0 py-0 gap-0">
                        <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10 shrink-0">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <PersonRegular className="w-4 h-4 text-primary" />
                            Profile & Questionnaire
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 p-0">
                          <ScrollArea className="h-full">
                            <div className="py-size120 px-size160 space-y-size120 text-sm">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">
                                  Interests, Skills & Hobbies
                                </span>
                                <p className="text-foreground leading-normal whitespace-pre-wrap">{selectedApplicant.interests}</p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">
                                  Past Organizations
                                </span>
                                <p className="text-foreground leading-normal whitespace-pre-wrap">{selectedApplicant.pastOrganizations}</p>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">
                                  Previous Works / Achievements
                                </span>
                                {selectedApplicant.previousWorks ? (
                                  <p className="text-foreground leading-normal whitespace-pre-wrap">{selectedApplicant.previousWorks}</p>
                                ) : (
                                  <p className="text-muted-foreground/60 italic text-sm">Not provided</p>
                                )}
                              </div>
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Right Column: Applicant Information rendered first visually */}
                  <div className="lg:col-span-4 lg:order-1 flex flex-col h-full min-h-0">
                    <Card className="border border-border shadow-2 rounded-none h-full flex flex-col min-h-0 py-0 gap-0">
                      <CardHeader className="py-size80 pb-size80! px-size160 border-b border-border bg-muted/10 shrink-0">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <PersonRegular className="w-4 h-4 text-primary" />
                          Applicant Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 min-h-0 p-0">
                        <ScrollArea className="h-full">
                          <div className="py-size100 px-size160 space-y-size100 text-sm">
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                          <span className="text-muted-foreground font-medium col-span-1">QCU Student ID</span>
                          <span className="col-span-2 text-left font-mono font-semibold text-foreground bg-muted/60 py-0.5 w-fit">
                            {selectedApplicant.studentId}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                          <span className="text-muted-foreground font-medium col-span-1">Applied Dept.</span>
                          <span className="col-span-2 text-left font-semibold text-foreground">
                            {selectedApplicant.department}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                          <span className="text-muted-foreground font-medium col-span-1">Email Address</span>
                          <span className="col-span-2 text-left font-medium text-foreground break-all">
                            {selectedApplicant.email}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                          <span className="text-muted-foreground font-medium col-span-1">Cellphone</span>
                          <span className="col-span-2 text-left font-medium text-foreground">
                            {selectedApplicant.cellphone}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                          <span className="text-muted-foreground font-medium col-span-1">House Address</span>
                          <span className="col-span-2 text-left text-foreground text-xs leading-normal">
                            {selectedApplicant.houseAddress}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                          <span className="text-muted-foreground font-medium col-span-1">College</span>
                          <span className="col-span-2 text-left font-medium text-foreground leading-normal">
                            {selectedApplicant.college}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                          <span className="text-muted-foreground font-medium col-span-1">Program & Section</span>
                          <span className="col-span-2 text-left font-medium text-foreground leading-normal">
                            {selectedApplicant.program} ({selectedApplicant.section})
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                          <span className="text-muted-foreground font-medium col-span-1">Campus</span>
                          <span className="col-span-2 text-left font-medium text-foreground">
                            {selectedApplicant.campus}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                          <span className="text-muted-foreground font-medium col-span-1">Date of Birth</span>
                          <span className="col-span-2 text-left font-medium text-foreground">
                            {selectedApplicant.dateOfBirth}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                          <span className="text-muted-foreground font-medium col-span-1">Place of Birth</span>
                          <span className="col-span-2 text-left font-medium text-foreground leading-normal">
                            {selectedApplicant.placeOfBirth}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                          <span className="text-muted-foreground font-medium col-span-1">Gender</span>
                          <span className="col-span-2 text-left font-medium text-foreground">
                            {selectedApplicant.gender}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 py-1.5 gap-2 items-center">
                          <span className="text-muted-foreground font-medium col-span-1">Application ID</span>
                          <span className="col-span-2 text-left text-muted-foreground font-mono">
                            {selectedApplicant.id}
                          </span>
                        </div>
                        </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-size320 text-muted-foreground text-center">
            <PeopleRegular className="w-12 h-12 mb-3 text-muted-foreground/30" />
            <h3 className="text-base font-bold text-foreground">No Applicant Selected</h3>
            <p className="text-sm max-w-xs mt-1">
              Select an applicant from the left list to review their details and manage their
              application.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: Zoomed Image Overlay */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-background rounded-none shadow-28 border border-border">
          <DialogHeader className="p-size160 border-b border-border bg-muted/10">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <EyeRegular className="w-4 h-4 text-primary" />
              <span>{zoomTitle || "Verification Document View"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Verify the uploaded document details against candidate credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="p-size200 flex items-center justify-center bg-black/5 max-h-[500px]">
            {zoomImageSrc && (
              <img
                src={zoomImageSrc}
                alt={zoomTitle || "Verification document zoom"}
                className="max-h-[400px] object-contain shadow-8"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION DIALOG: Status Mutation and Email Dispatch */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-none shadow-28 border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Mutation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change {selectedApplicant?.name}'s status to{" "}
              <strong>{
                {
                  PENDING_REVIEW: "Pending Review",
                  APPROVED: "Approved",
                  REJECTED: "Rejected",
                  CANCELLED: "Cancelled",
                }[pendingStatus as string] ?? pendingStatus
              }</strong>? This transaction is monitored and will trigger the
              automated backend mailer to dispatch a branded status email to{" "}
              <strong>{selectedApplicant?.email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-none font-medium"
              onClick={() => setPendingStatus(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className="rounded-none bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              Confirm and Dispatch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import React from "react";
import {
  MailRegular,
  ClockRegular,
  OpenRegular,
  PersonRegular,
  EyeRegular,
  PeopleRegular,
} from "@fluentui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Applicant } from "@/features/hr/shared/types";
import { openDocument } from "@/features/hr/shared/services/applicantApi";
import { useAuthorizedImage } from "@/features/hr/shared/hooks/useAuthorizedImage";

interface ApplicantDetailsProps {
  applicant: Applicant | null;
  isPendingSmtp: boolean;
  onStatusChange: (status: Applicant["status"]) => void;
  onZoomImage: (imageSrc: string, title: string) => void;
  isLoading?: boolean;
  error?: boolean;
}

export const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  applicant,
  isPendingSmtp,
  onStatusChange,
  onZoomImage,
  isLoading,
  error,
}) => {
  // ID image lives in a private blob container served through the
  // authenticated backend endpoint; <img> cannot attach auth headers,
  // so load it as an object URL. Must run before any early return.
  const idImage = useAuthorizedImage(applicant?.idCardUrl);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full min-h-0 bg-card shadow-4 ring-1 ring-foreground/10 animate-pulse">
        {/* Detail Header Skeleton */}
        <div className="p-size240 border-b border-border flex items-center gap-size160 bg-muted/10 shrink-0">
          <div className="h-16 w-16 bg-muted shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted w-40" />
            <div className="h-4 bg-muted w-48" />
            <div className="h-3 bg-muted w-32" />
          </div>
        </div>
        {/* Detail Body Skeleton */}
        <div className="flex-1 p-size240 space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-muted w-28" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted" />
              <div className="h-12 bg-muted" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted w-36" />
            <div className="h-24 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-size320 text-muted-foreground text-center bg-card shadow-4 ring-1 ring-foreground/10">
        <PeopleRegular className="w-12 h-12 mb-3 text-muted-foreground/30" />
        <h3 className="text-base font-bold text-foreground">Database Offline</h3>
        <p className="text-sm max-w-xs mt-1">
          Could not fetch applicant details. Please check the backend service.
        </p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-size320 text-muted-foreground text-center bg-card shadow-4 ring-1 ring-foreground/10">
        <PeopleRegular className="w-12 h-12 mb-3 text-muted-foreground/30" />
        <h3 className="text-base font-bold text-foreground">No Applicant Selected</h3>
        <p className="text-sm max-w-xs mt-1">
          Select an applicant from the left list to review their details and manage their
          application.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-card shadow-4 ring-1 ring-foreground/10">
      {/* Detail Header */}
      <div className="p-size240 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-size160 bg-muted/10 shrink-0">
        <div className="flex items-center gap-size160">
          <Avatar className="h-16 w-16 rounded-none border border-border">
            <AvatarImage src="" alt={applicant.name} />
            <AvatarFallback className="rounded-none bg-primary/10 text-primary text-xl font-bold">
              {applicant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground leading-tight">{applicant.name}</h2>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <MailRegular className="w-4 h-4 shrink-0" />
              <span>{applicant.email}</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-0.5">
              <ClockRegular className="w-3.5 h-3.5" />
              <span>
                Applied on{" "}
                {new Date(applicant.submissionDate).toLocaleDateString(undefined, {
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
              value={applicant.status}
              disabled={isPendingSmtp}
              onValueChange={(val) => onStatusChange(val as Applicant["status"])}
            >
              <SelectTrigger id="status-select" className="w-[160px] h-9 rounded-none font-medium">
                <SelectValue>
                  {{
                    PENDING_REVIEW: "Pending Review",
                    APPROVED: "Approved",
                    REJECTED: "Rejected",
                    CANCELLED: "Cancelled",
                    FOR_COMPLIANCE: "For Compliance",
                  }[applicant.status] ?? applicant.status}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-none shadow-8">
                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                <SelectItem value="FOR_COMPLIANCE">For Compliance</SelectItem>
                <SelectItem value="APPROVED">Approve / Member</SelectItem>
                <SelectItem value="REJECTED">Reject Application</SelectItem>
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
                        href={applicant.corUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          void openDocument(applicant.corUrl);
                        }}
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
                        href={applicant.cvUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          void openDocument(applicant.cvUrl);
                        }}
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
                      {applicant.portfolioUrl ? (
                        <a
                          href={applicant.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                          title={applicant.portfolioUrl}
                        >
                          <span className="truncate">{applicant.portfolioUrl}</span>
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
                      {applicant.githubUrl ? (
                        <a
                          href={applicant.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                          title={applicant.githubUrl}
                        >
                          <span className="truncate">{applicant.githubUrl}</span>
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
                      {applicant.facebookUrl ? (
                        <a
                          href={applicant.facebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-1.5 border border-border hover:bg-muted/30 transition-colors text-primary font-medium text-xs rounded-none"
                          title={applicant.facebookUrl}
                        >
                          <span className="truncate">{applicant.facebookUrl}</span>
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
                    {applicant.idCardUrl ? (
                      <>
                        <div
                          onClick={() => {
                            if (idImage.objectUrl) {
                              onZoomImage(idImage.objectUrl, `${applicant.name} - Student ID`);
                            }
                          }}
                          className="w-48 aspect-54/86 bg-muted/30 border border-border overflow-hidden relative cursor-pointer group flex items-center justify-center"
                        >
                          {idImage.objectUrl ? (
                            <img
                              src={idImage.objectUrl}
                              alt="Student ID card"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground/60 italic">
                              {idImage.error ? "Failed to load ID photo" : "Loading ID photo…"}
                            </span>
                          )}
                          {idImage.objectUrl && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                              <span className="text-white text-xs font-semibold flex items-center gap-1">
                                <EyeRegular className="w-4 h-4" /> Click to Zoom
                              </span>
                            </div>
                          )}
                        </div>
                        <a
                          href={applicant.idCardUrl}
                          onClick={(e) => {
                            e.preventDefault();
                            void openDocument(applicant.idCardUrl!);
                          }}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 p-1.5 border border-border hover:bg-muted/30 transition-colors text-center font-medium text-xs rounded-none cursor-pointer text-foreground"
                          title="Open Student ID in new tab"
                        >
                          <OpenRegular className="w-3.5 h-3.5 shrink-0" />
                          <span>Open Full Image</span>
                        </a>
                      </>
                    ) : (
                      // Empty state — ID photo not yet available from backend
                      <div className="w-48 aspect-54/86 border border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground/60">
                        <PersonRegular className="w-10 h-10" />
                        <span className="text-xs italic">No ID photo available</span>
                      </div>
                    )}
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
                          <p className="text-foreground leading-normal whitespace-pre-wrap">
                            {applicant.interests}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            Past Organizations
                          </span>
                          <p className="text-foreground leading-normal whitespace-pre-wrap">
                            {applicant.pastOrganizations}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-muted-foreground uppercase">
                            Previous Works / Achievements
                          </span>
                          {applicant.previousWorks ? (
                            <p className="text-foreground leading-normal whitespace-pre-wrap">
                              {applicant.previousWorks}
                            </p>
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
                        <span className="text-muted-foreground font-medium col-span-1">
                          QCU Student ID
                        </span>
                        <span className="col-span-2 text-left text-foreground">
                          {applicant.studentId}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Applied Dept.
                        </span>
                        <span className="col-span-2 text-left font-semibold text-foreground">
                          {applicant.department}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Email Address
                        </span>
                        <span className="col-span-2 text-left font-medium text-foreground break-all">
                          {applicant.email}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Cellphone
                        </span>
                        <span className="col-span-2 text-left font-medium text-foreground">
                          {applicant.cellphone}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                        <span className="text-muted-foreground font-medium col-span-1">
                          House Address
                        </span>
                        <span className="col-span-2 text-left text-foreground text-xs leading-normal">
                          {applicant.houseAddress}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                        <span className="text-muted-foreground font-medium col-span-1">
                          College
                        </span>
                        <span className="col-span-2 text-left font-medium text-foreground leading-normal">
                          {applicant.college}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Program & Section
                        </span>
                        <span className="col-span-2 text-left font-medium text-foreground leading-normal">
                          {applicant.program} ({applicant.section})
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                        <span className="text-muted-foreground font-medium col-span-1">Campus</span>
                        <span className="col-span-2 text-left font-medium text-foreground">
                          {applicant.campus}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Date of Birth
                        </span>
                        <span className="col-span-2 text-left font-medium text-foreground">
                          {applicant.dateOfBirth}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-start">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Place of Birth
                        </span>
                        <span className="col-span-2 text-left font-medium text-foreground leading-normal">
                          {applicant.placeOfBirth}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 border-b border-border/30 gap-2 items-center">
                        <span className="text-muted-foreground font-medium col-span-1">Gender</span>
                        <span className="col-span-2 text-left font-medium text-foreground">
                          {applicant.gender}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 py-1.5 gap-2 items-center">
                        <span className="text-muted-foreground font-medium col-span-1">
                          Application ID
                        </span>
                        <span className="col-span-2 text-left text-muted-foreground font-mono">
                          {applicant.id}
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
  );
};

export default ApplicantDetails;

import React from "react";
import { MailRegular, ArrowRightRegular } from "@fluentui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Applicant } from "@/mocks/applicants";

interface MemberProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: Applicant | null;
  onContact: (member: Applicant) => void;
}

export const MemberProfileSheet: React.FC<MemberProfileSheetProps> = ({
  isOpen,
  onOpenChange,
  member,
  onContact,
}) => {
  if (!member) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-border bg-background p-0 flex flex-col h-full shadow-2xl">
        <div className="flex flex-col h-full min-h-0">
          {/* Drawer Header */}
          <SheetHeader className="p-size240 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center gap-size160">
              <Avatar className="h-14 w-14 rounded-none border border-border/80 shadow-sm">
                <AvatarFallback className="rounded-none bg-primary/10 text-primary text-lg font-bold">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-base font-bold text-foreground leading-tight text-left">
                  {member.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground font-mono mt-1 text-left">
                  ID: {member.studentId}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Drawer Content */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-size240 space-y-size200 text-xs text-left">
              {/* Community placement */}
              <div className="space-y-size80">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Role & Organization
                </h4>
                <div className="p-size120 bg-muted/20 border border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-bold text-foreground">{member.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member UUID:</span>
                    <span className="font-mono text-foreground">{member.id}</span>
                  </div>
                </div>
              </div>

              {/* Academic Profile */}
              <div className="space-y-size80">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Academic Details
                </h4>
                <div className="p-size120 bg-muted/20 border border-border space-y-2.5">
                  <div>
                    <span className="text-muted-foreground block">College</span>
                    <span className="font-medium text-foreground text-xs">{member.college}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Program</span>
                    <span className="font-medium text-foreground text-xs">{member.program}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground block">Section</span>
                      <span className="font-medium text-foreground text-xs">{member.section}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Campus</span>
                      <span className="font-medium text-foreground text-xs">
                        {member.campus} Campus
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-size80">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Contact Information
                </h4>
                <div className="p-size120 bg-muted/20 border border-border space-y-2.5">
                  <div>
                    <span className="text-muted-foreground block">Email Address</span>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-primary hover:underline font-medium text-xs break-all"
                    >
                      {member.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Mobile Number</span>
                    <span className="font-medium text-foreground text-xs">{member.cellphone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Address</span>
                    <span className="font-medium text-foreground text-xs">
                      {member.houseAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Interests */}
              <div className="space-y-size80">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Background & Interests
                </h4>
                <div className="p-size120 bg-muted/20 border border-border space-y-2.5">
                  <div>
                    <span className="text-muted-foreground block">Interests</span>
                    <p className="text-foreground text-xs leading-relaxed mt-0.5">
                      {member.interests}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Previous Experience</span>
                    <p className="text-foreground text-xs leading-relaxed mt-0.5">
                      {member.pastOrganizations}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolios & External Links */}
              {(member.portfolioUrl || member.githubUrl || member.facebookUrl) && (
                <div className="space-y-size80">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    External Links
                  </h4>
                  <div className="flex flex-col gap-1.5">
                    {member.portfolioUrl && (
                      <a
                        href={member.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-size80 border border-border bg-card hover:bg-muted transition-colors text-xs font-medium min-w-0"
                      >
                        <span className="truncate mr-2 text-primary hover:underline">
                          {member.portfolioUrl}
                        </span>
                        <ArrowRightRegular className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-size80 border border-border bg-card hover:bg-muted transition-colors text-xs font-medium min-w-0"
                      >
                        <span className="truncate mr-2 text-primary hover:underline">
                          {member.githubUrl}
                        </span>
                        <ArrowRightRegular className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </a>
                    )}
                    {member.facebookUrl && (
                      <a
                        href={member.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-size80 border border-border bg-card hover:bg-muted transition-colors text-xs font-medium min-w-0"
                      >
                        <span className="truncate mr-2 text-primary hover:underline">
                          {member.facebookUrl}
                        </span>
                        <ArrowRightRegular className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions Footer */}
          <div className="p-size160 border-t border-border bg-muted/10 flex gap-2 shrink-0">
            <Button
              className="flex-1 rounded-none h-9 text-xs cursor-pointer"
              onClick={() => onContact(member)}
            >
              <MailRegular className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              className="rounded-none h-9 text-xs cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MemberProfileSheet;

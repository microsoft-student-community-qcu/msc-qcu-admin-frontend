import React from "react";
import { MailRegular, LinkRegular, PersonRegular, ArrowRightRegular } from "@fluentui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Applicant } from "@/features/hr/shared/types";

interface MemberDirectoryProps {
  members: Applicant[];
  onOpenProfile: (member: Applicant) => void;
  onContactMember: (member: Applicant) => void;
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  members,
  onOpenProfile,
  onContactMember,
}) => {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-size320 text-muted-foreground text-sm space-y-3 bg-card shadow-4 ring-1 ring-foreground/10 h-[300px] w-full">
        <PersonRegular className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
        <div className="text-center">
          <p className="font-semibold text-foreground">No active members found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search filters or department selection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-size200 w-full pb-size320">
      {members.map((member) => (
        <Card
          key={member.id}
          className="rounded-none border-transparent bg-card shadow-4 hover:bg-muted/50 transition-colors duration-200 flex flex-col justify-between"
        >
          <CardContent className="p-size160 flex flex-row items-start gap-size160">
            {/* Left Side: Avatar */}
            <Avatar className="h-20 w-20 rounded-none border-2 border-primary/20 shrink-0">
              <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xl font-bold">
                {member.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Right Side: Info */}
            <div className="flex-1 min-w-0 space-y-2 text-left">
              {/* Identity */}
              <div className="space-y-0.5">
                <h3
                  className="font-bold text-base text-foreground truncate leading-none"
                  title={member.name}
                >
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">ID: {member.studentId}</p>
              </div>

              {/* Role and Department Badge */}
              <div className="space-y-1.5">
                <div>
                  <Badge
                    variant="secondary"
                    className="rounded-none text-xs py-0 h-6 px-2.5 font-normal tracking-wide bg-primary/10 text-primary border-transparent inline-flex items-center"
                  >
                    {member.department}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate" title={member.program}>
                  {member.program}
                </p>
              </div>
            </div>
          </CardContent>

          {/* Footer Actions */}
          <div
            data-slot="card-footer"
            className="border-t border-border/60 p-size120 bg-muted/10 flex items-center justify-between gap-2"
          >
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onContactMember(member)}
                title="Email Member"
                className="h-7 w-7 rounded-none cursor-pointer"
              >
                <MailRegular className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </Button>
              {member.portfolioUrl && (
                <a
                  href={member.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7 w-7 items-center justify-center border border-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="View Portfolio"
                >
                  <LinkRegular className="w-4 h-4" />
                </a>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenProfile(member)}
              className="h-7 text-xs rounded-none font-medium px-2.5 cursor-pointer"
            >
              Profile
              <ArrowRightRegular className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MemberDirectory;

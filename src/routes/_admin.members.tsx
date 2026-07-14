import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  SearchRegular,
  MailRegular,
  PersonRegular,
  PhoneRegular,
  BookRegular,
  PinRegular,
  CalendarRegular,
  ContactCardRegular,
  BoxRegular,
  LinkRegular,
  ArrowRightRegular,
  FilterRegular,
} from "@fluentui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { mockApplicants, Applicant } from "@/mocks/applicants";

export const Route = createFileRoute("/_admin/members")({
  component: MembersRoute,
});

function MembersRoute() {
  // Only display APPROVED applicants as active members
  const [members] = React.useState<Applicant[]>(() =>
    mockApplicants.filter((app) => app.status === "APPROVED")
  );
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = React.useState<string>("ALL");
  const [selectedMember, setSelectedMember] = React.useState<Applicant | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Unique departments for filter dropdown
  const departments = React.useMemo(() => {
    const depts = new Set(members.map((m) => m.department));
    return ["ALL", ...Array.from(depts)];
  }, [members]);

  // Filtered members list
  const filteredMembers = React.useMemo(() => {
    return members.filter((m) => {
      // 1. Filter by Department
      if (selectedDeptFilter !== "ALL" && m.department !== selectedDeptFilter) return false;

      // 2. Filter by Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(query) ||
          m.studentId.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query) ||
          m.department.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [members, selectedDeptFilter, searchQuery]);

  const handleOpenProfile = (member: Applicant) => {
    setSelectedMember(member);
    setIsSheetOpen(true);
  };

  const handleContactMember = (member: Applicant) => {
    toast.success(`Message draft prepared for ${member.name}`, {
      description: `Opening local mail client for ${member.email}...`,
    });
    window.location.href = `mailto:${member.email}?subject=QCU%20MSC%20Community%20Update`;
  };

  return (
    <div className="flex flex-col gap-size320 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-size160 shrink-0 bg-background border border-border p-size160 shadow-2 w-full">
        <div className="flex items-center gap-3 relative max-w-sm w-full">
          <SearchRegular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search team directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        
        {/* Department Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <FilterRegular className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <div className="flex gap-1">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={selectedDeptFilter === dept ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedDeptFilter(dept)}
                className="h-8 text-xs px-3 rounded-none font-medium whitespace-nowrap"
              >
                {dept === "ALL" ? "All Departments" : dept}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-size200 w-full pb-size320">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="rounded-none border-border bg-card shadow-2 hover:bg-muted/50 transition-colors duration-200 flex flex-col justify-between"
            >
              <CardContent className="p-size160 flex flex-row items-start gap-size160">
                {/* Left Side: Avatar */}
                <Avatar className="h-20 w-20 rounded-none border-2 border-primary/20 shrink-0">
                  <AvatarFallback className="rounded-none bg-primary/5 text-primary text-xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {/* Right Side: Info */}
                <div className="flex-1 min-w-0 space-y-2 text-left">
                  {/* Identity */}
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-base text-foreground truncate leading-none" title={member.name}>
                      {member.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      ID: {member.studentId}
                    </p>
                  </div>

                  {/* Role and Department Badge */}
                  <div className="space-y-1.5">
                    <div>
                      <Badge variant="secondary" className="rounded-none text-xs py-0 h-6 px-2.5 font-normal tracking-wide bg-primary/10 text-primary border-transparent inline-flex items-center">
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
              <div data-slot="card-footer" className="border-t border-border/60 p-size120 bg-muted/10 flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleContactMember(member)}
                    title="Email Member"
                    className="h-7 w-7 rounded-none"
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
                  onClick={() => handleOpenProfile(member)}
                  className="h-7 text-xs rounded-none font-medium px-2.5"
                >
                  Profile
                  <ArrowRightRegular className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-size320 text-muted-foreground text-sm space-y-3 bg-background border border-border shadow-2 h-[300px] w-full">
          <PersonRegular className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
          <div className="text-center">
            <p className="font-semibold text-foreground">No active members found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search filters or department selection.</p>
          </div>
        </div>
      )}

      {/* Slide-out Sheet Profile Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md border-l border-border bg-background p-0 flex flex-col h-full shadow-2xl">
          {selectedMember && (
            <div className="flex flex-col h-full min-h-0">
              {/* Drawer Header */}
              <SheetHeader className="p-size240 border-b border-border bg-muted/20 shrink-0">
                <div className="flex items-center gap-size160">
                  <Avatar className="h-14 w-14 rounded-none border border-border/80 shadow-sm">
                    <AvatarFallback className="rounded-none bg-primary/10 text-primary text-lg font-bold">
                      {selectedMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-base font-bold text-foreground leading-tight">
                      {selectedMember.name}
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground font-mono mt-1">
                      ID: {selectedMember.studentId}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Drawer Content */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-size240 space-y-size200 text-xs">
                  {/* Community placement */}
                  <div className="space-y-size80">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Role & Organization
                    </h4>
                    <div className="p-size120 bg-muted/20 border border-border space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-bold text-foreground">{selectedMember.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member UUID:</span>
                        <span className="font-mono text-foreground">{selectedMember.id}</span>
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
                        <span className="font-medium text-foreground text-xs">{selectedMember.college}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Program</span>
                        <span className="font-medium text-foreground text-xs">{selectedMember.program}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-muted-foreground block">Section</span>
                          <span className="font-medium text-foreground text-xs">{selectedMember.section}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Campus</span>
                          <span className="font-medium text-foreground text-xs">{selectedMember.campus} Campus</span>
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
                        <a href={`mailto:${selectedMember.email}`} className="text-primary hover:underline font-medium text-xs break-all">
                          {selectedMember.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Mobile Number</span>
                        <span className="font-medium text-foreground text-xs">{selectedMember.cellphone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Address</span>
                        <span className="font-medium text-foreground text-xs">{selectedMember.houseAddress}</span>
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
                        <p className="text-foreground text-xs leading-relaxed mt-0.5">{selectedMember.interests}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Previous Experience</span>
                        <p className="text-foreground text-xs leading-relaxed mt-0.5">{selectedMember.pastOrganizations}</p>
                      </div>
                    </div>
                  </div>

                  {/* Portfolios & External Links */}
                  {(selectedMember.portfolioUrl || selectedMember.githubUrl || selectedMember.facebookUrl) && (
                    <div className="space-y-size80">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        External Links
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {selectedMember.portfolioUrl && (
                          <a
                            href={selectedMember.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-size80 border border-border bg-card hover:bg-muted transition-colors text-xs font-medium min-w-0"
                          >
                            <span className="truncate mr-2 text-primary hover:underline">{selectedMember.portfolioUrl}</span>
                            <ArrowRightRegular className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          </a>
                        )}
                        {selectedMember.githubUrl && (
                          <a
                            href={selectedMember.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-size80 border border-border bg-card hover:bg-muted transition-colors text-xs font-medium min-w-0"
                          >
                            <span className="truncate mr-2 text-primary hover:underline">{selectedMember.githubUrl}</span>
                            <ArrowRightRegular className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          </a>
                        )}
                        {selectedMember.facebookUrl && (
                          <a
                            href={selectedMember.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-size80 border border-border bg-card hover:bg-muted transition-colors text-xs font-medium min-w-0"
                          >
                            <span className="truncate mr-2 text-primary hover:underline">{selectedMember.facebookUrl}</span>
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
                <Button className="flex-1 rounded-none h-9 text-xs" onClick={() => handleContactMember(selectedMember)}>
                  <MailRegular className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="rounded-none h-9 text-xs" onClick={() => setIsSheetOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

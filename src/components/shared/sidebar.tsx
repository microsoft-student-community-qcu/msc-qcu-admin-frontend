import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BoardRegular,
  PeopleRegular,
  CalendarLtrRegular,
  SignOutRegular,
  PersonRegular,
} from "@fluentui/react-icons";
import logo from "@/assets/qcu-msc-logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BoardRegular,
  },
  {
    title: "Applicants",
    url: "/applications",
    icon: PeopleRegular,
  },
  {
    title: "Members",
    url: "/members",
    icon: PersonRegular,
  },
  {
    title: "Events",
    url: "/events/list",
    icon: CalendarLtrRegular,
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate({ to: "/login" });
  };

  return (
    <ShadcnSidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-border bg-sidebar"
    >
      <SidebarHeader className="h-14 border-b border-sidebar-border justify-center py-0 px-2!">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link to="/dashboard" />}
              tooltip="Dashboard"
              className="p-1 h-12 group-data-[collapsible=icon]:p-0!"
            >
              <div className="flex aspect-square size-8 items-center justify-center shrink-0">
                <img src={logo} alt="QCU MSC" className="h-8 w-auto object-contain" />
              </div>
              <div className="grid flex-1 min-w-0 text-left leading-tight">
                <span className="truncate text-sm font-bold tracking-tight">
                  Quezon City University
                </span>
                <span className="truncate text-[10px] uppercase tracking-normal text-muted-foreground/80">
                  Microsoft Student Community
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-muted-foreground/70 truncate">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link to={item.url} />}
                      className="text-sm h-11 p-1 gap-3 [&>svg]:size-6 group-data-[collapsible=icon]:p-1!"
                    >
                      <item.icon />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="p-1 h-12 hover:bg-transparent! active:bg-transparent! cursor-default group-data-[collapsible=icon]:p-0!"
            >
              <Avatar className="h-9 w-9 rounded-none shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                <AvatarImage src="" alt="Admin User" />
                <AvatarFallback className=" bg-primary/10 rounded-none text-primary text-md font-semibold">
                  AU
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 min-w-0 text-left leading-tight">
                <span className="truncate text-base font-semibold text-foreground">Admin User</span>
                <span className="truncate text-xs font-medium text-muted-foreground">
                  admin@qcu.edu.ph
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="flex justify-center w-full overflow-hidden transition-all duration-300 ease-in-out h-9 opacity-100 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:opacity-0">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="destructive"
                  className="w-full h-9 text-base shadow-sm transition-transform duration-300 ease-in-out translate-y-0 group-data-[collapsible=icon]:translate-y-full"
                >
                  <span className="font-medium">Log out</span>
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Log Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to enter your credentials to log
                  back in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} variant="destructive">
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}

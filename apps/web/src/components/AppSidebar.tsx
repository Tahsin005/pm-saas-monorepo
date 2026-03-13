import { LayoutDashboard, FolderKanban, CalendarDays, Users, Zap } from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarTrigger,
    SidebarRail,
} from '@/components/ui/sidebar'
import { useAppSelector } from '@/store'
import { selectCurrentUser } from '@/store/authSlice'
const NAV_LINKS = [
    { label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { label: 'Projects', icon: <FolderKanban size={16} /> },
    { label: 'Calendar', icon: <CalendarDays size={16} /> },
    { label: 'Teams', icon: <Users size={16} /> },
]

export function AppSidebar() {
    const user = useAppSelector(selectCurrentUser)
    return (
        <Sidebar collapsible="icon" className="pt-14">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="hidden md:block">
                        <SidebarTrigger className="w-full justify-start" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_LINKS.map(({ label, icon }) => (
                                <SidebarMenuItem key={label}>
                                    <SidebarMenuButton
                                        tooltip={label}
                                        className="gap-2"
                                    >
                                        {icon}
                                        <span>{label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            variant="outline"
                            className="gap-2 border-border bg-background text-muted-foreground"
                            tooltip="Account"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                                {user?.email?.split('@')[0][0] ?? 'User'}
                            </span>
                            <span className="truncate">{user?.email?.split('@')[0] ?? 'User'}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar

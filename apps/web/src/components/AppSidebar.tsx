import { LayoutDashboard, FolderKanban, CalendarDays, Users } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
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
    SidebarMenuBadge,
    SidebarSeparator,
    SidebarTrigger,
    SidebarRail,
} from '@/components/ui/sidebar'
import { useAppSelector } from '@/store'
import { selectCurrentUser } from '@/store/authSlice'
const NAV_LINKS = [
    { label: 'Dashboard', icon: <LayoutDashboard className='text-base' size={16} />, to: '/dashboard' },
    { label: 'Projects', icon: <FolderKanban className='text-base' size={16} />, to: '/projects' },
    { label: 'Calendar', icon: <CalendarDays size={16} />, disabled: true },
    { label: 'Teams', icon: <Users size={16} />, disabled: true },
]

export function AppSidebar() {
    const user = useAppSelector(selectCurrentUser)
    const location = useLocation()
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
                            {NAV_LINKS.map(({ label, icon, to, disabled }) => {
                                const isActive = to
                                    ? location.pathname === to || location.pathname.startsWith(`${to}/`)
                                    : false
                                return (
                                <SidebarMenuItem key={label}>
                                    {to && !disabled ? (
                                        <SidebarMenuButton tooltip={label} className="gap-2" isActive={isActive} asChild>
                                            <NavLink to={to} className="flex items-center gap-2">
                                                {icon}
                                                <span className='text-base'>{label}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
                                    ) : (
                                        <SidebarMenuButton
                                            tooltip={`${label} (soon)`}
                                            className="gap-2 opacity-60"
                                            disabled
                                        >
                                            {icon}
                                            <span>{label}</span>
                                            <SidebarMenuBadge className="ml-auto">Soon</SidebarMenuBadge>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                                )
                            })}
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

import Navbar from '@/components/Navbar'
import AppSidebar from '@/components/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'

export default function AppShell() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
                <Navbar />
                <div className="flex flex-1 min-h-0">
                    <AppSidebar />
                    <SidebarInset className="flex flex-1 flex-col">
                        <div className="flex flex-1 flex-col gap-6 px-6 py-6">
                            <Outlet />
                        </div>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    )
}

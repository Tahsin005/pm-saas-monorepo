import { Bell, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
            <div className="flex h-14 items-center gap-4 px-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <SidebarTrigger className="md:hidden" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Zap size={16} />
                    </span>
                    TaskFlow
                </div>

                <div className="flex flex-1 items-center gap-2">
                    <div className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search projects, tasks..."
                            className="h-9 pl-9"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell size={16} />
                    </Button>
                    <Button size="sm">Upgrade</Button>
                </div>
            </div>
        </header>
    )
}
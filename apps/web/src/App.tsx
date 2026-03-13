import Navbar from '@/components/Navbar'
import AppSidebar from '@/components/AppSidebar'
import AuthScreen from '@/components/AuthScreen'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { useAppSelector } from '@/store'
import { selectAuthHydrating, selectIsAuthenticated } from '@/store/authSlice'
import { Loader2 } from 'lucide-react'

export default function App() {
  useAuthBootstrap()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const hydrating = useAppSelector(selectAuthHydrating)

  if (hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking session…
            </div>
            <CardTitle className="text-lg">Preparing your workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1 min-h-0">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-6 px-6 py-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overview</p>
                <h1 className="text-2xl font-semibold">Welcome back, Jane</h1>
                <p className="text-sm text-muted-foreground">
                  This is your workspace overview. We will fill this in with real data and actions next.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {['Active projects', 'Upcoming deadlines', 'Team activity'].map((label) => (
                  <div key={label} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                    <p className="mt-3 text-2xl font-semibold">0</p>
                    <p className="mt-1 text-xs text-muted-foreground">No data yet</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Recent activity</p>
                    <p className="text-xs text-muted-foreground">Keep track of what happens in your workspace.</p>
                  </div>
                  <Button size="sm" variant="outline">View all</Button>
                </div>
                <Separator />
                <div className="space-y-4 p-4">
                  {['Create your first project', 'Invite teammates', 'Define milestones'].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2">
                      <p className="text-sm text-muted-foreground">{item}</p>
                      <Button size="sm">Start</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

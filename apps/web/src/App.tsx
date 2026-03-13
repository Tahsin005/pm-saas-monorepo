import AppShell from '@/components/AppShell'
import LandingPage from '@/components/LandingPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { useAppSelector } from '@/store'
import { selectAuthHydrating, selectIsAuthenticated } from '@/store/authSlice'
import { Loader2 } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from '@/pages/DashboardPage'
import ProjectsListPage from '@/pages/ProjectsListPage'
import ProjectDetailPage from '@/pages/ProjectDetailPage'
import SearchResultsPage from '@/pages/SearchResultsPage'
import SettingsPage from '@/pages/SettingsPage'

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

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route element={isAuthenticated ? <AppShell /> : <Navigate to="/" replace />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

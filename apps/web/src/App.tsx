import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '@/components/RouteGuards'
import { PlaceholderPage } from '@/components/PlaceholderPage'
import AuthProvider from '@/components/AuthProvider'
import AppShell from '@/components/AppShell'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={<GuestRoute><LoginPage /></GuestRoute>}
          />
          <Route
            path="/register"
            element={<GuestRoute><RegisterPage /></GuestRoute>}
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <PlaceholderPage title="Dashboard" />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AppShell>
                  <PlaceholderPage title="Projects" />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <PlaceholderPage title="Project Detail" />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Home */}
          <Route
            path="/"
            element={
              <AppShell>
                <HomePage />
              </AppShell>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

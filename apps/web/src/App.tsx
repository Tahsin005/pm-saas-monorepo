import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '@/components/RouteGuards'
import { PlaceholderPage } from '@/components/PlaceholderPage'
import HomePage from '@/pages/HomePage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={<GuestRoute><PlaceholderPage title="Login" /></GuestRoute>}
        />
        <Route
          path="/register"
          element={<GuestRoute><PlaceholderPage title="Register" /></GuestRoute>}
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><PlaceholderPage title="Dashboard" /></ProtectedRoute>}
        />
        <Route
          path="/projects"
          element={<ProtectedRoute><PlaceholderPage title="Projects" /></ProtectedRoute>}
        />
        <Route
          path="/projects/:projectId"
          element={<ProtectedRoute><PlaceholderPage title="Project Detail" /></ProtectedRoute>}
        />

        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

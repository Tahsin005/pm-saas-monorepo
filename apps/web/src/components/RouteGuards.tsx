import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/index'
import { selectIsAuthenticated } from '@/store/authSlice'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    if (isAuthenticated) return <Navigate to="/dashboard" replace />
    return <>{children}</>
}

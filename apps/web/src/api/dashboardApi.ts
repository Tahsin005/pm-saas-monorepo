import { api } from '@/store/api'
import type { DashboardStats } from '@repo/shared-types'

export const dashboardApi = api.injectEndpoints({
    endpoints: (build) => ({
        getDashboard: build.query<DashboardStats, void>({
            query: () => ({ url: '/dashboard', method: 'GET' }),
            transformResponse: (raw: { success: true; data: DashboardStats }) => raw.data,
        }),
    }),
    overrideExisting: false,
})

export const { useGetDashboardQuery } = dashboardApi

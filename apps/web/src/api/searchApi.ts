import { api } from '@/store/api'
import type { SearchResults } from '@repo/shared-types'

export const searchApi = api.injectEndpoints({
    endpoints: (build) => ({
        search: build.query<SearchResults, string>({
            query: (q) => ({
                url: '/search',
                method: 'GET',
                params: { q },
            }),
            transformResponse: (raw: { success: true; data: SearchResults }) => raw.data,
        }),
    }),
    overrideExisting: false,
})

export const { useSearchQuery } = searchApi

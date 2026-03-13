import { api } from '@/store/api'
import type { ProjectStatus } from '@repo/shared-types'

export interface Project {
    id: string
    name: string
    description?: string | null
    status: ProjectStatus
    ownerId: string
    createdAt: string
    updatedAt: string
}

export interface ProjectStats {
    totalTasks?: number
    completedTasks?: number
    overdueTasks?: number
    highPriorityTasks?: number
}

export interface ProjectWithStats extends Project {
    stats?: ProjectStats
}

export interface ProjectListResponse {
    data: Project[]
    page: number
    limit: number
    total: number
}

export interface CreateProjectInput {
    name: string
    description?: string | null
    status?: ProjectStatus
}

export interface UpdateProjectInput {
    name?: string
    description?: string | null
    status?: ProjectStatus
}

export interface ProjectListParams {
    status?: ProjectStatus
    page?: number
    limit?: number
}

export const projectsApi = api.injectEndpoints({
    endpoints: (build) => ({
        listProjects: build.query<ProjectListResponse, ProjectListParams | void>({
            query: (params) => ({
                url: '/projects',
                method: 'GET',
                ...(params ? { params } : {}),
            }),
            transformResponse: (raw: { success: true; data: Project[]; page: number; limit: number; total: number }) => ({
                data: raw.data,
                page: raw.page,
                limit: raw.limit,
                total: raw.total,
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map((project) => ({ type: 'Project' as const, id: project.id })),
                          { type: 'Project' as const, id: 'LIST' },
                      ]
                    : [{ type: 'Project' as const, id: 'LIST' }],
        }),
        getProject: build.query<ProjectWithStats, string>({
            query: (id) => ({ url: `/projects/${id}`, method: 'GET' }),
            transformResponse: (raw: { success: true; data: ProjectWithStats }) => raw.data,
            providesTags: (_result, _err, id) => [{ type: 'Project' as const, id }],
        }),
        createProject: build.mutation<Project, CreateProjectInput>({
            query: (body) => ({ url: '/projects', method: 'POST', body }),
            transformResponse: (raw: { success: true; data: Project }) => raw.data,
            invalidatesTags: [{ type: 'Project' as const, id: 'LIST' }],
        }),
        updateProject: build.mutation<Project, { id: string; data: UpdateProjectInput }>({
            query: ({ id, data }) => ({ url: `/projects/${id}`, method: 'PATCH', body: data }),
            transformResponse: (raw: { success: true; data: Project }) => raw.data,
            invalidatesTags: (_result, _err, { id }) => [
                { type: 'Project' as const, id },
                { type: 'Project' as const, id: 'LIST' },
            ],
        }),
        deleteProject: build.mutation<void, string>({
            query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, _err, id) => [
                { type: 'Project' as const, id },
                { type: 'Project' as const, id: 'LIST' },
            ],
        }),
    }),
    overrideExisting: false,
})

export const {
    useListProjectsQuery,
    useGetProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectsApi

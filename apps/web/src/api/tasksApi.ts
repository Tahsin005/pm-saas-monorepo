import { api } from '@/store/api'
import type {
    Task,
    TaskListQuery,
    TaskStatus,
    TaskPriority,
    CreateTaskInput,
    UpdateTaskInput,
    UpdateTaskStatusInput,
    UpdateTaskOrderInput,
} from '@repo/shared-types'

export interface TaskListMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface TaskListResponse {
    data: Task[]
    meta: TaskListMeta
}

export type TaskListParams = TaskListQuery & { projectId: string }

export const tasksApi = api.injectEndpoints({
    endpoints: (build) => ({
        listTasks: build.query<TaskListResponse, TaskListParams>({
            query: ({ projectId, ...params }) => ({
                url: `/projects/${projectId}/tasks`,
                method: 'GET',
                params,
            }),
            transformResponse: (raw: { success: true; items: Task[]; meta: TaskListMeta }) => ({
                data: raw.items,
                meta: raw.meta,
            }),
            providesTags: (result, _err, { projectId }) =>
                result
                    ? [
                          ...result.data.map((task) => ({ type: 'Task' as const, id: task.id })),
                          { type: 'Task' as const, id: `LIST-${projectId}` },
                      ]
                    : [{ type: 'Task' as const, id: `LIST-${projectId}` }],
        }),
        getTask: build.query<Task, { projectId: string; taskId: string }>({
            query: ({ projectId, taskId }) => ({
                url: `/projects/${projectId}/tasks/${taskId}`,
                method: 'GET',
            }),
            transformResponse: (raw: { success: true; data: Task }) => raw.data,
            providesTags: (_result, _err, { taskId }) => [{ type: 'Task' as const, id: taskId }],
        }),
        createTask: build.mutation<Task, { projectId: string; data: CreateTaskInput }>({
            query: ({ projectId, data }) => ({
                url: `/projects/${projectId}/tasks`,
                method: 'POST',
                body: data,
            }),
            transformResponse: (raw: { success: true; data: Task }) => raw.data,
            invalidatesTags: (_result, _err, { projectId }) => [{ type: 'Task' as const, id: `LIST-${projectId}` }],
        }),
        updateTask: build.mutation<Task, { projectId: string; taskId: string; data: UpdateTaskInput }>({
            query: ({ projectId, taskId, data }) => ({
                url: `/projects/${projectId}/tasks/${taskId}`,
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (raw: { success: true; data: Task }) => raw.data,
            invalidatesTags: (_result, _err, { projectId, taskId }) => [
                { type: 'Task' as const, id: taskId },
                { type: 'Task' as const, id: `LIST-${projectId}` },
            ],
        }),
        updateTaskStatus: build.mutation<Task, { projectId: string; taskId: string; data: UpdateTaskStatusInput }>({
            query: ({ projectId, taskId, data }) => ({
                url: `/projects/${projectId}/tasks/${taskId}/status`,
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (raw: { success: true; data: Task }) => raw.data,
            invalidatesTags: (_result, _err, { projectId, taskId }) => [
                { type: 'Task' as const, id: taskId },
                { type: 'Task' as const, id: `LIST-${projectId}` },
            ],
        }),
        updateTaskOrder: build.mutation<Task, { projectId: string; taskId: string; data: UpdateTaskOrderInput }>({
            query: ({ projectId, taskId, data }) => ({
                url: `/projects/${projectId}/tasks/${taskId}/order`,
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (raw: { success: true; data: Task }) => raw.data,
            invalidatesTags: (_result, _err, { projectId, taskId }) => [
                { type: 'Task' as const, id: taskId },
                { type: 'Task' as const, id: `LIST-${projectId}` },
            ],
        }),
        deleteTask: build.mutation<void, { projectId: string; taskId: string }>({
            query: ({ projectId, taskId }) => ({
                url: `/projects/${projectId}/tasks/${taskId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _err, { projectId, taskId }) => [
                { type: 'Task' as const, id: taskId },
                { type: 'Task' as const, id: `LIST-${projectId}` },
            ],
        }),
    }),
    overrideExisting: false,
})

export const {
    useListTasksQuery,
    useGetTaskQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskOrderMutation,
    useDeleteTaskMutation,
} = tasksApi

export type { Task, TaskListQuery, TaskStatus, TaskPriority }

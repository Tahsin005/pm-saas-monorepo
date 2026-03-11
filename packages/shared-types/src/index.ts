// ---------------------------------------------------------------------------
// Entity shapes — mirror what the API returns in response bodies
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export const PROJECT_STATUS_VALUES = ['ACTIVE', 'ARCHIVED', 'COMPLETED'] as const;
export type ProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const TASK_STATUS_VALUES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

export const TASK_PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export type TaskPriority = (typeof TASK_PRIORITY_VALUES)[number];

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  dueAt?: string | null;
  tags: string[];
  projectId: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Used in JWT payload and req.user
export type AuthUser = Pick<User, 'id' | 'email'>;

// ---------------------------------------------------------------------------
// API request input shapes — consumed by both the API (Zod inference) and
// the frontend (form types / API client calls)
// ---------------------------------------------------------------------------

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueAt?: string;
  tags?: string[];
  parentId?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueAt?: string | null;
  tags?: string[];
  parentId?: string | null;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

export interface UpdateTaskOrderInput {
  order: number;
}

// ---------------------------------------------------------------------------
// API response envelopes — what the frontend unwraps from every response
// ---------------------------------------------------------------------------

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Query / filter param shapes — used by the frontend when building requests
// ---------------------------------------------------------------------------

export interface ProjectListQuery {
  status?: ProjectStatus;
  page?: number;
  limit?: number;
}

export type TaskSortField = 'order' | 'priority' | 'dueAt' | 'createdAt' | 'updatedAt';
export type SortDir = 'asc' | 'desc';

export interface TaskListQuery {
  status?: TaskStatus;
  priority?: TaskPriority;
  tag?: string;
  overdue?: boolean;
  sort?: TaskSortField;
  dir?: SortDir;
  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------

export interface TaskStatusCounts {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
}

export interface ProjectStats {
  taskStats: TaskStatusCounts;
  completionPercent: number;
  overdueCount: number;
}

export interface DashboardStats {
  projects: {
    total: number;
    ACTIVE: number;
    ARCHIVED: number;
    COMPLETED: number;
  };
  tasks: TaskStatusCounts & {
    total: number;
    overdue: number;
    completedThisWeek: number;
  };
  recentProject: Pick<Project, 'id' | 'name' | 'updatedAt'> | null;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchResults {
  projects: Pick<Project, 'id' | 'name' | 'status' | 'updatedAt'>[];
  tasks: Pick<Task, 'id' | 'title' | 'status' | 'priority' | 'projectId'>[];
}

// ---------------------------------------------------------------------------
// User update input
// ---------------------------------------------------------------------------

export interface UpdateMeInput {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

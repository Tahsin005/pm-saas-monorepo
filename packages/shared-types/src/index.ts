// ---------------------------------------------------------------------------
// Entity shapes — mirror what the API returns in response bodies
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export const TASK_STATUS_VALUES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  projectId: string;
  createdAt: string;
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
}

export interface UpdateProjectInput {
  name: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
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

export interface User {
    id: string
    email: string
}

export interface Project {
    id: string
    name: string
    ownerId: string
}

export interface Task {
    id: string
    title: string
    completed: boolean
    projectId: string
}
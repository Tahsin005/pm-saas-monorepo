# Project Management SaaS Monorepo

## Overview
This monorepo contains a project management SaaS platform with a modular structure for backend, frontend, and shared types. It leverages npm workspaces for dependency management and code sharing.

## Monorepo Structure

```
pm-saas-monorepo/
├── apps/
│   ├── api/        # Express backend (project/task/user modules)
│   └── web/        # React frontend (RTK Query, Vite)
├── packages/
│   ├── shared-types/  # Shared TypeScript types (ProjectWithStats, PaginationMeta, etc.)
│   ├── auth/       # Auth logic (future)
│   └── config/     # Config utilities (future)
├── package.json    # npm workspaces root
└── README.md       # This file
```

## Shared vs Local Types

- **Shared Types**: Common shapes (e.g., `ProjectWithStats`, `ProjectTaskStats`, `PaginationMeta`) are defined in `packages/shared-types/src/index.ts` and used across backend and frontend for contract alignment.
- **Local Response Wrappers**: Response wrappers (e.g., `ProjectListResponse`, `TaskListResponse`) remain local to frontend API files for normalization and UI-specific needs, but use shared pagination types.

## Architectural Decisions

- **Npm Workspaces**: Enables modular development and dependency sharing.
- **Type Consolidation**: Promotes maintainability by centralizing reusable types.
- **UI/UX Improvements**: Recent updates improved contrast, landing page content, and dashboard clarity.
- **Frontend/Backend Contract Alignment**: Shared types ensure consistent API responses and reduce duplication.

## Recent Improvements

- Promoted pagination and project/task stats types to shared package.
- Refactored frontend API files to use shared types.
- Improved UI contrast and landing page content.
- Updated dashboard and search pages for feature alignment.

## Getting Started

1. **Install dependencies:**
	```zsh
	npm install
	```
2. **Run backend:**
	```zsh
	npm run dev:api
	```
3. **Run frontend:**
	```zsh
	npm run dev:web
	```

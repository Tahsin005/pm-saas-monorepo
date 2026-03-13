import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES, type TaskPriority, type TaskStatus } from '@repo/shared-types'

export type TaskFormValues = {
    title: string
    description?: string | null
    status?: TaskStatus
    priority?: TaskPriority
    dueAt?: string | null
    tags?: string[]
}

type TaskFormProps = {
    initialValues?: TaskFormValues
    submitLabel?: string
    isSubmitting?: boolean
    onSubmit: (values: TaskFormValues) => Promise<void> | void
}

const toInputDate = (value?: string | null) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
}

export default function TaskForm({ initialValues, submitLabel = 'Save task', isSubmitting, onSubmit }: TaskFormProps) {
    const [title, setTitle] = useState(initialValues?.title ?? '')
    const [description, setDescription] = useState(initialValues?.description ?? '')
    const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'TODO')
    const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'MEDIUM')
    const [dueAt, setDueAt] = useState(toInputDate(initialValues?.dueAt))
    const [tags, setTags] = useState(() => (initialValues?.tags ?? []).join(', '))

    const tagsArray = useMemo(() => {
        return tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
    }, [tags])

    return (
        <form
            className="space-y-5"
            onSubmit={(event) => {
                event.preventDefault()
                const dueAtValue = dueAt ? new Date(dueAt).toISOString() : undefined
                onSubmit({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    status,
                    priority,
                    dueAt: dueAtValue,
                    tags: tagsArray.length ? tagsArray : undefined,
                })
            }}
        >
            <div className="space-y-2">
                <Label htmlFor="task-title" className="text-foreground">Title</Label>
                <Input
                    id="task-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Design kickoff"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="task-description" className="text-foreground">Description</Label>
                <textarea
                    id="task-description"
                    className="min-h-[120px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add details for the team"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-foreground">Priority</Label>
                <div className="flex flex-wrap gap-2">
                    {TASK_PRIORITY_VALUES.map((value) => (
                        <Button
                            key={value}
                            type="button"
                            variant={priority === value ? 'default' : 'outline'}
                            size="sm"
                            className={priority === value ? undefined : 'text-foreground'}
                            onClick={() => setPriority(value)}
                        >
                            {value}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-foreground">Status</Label>
                <div className="flex flex-wrap gap-2">
                    {TASK_STATUS_VALUES.map((value) => (
                        <Button
                            key={value}
                            type="button"
                            variant={status === value ? 'default' : 'outline'}
                            size="sm"
                            className={status === value ? undefined : 'text-foreground'}
                            onClick={() => setStatus(value)}
                        >
                            {value}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="task-due" className="text-foreground">Due date</Label>
                <Input
                    id="task-due"
                    type="datetime-local"
                    value={dueAt}
                    onChange={(event) => setDueAt(event.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="task-tags" className="text-foreground">Tags</Label>
                <Input
                    id="task-tags"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="design, onboarding"
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
        </form>
    )
}

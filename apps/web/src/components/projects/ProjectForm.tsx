import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PROJECT_STATUS_VALUES, type ProjectStatus } from '@repo/shared-types'

export type ProjectFormValues = {
    name: string
    description?: string | null
    status?: ProjectStatus
}

type ProjectFormProps = {
    initialValues?: ProjectFormValues
    submitLabel?: string
    isSubmitting?: boolean
    onSubmit: (values: ProjectFormValues) => Promise<void> | void
}

export default function ProjectForm({
    initialValues,
    submitLabel = 'Save project',
    isSubmitting,
    onSubmit,
}: ProjectFormProps) {
    const [name, setName] = useState(initialValues?.name ?? '')
    const [description, setDescription] = useState(initialValues?.description ?? '')
    const [status, setStatus] = useState<ProjectStatus>(initialValues?.status ?? 'ACTIVE')

    return (
        <form
            className="space-y-5"
            onSubmit={(event) => {
                event.preventDefault()
                onSubmit({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    status,
                })
            }}
        >
            <div className="space-y-2">
                <Label htmlFor="project-name" className="text-base text-foreground">Project name</Label>
                <Input
                    id="project-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="New client onboarding"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="project-description" className="text-base text-foreground">Description</Label>
                <textarea
                    id="project-description"
                    className="min-h-[120px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Add context, goals, or key milestones"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-base text-foreground">Status</Label>
                <div className="flex flex-wrap gap-2">
                    {PROJECT_STATUS_VALUES.map((value) => (
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

            <Button type="submit" className="w-full" disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
        </form>
    )
}

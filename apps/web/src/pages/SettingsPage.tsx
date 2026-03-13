import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGetMeQuery, useUpdateMeMutation } from '@/api/usersApi'

export default function SettingsPage() {
    const { data, isLoading, error } = useGetMeQuery()
    const [updateMe, updateState] = useUpdateMeMutation()
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    useEffect(() => {
        if (data?.email) {
            setEmail(data.email)
        }
    }, [data])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const payload: Record<string, string> = {}
        if (email.trim() && email.trim() !== data?.email) {
            payload.email = email.trim()
        }
        if (newPassword.trim()) {
            payload.currentPassword = currentPassword
            payload.newPassword = newPassword
        }

        if (Object.keys(payload).length === 0) {
            toast('No changes to save')
            return
        }

        try {
            await updateMe(payload).unwrap()
            toast.success('Profile updated')
            setCurrentPassword('')
            setNewPassword('')
        } catch (err) {
            toast.error('Unable to update profile')
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Unable to load settings</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Please refresh and try again.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Settings</p>
                <h1 className="text-2xl font-semibold">Profile settings</h1>
                <p className="text-sm text-muted-foreground">
                    Update your email and password for this workspace.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                placeholder="Required to change password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="At least 8 characters"
                            />
                        </div>

                        <Button type="submit" disabled={updateState.isLoading}>
                            {updateState.isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

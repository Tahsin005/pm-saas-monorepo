import Navbar from '@/components/Navbar'

interface AppShellProps {
    children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <>
            <Navbar />
            <main className="pt-14">
                {children}
            </main>
        </>
    )
}

export function PlaceholderPage({ title }: { title: string }) {
    return (
        <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600 }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                Page coming soon.
            </p>
        </div>
    )
}

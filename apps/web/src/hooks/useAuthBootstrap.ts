import { useEffect } from 'react'
import { useLazyGetMeQuery } from '@/api/authApi'

export function useAuthBootstrap() {
    const [trigger] = useLazyGetMeQuery()

    useEffect(() => {
        void trigger()
    }, [trigger])
}

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true, // sends the httpOnly refresh-token cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// Reads the access token from window.__AUTH_TOKEN__ — kept in sync by authSlice.
apiClient.interceptors.request.use((config) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token: string | null = (window as any).__AUTH_TOKEN__ ?? null;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


let isRefreshing = false;
let failQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
    failQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
    failQueue = [];
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
        if (isRefreshing) {
            // Park this request until the in-flight refresh completes
            return new Promise<string>((resolve, reject) => {
                failQueue.push({ resolve, reject });
            }).then((token) => {
                original.headers['Authorization'] = `Bearer ${token}`;
                return apiClient(original);
            });
        }

        original._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(
                `${BASE_URL}/api/v1/auth/refresh`,
                {},
                { withCredentials: true },
            );

            const newToken: string = data.data.accessToken;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__AUTH_TOKEN__ = newToken;

            processQueue(null, newToken);
            original.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(original);
        } catch (refreshError) {
            processQueue(refreshError, null);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__AUTH_TOKEN__ = null;
            window.location.href = '/login';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

        return Promise.reject(error);
    },
);

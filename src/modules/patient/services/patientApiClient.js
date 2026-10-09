// WIDA Patient Module - High-Fidelity API Client
export class ApiError extends Error {
    status;
    data;
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}
class PatientApiClient {
    baseUrl;
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
    }
    getToken() {
        try {
            return localStorage.getItem('wida_patient_jwt');
        }
        catch {
            return null;
        }
    }
    buildUrl(path, params) {
        let cleanPath = path;
        if (!path.startsWith('http')) {
            if (path.startsWith(this.baseUrl)) {
                cleanPath = path;
            }
            else {
                cleanPath = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
            }
        }
        const url = new URL(cleanPath, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null) {
                    url.searchParams.append(key, String(val));
                }
            });
        }
        return url.pathname + url.search;
    }
    async request(path, options = {}) {
        const { params, headers, ...restOptions } = options;
        const url = this.buildUrl(path, params);
        // Only auto-start MSW if Java backend is NOT available
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !navigator.serviceWorker.controller) {
            try {
                const javaAlive = await fetch('http://localhost:8080/api/system/health', { signal: AbortSignal.timeout(400) })
                    .then(r => r.ok).catch(() => false);
                if (!javaAlive) {
                    const { ensureMswActive } = await import('../../../mocks/browser');
                    await ensureMswActive();
                }
            }
            catch {
                // Fallback to regular fetch
            }
        }
        const defaultHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
        const token = this.getToken();
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(url, {
                ...restOptions,
                headers: {
                    ...defaultHeaders,
                    ...headers
                }
            });
            // Safely read response text ONCE to avoid "body stream already read"
            const rawText = await response.text();
            let parsedData = null;
            if (rawText) {
                try {
                    parsedData = JSON.parse(rawText);
                }
                catch {
                    parsedData = rawText;
                }
            }
            if (!response.ok) {
                let message = `API Request failed with status ${response.status}`;
                if (typeof parsedData === 'object' && parsedData && 'error' in parsedData) {
                    message = String(parsedData.error);
                }
                else if (typeof parsedData === 'string' && parsedData.length > 0 && parsedData.length < 150) {
                    message = parsedData;
                }
                else if (response.status === 404) {
                    message = `Endpoint ${url} not found (404). Ensure MSW is initialized.`;
                }
                throw new ApiError(message, response.status, parsedData);
            }
            return (parsedData ?? {});
        }
        catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError(err instanceof Error ? err.message : 'Network connection error', 0, err);
        }
    }
    get(path, params, options) {
        return this.request(path, { ...options, method: 'GET', params });
    }
    post(path, body, options) {
        return this.request(path, {
            ...options,
            method: 'POST',
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    }
    put(path, body, options) {
        return this.request(path, {
            ...options,
            method: 'PUT',
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    }
    patch(path, body, options) {
        return this.request(path, {
            ...options,
            method: 'PATCH',
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    }
    delete(path, options) {
        return this.request(path, { ...options, method: 'DELETE' });
    }
}
export const patientApiClient = new PatientApiClient('/api');

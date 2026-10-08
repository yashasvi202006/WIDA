// WIDA Patient Module - High-Fidelity API Client
export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class PatientApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem('wida_patient_jwt');
    } catch {
      return null;
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    let cleanPath = path;
    if (!path.startsWith('http')) {
      if (path.startsWith(this.baseUrl)) {
        cleanPath = path;
      } else {
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

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;
    const url = this.buildUrl(path, params);

    // Auto-ensure Mock Service Worker is controlling the client
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && !navigator.serviceWorker.controller) {
      try {
        const { ensureMswActive } = await import('../../../mocks/browser');
        await ensureMswActive();
      } catch {
        // Fallback to regular fetch
      }
    }

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    const token = this.getToken();
    if (token) {
      (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
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
      let parsedData: unknown = null;
      if (rawText) {
        try {
          parsedData = JSON.parse(rawText);
        } catch {
          parsedData = rawText;
        }
      }

      if (!response.ok) {
        let message = `API Request failed with status ${response.status}`;
        if (typeof parsedData === 'object' && parsedData && 'error' in parsedData) {
          message = String((parsedData as { error: unknown }).error);
        } else if (typeof parsedData === 'string' && parsedData.length > 0 && parsedData.length < 150) {
          message = parsedData;
        } else if (response.status === 404) {
          message = `Endpoint ${url} not found (404). Ensure MSW is initialized.`;
        }

        throw new ApiError(message, response.status, parsedData);
      }

      return (parsedData ?? ({} as unknown)) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err instanceof Error ? err.message : 'Network connection error', 0, err);
    }
  }

  public get<T>(path: string, params?: Record<string, string | number | boolean | undefined>, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET', params });
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  }

  public put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  }

  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const patientApiClient = new PatientApiClient('/api');

import { useNotifications } from '../_shared/notifications';
import { env } from '../_config/env';
import { isServer, buildUrlWithParams, getServerCookies, logResponse } from './api.utils';

export type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  isSilent?: boolean;
  enableTokenRefreshing?: boolean;
  accessTokenOverride?: string;
};

async function fetchApi<T>(
  path: string,
  initialOptions: RequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    cookie,
    params,
    cache = 'no-store',
    next,
    isSilent,
    enableTokenRefreshing = true,
  } = initialOptions;

  const fullUrl = buildUrlWithParams(`${env.API_URL}${path}`, params);

  // Get cookies from the request when running on server
  let cookieHeader = cookie;
  if (isServer && !cookie) {
    cookieHeader = await getServerCookies();
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    cache,
    next,
  };

  const response = await fetch(fullUrl, options as RequestInit);

  logResponse(method, path, response);

  if (!response.ok) {

    const willRefreshToken = response.status === 401 && !isServer && enableTokenRefreshing;

    if (willRefreshToken) {
      const response = await fetch(`${env.API_URL}/auth/token`, { ...options, method: 'POST' } as RequestInit);

      logResponse('POST', '/auth/token', response);

      if (!response.ok) {
        const message = (await response.json()).message || response.statusText;
        throw new Error(message);
      }

      return await fetchApi<T>(path, { ...options, enableTokenRefreshing: false });
    }

    const message = (await response.json()).message || response.statusText;
    if (typeof window !== 'undefined' && !isSilent) {
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    }
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'POST', body });
  },
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PUT', body });
  },
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PATCH', body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' });
  },
  // Allows to make a silent request to check authentication status. We don't want to show notifications in this case.
  getSilently<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET', isSilent: true });
  },
};
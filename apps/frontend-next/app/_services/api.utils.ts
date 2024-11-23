import { RequestOptions } from './api';

export const isServer = typeof window === 'undefined';

export const logResponse = (method: string, path: string, response: Response) => {
  if (process.env.NODE_ENV === 'production') return;

  const log = response.status === 200 ? console.info : console.warn;
  const color = response.status === 200 ? '\x1b[32m%s\x1b[0m' : '\x1b[33m%s\x1b[0m';
  const source = isServer ? 'SERVER' : 'CLIENT';
  log(color, '---------------------------------------------');
  log(color, ` ${source} ${method} ${path} ${response.status} in ${response.headers.get('x-response-time')}`);
  log(color, '---------------------------------------------');
};

// Create a separate function for getting server-side cookies that can be imported where needed
export function getServerCookies() {
  if (!isServer) return '';

  // Dynamic import next/headers only on server-side
  return import('next/headers').then(async ({ cookies }) => {
    try {
      const cookieStore = await cookies();
      return cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
    } catch (error) {
      console.error('Failed to access cookies:', error);
      return '';
    }
  });
}

export function buildUrlWithParams(
  url: string,
  params?: RequestOptions['params'],
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([ , value ]) => value !== undefined && value !== null,
    ),
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>,
  ).toString();
  return `${url}?${queryString}`;
}
import { envConfig } from '@/_server/envConfig';
import { SerializeOptions } from 'cookie';

export const refreshCookieName = 'app_refresh';

export const accessCookieName = 'app_access';

/**
 * Configuration options for the authentication cookie.
 * 
 * @type {SerializeOptions}
 * @property {boolean} httpOnly - Indicates if the cookie is accessible only through the HTTP protocol.
 * @property {'strict' | 'lax' | 'none'} sameSite - Controls whether the cookie is sent with cross-site requests.
 * @property {boolean} secure - Indicates if the cookie should be sent only over HTTPS.
 * @property {number} maxAge - The maximum age of the cookie in seconds (30 days).
 * @property {string} path - The URL path that must exist in the requested URL for the browser to send the Cookie header.
 */
export const loginCookieOptions: SerializeOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: envConfig.isProduction,
  path: '/',
};

export const logoutCookieOptions: SerializeOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: envConfig.isProduction,
  maxAge: -1,
  path: '/',
};
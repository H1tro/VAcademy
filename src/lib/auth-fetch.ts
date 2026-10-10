import { auth, authConfigured } from './auth-client';

export async function authFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (authConfigured && auth.currentUser) headers.set('Authorization', `Bearer ${await auth.currentUser.getIdToken()}`);
  return fetch(url, { ...init, headers });
}

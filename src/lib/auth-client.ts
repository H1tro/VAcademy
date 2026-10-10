"use client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";

export const authConfigured = isSupabaseConfigured();
export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken: () => Promise<string>;
};
let currentUser: User | null = null;
export const auth = { get currentUser() { return currentUser; } };

function wrapUser(user: SupabaseUser): User {
  return {
    uid: user.id, email: user.email ?? null,
    displayName: user.user_metadata.displayName ?? null,
    photoURL: user.user_metadata.photoURL ?? null,
    async getIdToken() {
      const { data, error } = await createClient().auth.getSession();
      if (error || !data.session || data.session.user.id !== user.id) throw new Error("Sign in again.");
      return data.session.access_token;
    },
  };
}

export function onAuthStateChanged(_auth: typeof auth, callback: (user: User | null) => void) {
  if (!authConfigured) { callback(null); return () => {}; }
  let active = true;
  const { data: { subscription } } = createClient().auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ? wrapUser(session.user) : null;
    const user = currentUser;
    // Supabase callbacks must finish before code calls another auth method.
    queueMicrotask(() => { if (active) callback(user); });
  });
  return () => { active = false; subscription.unsubscribe(); };
}

export async function signInWithEmailAndPassword(_auth: typeof auth, email: string, password: string) {
  const { data, error } = await createClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = wrapUser(data.user);
  return { user: currentUser };
}

export async function createUserWithEmailAndPassword(_auth: typeof auth, email: string, password: string, metadata: Record<string, unknown>) {
  const { data, error } = await createClient().auth.signUp({ email, password, options: {
    data: metadata, emailRedirectTo: `${window.location.origin}/auth/callback`,
  } });
  if (error) throw error;
  if (!data.user) throw new Error("Could not create account.");
  currentUser = data.session ? wrapUser(data.user) : null;
  return { user: wrapUser(data.user), session: data.session };
}

export async function updateProfile(_user: User, profile: { displayName: string; photoURL?: string }) {
  const { data, error } = await createClient().auth.updateUser({ data: { displayName: profile.displayName, photoURL: profile.photoURL ?? "" } });
  if (error) throw error;
  currentUser = wrapUser(data.user);
}
export async function signOut(_auth: typeof auth) {
  if (!authConfigured) return;
  const { error } = await createClient().auth.signOut({ scope: "local" });
  if (error) throw error;
  currentUser = null;
}
export const EmailAuthProvider = { credential: (email: string, password: string) => ({ email, password }) };
export async function reauthenticateWithCredential(user: User, credential: { email: string; password: string }) {
  const result = await signInWithEmailAndPassword(auth, credential.email, credential.password);
  if (result.user.uid !== user.uid) throw new Error("Account mismatch.");
}
export async function updatePassword(_user: User, password: string) {
  const { error } = await createClient().auth.updateUser({ password });
  if (error) throw error;
}

export async function sendPasswordResetEmail(email: string) {
  const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  });
  if (error) throw error;
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await createClient().auth.resend({
    type: "signup", email: email.trim(),
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

"use client";

import { authFetch } from '@/lib/auth-fetch';
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, firebaseConfigured } from "@/lib/firebase";

interface UseAuthResult {
  user: User | null;
  uid: string | null;
  loading: boolean;
  role: 'student' | 'teacher' | null;
}

/** Subscribes to Firebase auth; safe for client components. */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);

  useEffect(() => {
    if (!firebaseConfigured) { setLoading(false); return; }
    let version = 0;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      const current = ++version;
      setUser(u);
      setRole(null);
      if (u) authFetch(`/api/profile?uid=${encodeURIComponent(u.uid)}`).then(r => r.ok ? r.json() : {}).then((data: { role?: string }) => { if (current === version) setRole(data.role === 'teacher' ? 'teacher' : 'student'); }).catch(() => { if (current === version) setRole('student'); });
      setLoading(false);
    });
    return () => { version++; unsubscribe(); };
  }, []);

  return { user, uid: user?.uid ?? null, loading, role };
}

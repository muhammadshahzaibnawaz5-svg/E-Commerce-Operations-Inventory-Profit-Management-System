"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { users } from "@/lib/data/users";
import type { User } from "@/lib/types";

interface SessionContextValue {
  user: User | null;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  user: null,
  signIn: () => ({ ok: false }),
  signOut: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("mockSessionUserId");
    if (id) {
      const found = users.find((u) => u.id === id);
      if (found) setUser(found);
    }
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    );
    if (!found) return { ok: false as const, error: "Email or password is incorrect" };
    if (found.status !== "active") {
      return { ok: false as const, error: "This account is disabled" };
    }
    localStorage.setItem("mockSessionUserId", found.id);
    setUser(found);
    return { ok: true as const };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("mockSessionUserId");
    setUser(null);
  }, []);

  return (
    <SessionContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
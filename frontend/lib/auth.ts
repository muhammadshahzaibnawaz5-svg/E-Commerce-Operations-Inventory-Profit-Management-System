import { users } from "@/lib/data/users";
import type { OtpSession, User } from "@/lib/types";

export const MOCK_OTP = "123456";

export function signInWithEmail(email: string, password: string): { user?: User; error?: string } {
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  if (!user) return { error: "Email or password is incorrect" };
  if (user.status !== "active") return { error: "This account is disabled" };
  return { user };
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function createOtpSession(email: string): OtpSession {
  return {
    email,
    code: MOCK_OTP,
    issuedAt: new Date().toISOString(),
    expiresInSeconds: 30,
    verified: false,
  };
}

export function verifyOtp(code: string, session: OtpSession | null): boolean {
  return !!session && session.code === code && !session.verified;
}
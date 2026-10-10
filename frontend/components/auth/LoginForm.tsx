"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/controls";
import { Alert } from "@/components/ui/Alert";
import { IconEye, IconEyeOff, IconLock, IconMail } from "@/components/ui/icons";
import { users } from "@/lib/data/users";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = signIn(email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error ?? "Email or password is incorrect");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email and password to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error && <Alert variant="destructive" title="Unable to sign in">{error}</Alert>}
          <Field label="Email" htmlFor="email" required>
            <div className="relative">
              <IconMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={16} height={16} />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </Field>
          <Field label="Password" htmlFor="password" required>
            <div className="relative">
              <IconLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={16} height={16} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <IconEyeOff width={16} height={16} /> : <IconEye width={16} height={16} />}
              </button>
            </div>
          </Field>
          <div className="flex justify-end">
            <a href="/auth/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover">
              Forgot password?
            </a>
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Checking…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <a href="/auth/signup" className="font-medium text-primary hover:text-primary-hover">
              Sign up
            </a>
          </p>
        </form>

        <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Demo accounts
          </p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-2">
                <span>{u.role}</span>
                <span className="font-mono">{u.email}</span>
                <span className="font-mono">/ {u.password}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/controls";
import { Alert } from "@/components/ui/Alert";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSuccess(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <Alert variant="success" title="Password updated">
            Your password has been updated.{" "}
            <a href="/auth/login" className="font-medium text-primary underline">
              Sign in
            </a>{" "}
            with your new password.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {error && <Alert variant="destructive" title="Check the form">{error}</Alert>}
            <Field label="New password" htmlFor="password" required hint="At least 8 characters.">
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </Field>
            <Field label="Confirm new password" htmlFor="confirm" required>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </Field>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Saving…" : "Save password"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <a href="/auth/login" className="font-medium text-primary hover:text-primary-hover">
                Back to sign in
              </a>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
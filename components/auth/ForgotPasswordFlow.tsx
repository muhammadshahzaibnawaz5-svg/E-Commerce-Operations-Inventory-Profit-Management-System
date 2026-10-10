"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/controls";
import { Alert } from "@/components/ui/Alert";
import { IconMail } from "@/components/ui/icons";
import { createOtpSession, verifyOtp } from "@/lib/auth";
import type { OtpSession } from "@/lib/types";

type Step = "email" | "otp";

const OTP_EXPIRY = 30;

export function ForgotPasswordFlow() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [session, setSession] = useState<OtpSession | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  function requestCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const s = createOtpSession(email);
    setSession(s);
    setStep("otp");
    setCountdown(OTP_EXPIRY);
    setMessage("If this email exists, a code was sent. The mock code is 123456.");
  }

  function handleResend() {
    const s = createOtpSession(email);
    setSession(s);
    setCountdown(OTP_EXPIRY);
    setMessage("A new code was sent. The mock code is 123456.");
  }

  function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) {
      setError("Code is required");
      return;
    }
    if (verifyOtp(otp.trim(), session)) {
      window.location.href = "/auth/reset-password?email=" + encodeURIComponent(email);
    } else {
      setError("That code is incorrect or has expired. Request a new one.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email and we will send you a one-time code."
            : "Enter the one-time code sent to your email."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" ? (
          <form onSubmit={requestCode} className="flex flex-col gap-4" noValidate>
            {error && <Alert variant="destructive" title="Check the form">{error}</Alert>}
            <Field label="Email" htmlFor="email" required>
              <div className="relative">
                <IconMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={16} height={16} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="pl-9"
                />
              </div>
            </Field>
            <Button type="submit" size="lg">
              Send code
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <a href="/auth/login" className="font-medium text-primary hover:text-primary-hover">
                Back to sign in
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-4" noValidate>
            {message && <Alert variant="info" title="Code sent">{message}</Alert>}
            {error && <Alert variant="destructive" title="Invalid code">{error}</Alert>}
            <Field label="One-time code" htmlFor="otp" hint="6-digit code, single-use.">
              <Input
                id="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="font-mono tracking-widest"
                maxLength={6}
              />
            </Field>
            <Button type="submit" size="lg">
              Verify and continue
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Didn't get a code?"}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className="cursor-pointer font-medium text-primary hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Resend
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
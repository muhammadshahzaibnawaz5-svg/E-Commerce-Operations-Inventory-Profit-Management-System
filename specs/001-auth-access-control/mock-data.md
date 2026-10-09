# Mock Data & Screen Inventory: Authentication & Access Control

**Feature**: `001-auth-access-control`
**Purpose**: Define the routes, components, their UI states, and the typed mock shapes that drive them. No backend or database exists this phase.

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/` | `app/page.tsx` | Redirects to `/auth/login` | — |
| `/auth/login` | `app/auth/login/page.tsx` | Sign in | default, error, success |
| `/auth/signup` | `app/auth/signup/page.tsx` | Create account | default, validation-error, success |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Request reset / enter OTP | default, code-sent, invalid-otp, resend-countdown |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Set new password | default, mismatch-error, success |
| `/auth/roles` | `app/auth/roles/page.tsx` | Roles reference | populated |

Shared: `components/shell/AppShell.tsx`, `Sidebar.tsx`, `Header.tsx`; `components/ui/{Button,Input,Card,Alert,Badge}.tsx`.

## UI States

- **default** — form rendered with empty fields and no messages.
- **loading** — simulated brief "Checking…" state on submit (button disabled).
- **error** — inline message above or below the offending field.
- **success** — confirmation banner (e.g. "Code sent", "Password updated") and next-step navigation.

## Mock Data Shapes (`frontend/lib/types.ts` + `frontend/lib/data/`)

### User
```ts
export type RoleName =
  | "Owner / Admin" | "Manager" | "Inventory" | "Order Processing" | "Finance";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // mock only
  role: RoleName;
  status: "active" | "disabled";
}
```

### data/users.ts
```ts
export const users: User[] = [
  { id: "u_001", fullName: "Ayesha Khan", email: "owner@example.com",     password: "demo1234", role: "Owner / Admin",    status: "active" },
  { id: "u_002", fullName: "Bilal Ahmed", email: "manager@example.com",   password: "demo1234", role: "Manager",          status: "active" },
  { id: "u_003", fullName: "Sana Iqbal",  email: "inventory@example.com", password: "demo1234", role: "Inventory",        status: "active" },
  { id: "u_004", fullName: "Omar Farooq", email: "orders@example.com",    password: "demo1234", role: "Order Processing", status: "active" },
  { id: "u_005", fullName: "Hina Raza",   email: "finance@example.com",   password: "demo1234", role: "Finance",          status: "active" },
];
```

### Role
```ts
export interface Role { name: RoleName; description: string; }
```
```ts
export const roles: Role[] = [
  { name: "Owner / Admin",    description: "Full access; assigns roles; manages store connection." },
  { name: "Manager",          description: "Operational oversight across modules." },
  { name: "Inventory",        description: "Raw materials, packaging, production, finished stock." },
  { name: "Order Processing", description: "Order lifecycle, packing, shipping, returns handling." },
  { name: "Finance",          description: "Payments, expenses, settlements, profit & loss." },
];
```

### OtpSession (mock only)
```ts
export interface OtpSession {
  email: string;
  code: string;            // "123456"
  issuedAt: string;
  expiresInSeconds: number;
  verified: boolean;
}
```

### RoleModuleAccess
```ts
export const roleModuleAccess: Record<RoleName, string[]> = {
  "Owner / Admin":    ["dashboard", "orders", "payments", "returns", "inventory", "marketing", "expenses", "settings"],
  "Manager":          ["dashboard", "orders", "payments", "returns", "inventory", "marketing", "expenses"],
  "Inventory":        ["inventory"],
  "Order Processing": ["orders", "returns"],
  "Finance":          ["payments", "expenses", "dashboard"],
};
```

## Notes

- Passwords are stored in plain mock text **only** to simulate login; this is a prototype and exposes no real data.
- OTP `123456` is the only accepted code; the resend countdown starts at 30 seconds.
- Role→module mapping is provisional pending Specifications §9 item 1.

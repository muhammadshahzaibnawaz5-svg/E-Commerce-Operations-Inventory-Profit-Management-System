import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { roles, roleModuleAccess } from "@/lib/data/roles";

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  payments: "Payments",
  returns: "Returns",
  inventory: "Inventory",
  suppliers: "Suppliers",
  marketing: "Advertising",
  expenses: "Expenses",
  settings: "Settings",
};

export default function RolesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Roles & permissions"
        description="The intended responsibilities for each staff role. The final list is pending client confirmation."
      />

      <Alert variant="info" title="Pending confirmation">
        The role list and per-role permissions are not yet confirmed with the client
        (Specifications §9, item 1). This reference is provisional.
      </Alert>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{role.name}</CardTitle>
                <Badge variant="primary">{roleModuleAccess[role.name].length} modules</Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Modules
              </p>
              <div className="flex flex-wrap gap-2">
                {roleModuleAccess[role.name].map((m) => (
                  <Badge key={m} variant="neutral">
                    {moduleLabels[m] ?? m}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
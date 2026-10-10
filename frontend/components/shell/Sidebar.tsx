"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/session";
import { roleModuleAccess } from "@/lib/data/roles";
import { allModuleKeys, navGroups } from "@/components/shell/nav";
import { Brand } from "@/components/shell/Brand";
import { IconX } from "@/components/ui/icons";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useSession();
  const allowed = user ? roleModuleAccess[user.role] : allModuleKeys;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Brand />
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <IconX />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2" aria-label="Main navigation">
          {navGroups.map((group) => {
            const items = group.items.filter((i) => allowed.includes(i.moduleKey));
            if (items.length === 0) return null;
            return (
              <div key={group.title}>
                <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <item.icon width={18} height={18} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {user && allowed.length < allModuleKeys.length && (
          <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            Modules outside the{" "}
            <span className="font-medium text-foreground">{user.role}</span> role are hidden.
            [NEEDS CLARIFICATION] Final role permissions are pending confirmation (Specifications §9,
            item 1).
          </div>
        )}

        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Markup prototype — no live data
        </div>
      </aside>
    </>
  );
}
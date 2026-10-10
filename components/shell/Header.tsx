"use client";

import { useSession } from "@/lib/session";
import { stores } from "@/lib/data/stores";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconLogOut, IconMenu } from "@/components/ui/icons";

interface HeaderProps {
  onMenu: () => void;
}

export function Header({ onMenu }: HeaderProps) {
  const { user, signOut } = useSession();
  const store = stores[0];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <IconMenu />
        </button>
        {store && (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-muted-foreground">{store.name}</span>
            <Badge variant="success">{store.connectionStatus}</Badge>
          </div>
        )}
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <Button variant="outline" size="sm" onClick={signOut} aria-label="Sign out">
            <IconLogOut width={16} height={16} />
            <span className="hidden md:inline">Sign out</span>
          </Button>
        </div>
      ) : (
        <Badge variant="warning">Not signed in</Badge>
      )}
    </header>
  );
}
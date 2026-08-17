import { Link } from "@tanstack/react-router";
import { Menu, Search, PlusCircle, Home, PackageSearch, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse", icon: PackageSearch },
  { to: "/report", label: "Report", icon: PlusCircle },
  { to: "/admin", label: "Admin", icon: Shield },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">
              UG
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">Lost &amp; Found</span>
              <span className="block text-[11px] opacity-70">University of Ghana</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm font-medium opacity-90 transition hover:bg-primary-foreground/10 hover:opacity-100"
                activeProps={{ className: "bg-primary-foreground/15 opacity-100" }}
              >
                {n.label}
              </Link>
            ))}
            <Button asChild variant="secondary" size="sm" className="ml-2">
              <Link to="/report">Report an item</Link>
            </Button>
          </nav>

          <div className="ml-auto flex items-center gap-1 md:hidden">
            <Button asChild size="icon" variant="ghost" className="hover:bg-primary-foreground/10">
              <Link to="/browse" aria-label="Search items">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="hover:bg-primary-foreground/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="mt-8 flex flex-col gap-1">
                  {nav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <n.icon className="h-4 w-4 text-muted-foreground" />
                      {n.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="hidden border-t border-border bg-muted/40 py-8 md:block">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          University of Ghana Lost &amp; Found — verified students and staff only. Never share
          identifying details publicly.
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card md:hidden">
        <div className="grid grid-cols-4">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

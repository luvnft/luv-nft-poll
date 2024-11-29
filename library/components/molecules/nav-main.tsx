import Link from "next/link";

import { cn } from "@/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/trust"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        TRUST
      </Link>
      <Link
        href="/collectables"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        COLLECTABLES
      </Link>
    </nav>
  );
}

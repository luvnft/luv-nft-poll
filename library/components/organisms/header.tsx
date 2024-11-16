import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";
import { ConnectKitButton } from "connectkit";

import NavGroup from "@/components/molecules/nav-group";
import { cn } from "@/utils";

const Header = ({ className }: { className?: string }) => {
  const segments = useSelectedLayoutSegments();

  const navs = useMemo(
    () => [
      {
        title: "Home",
        value: "home",
        href: "/",
        isActive: segments.length === 0,
      },
      {
        title: "Collectives",
        value: "collectives",
        href: "/collectives",
        isActive: segments.includes("collectives"),
      },
      {
        title: "Recipients",
        value: "recipients",
        href: "/recipients",
        isActive: segments.includes("recipients"),
      },
      {
        title: "Collectors",
        value: "collectors",
        href: "/collectors",
        isActive: segments.includes("collectors"),
      },
    ],
    [segments]
  );

  return (
    <header
      className={cn(
        "grid grid-cols-[auto_1fr_auto] sm:grid-cols-3 items-center py-2 px-4 sm:py-4 gap-y-4 min-h-[70px] bg-transparent",
        className
      )}
    >
      <div className="flex items-center">
        <Image
          alt="capyflows logo"
          src="/capyflows-logo.png"
          width={48}
          height={48}
          className="animate-[spin_12s_linear_infinite]"
        />
      </div>

      <NavGroup
        className="col-span-3 sm:col-span-1 order-last sm:order-none flex justify-center gap-2 sm:gap-4"
        navs={navs}
      />

      <div className="flex justify-end">
        <ConnectKitButton />
      </div>
    </header>
  );
};

export default Header;

import Image from "next/image";
import Link from "next/link";

import { UserNav } from "@/components/molecules/nav-user";
import { cn } from "@/utils";

const Header = ({ className }: { className?: string }) => {
  return (
    <header className={cn("border-b", className)}>
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center">
          <Link href={"/"}>
            <Image
              alt="capyflows logo"
              src="/capyflows-logo.png"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default Header;

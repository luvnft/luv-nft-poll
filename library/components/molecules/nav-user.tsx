"use client";

import { Squircle } from "corner-smoothing";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal
} from "@burnt-labs/abstraxion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useMounted } from "@/hooks/use-mounted";
import { ellipsisAddress } from "@/utils";
import { useCallback } from "react";

export function UserNav() {
  const { data: account } = useAbstraxionAccount();
  const [showAbstraxion, setShowAbstraxion] = useModal();
  const isMounted = useMounted();

  if (!isMounted) return null;

  if (!account?.bech32Address) {
    return (
      <>
        <Squircle cornerRadius={20} cornerSmoothing={1}>
          <button
            onClick={() => setShowAbstraxion(true)}
            className="bg-[#33CB82] hover:bg-[#33CB82]/80 font-medium px-6 rounded-[0] py-4 transition-colors duration-200"
          >
            Connect Wallet
          </button>
        </Squircle>
        <Abstraxion
          onClose={() => {
            setShowAbstraxion(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Squircle cornerRadius={20} cornerSmoothing={1}>
            <button className="bg-[#33CB82] hover:bg-[#33CB82]/80 font-medium px-6 rounded-[0] py-4 transition-colors duration-200">
              {`${account.bech32Address.slice(0, 6)}...${account.bech32Address.slice(-4)}`}
            </button>
          </Squircle>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Connected</p>
              <p className="text-xs leading-none text-muted-foreground">
                Xion Network
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem onClick={() => setShowAbstraxion(true)}> */}
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowAbstraxion(false)}>
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Abstraxion
        onClose={() => {
          setShowAbstraxion(false);
        }}
      />
    </>
  );
}

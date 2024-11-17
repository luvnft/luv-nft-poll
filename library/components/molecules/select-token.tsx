import { Coins } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/atoms/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/atoms/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Token } from "@/types";

interface TokenSelectProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
}

const TokenSelect = React.memo(
  ({ tokens = [], selectedToken, onSelectToken }: TokenSelectProps) => {
    const [open, setOpen] = useState(false);

    const handleSelectToken = useCallback(
      (token: Token) => {
        onSelectToken(token);
        setOpen(false);
      },
      [onSelectToken]
    );

    const memoizedTokens = useMemo(() => tokens || [], [tokens]);

    return (
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button role="combobox" aria-expanded={open}>
            {selectedToken ? (
              <>
                <Coins className="mr-2 h-4 w-4" />
                {selectedToken.symbol}
              </>
            ) : (
              <>Select token</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white">
          <Command>
            <CommandInput placeholder="Search token..." />
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {memoizedTokens.map((token) => (
                  <CommandItem
                    key={token.symbol}
                    onSelect={() => handleSelectToken(token)}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    {token.symbol}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

TokenSelect.displayName = "TokenSelect";

export default TokenSelect;

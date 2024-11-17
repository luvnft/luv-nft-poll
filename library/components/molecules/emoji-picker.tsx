"use client";

import { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import Emoji from "@/components/atoms/emoji";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "../atoms/button";

const _EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const EmojiPicker = ({
  emojiPickerContainerRef,
  setSelectedEmoji,
}: {
  emojiPickerContainerRef: React.RefObject<HTMLElement>;
  setSelectedEmoji: React.Dispatch<Partial<string>>;
}) => {
  const [selectedEmoji, _setSelectedEmoji] = useState<string>("1f60a");
  useEffect(() => {
    // initialize setSelected with default emoji
    setSelectedEmoji(selectedEmoji);
  }, []);

  function onClick(emojiData: EmojiClickData, event: MouseEvent) {
    setSelectedEmoji(emojiData.unified);
    _setSelectedEmoji(emojiData.unified);
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {selectedEmoji ? (
          <Button
            className="border-[1px] shadow-none border-dashed rounded-[5px] py-[2px] px-2 text-2xl font-emoji text-text-slatePlaceholder"
            aria-label="Choose emoji"
          >
            <Emoji emoji={selectedEmoji} />
          </Button>
        ) : (
          <Button
            className="border-[1px] shadow-none border-dashed rounded-[5px] py-[2px] px-2 text-2xl font-emoji text-text-slatePlaceholder"
            aria-label="Choose emoji"
          >
            😊
          </Button>
        )}
      </Popover.Trigger>
      <Popover.Portal container={emojiPickerContainerRef.current}>
        <Popover.Content className="p-2" sideOffset={5}>
          <_EmojiPicker
            onEmojiClick={onClick}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.NATIVE}
          />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default EmojiPicker;

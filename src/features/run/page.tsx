import { useState, type ChangeEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AttachmentIcon,
  TimeSetting03Icon,
  WaveIcon,
  ArrowUp02Icon,
  PanelRightCloseIcon,
} from "@hugeicons/core-free-icons";
import { LogoMark } from "@v-ems/element/brand";
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Separator,
} from "@v-ems/element";

import { sessions } from "@/data/sessions";

const voices = [
  { value: "aurora", label: "Aurora" },
  { value: "nova", label: "Nova" },
  { value: "echo", label: "Echo" },
];

export function RunPage() {
  const [message, setMessage] = useState("");
  const [voice, setVoice] = useState("aurora");
  const [historyOpen, setHistoryOpen] = useState(false);
  const hasMessage = message.trim().length > 0;

  return (
    <>
      <div className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border bg-card px-6 pb-24">
        <div
          className={`absolute right-6 top-4 flex items-center gap-6 transition-opacity duration-300 ease-out ${
            historyOpen
              ? "pointer-events-none opacity-0"
              : "animate-in fade-in-0 slide-in-from-top-1 duration-500 opacity-100"
          }`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="History"
            aria-pressed={historyOpen}
            onClick={() => setHistoryOpen((v) => !v)}
            className={`size-8 [&_svg]:size-[20px]! hover:bg-transparent hover:text-foreground ${
              historyOpen ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <HugeiconsIcon icon={TimeSetting03Icon} strokeWidth={2} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                aria-label="Voice"
                className="size-8 text-muted-foreground [&_svg]:size-[20px]! hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-foreground"
              >
                <HugeiconsIcon icon={WaveIcon} strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-56"
            >
              <DropdownMenuLabel>Voice Agent</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={voice} onValueChange={setVoice}>
                {voices.map((v) => (
                  <DropdownMenuRadioItem key={v.value} value={v.value}>
                    {v.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex w-full max-w-3xl flex-col items-center gap-18">
          <div className="animate-in fade-in-0 zoom-in-95 duration-700 ease-out">
            <LogoMark size={85} className="text-primary" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!hasMessage) return;
              setMessage("");
            }}
            className="group flex w-full items-center gap-2 rounded-full bg-muted/75 px-2 py-2 transition-colors focus-within:border-foreground/20 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-150 ease-out fill-mode-backwards"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Attach file"
              className="size-10 [&_svg]:!size-5"
            >
              <HugeiconsIcon
                icon={AttachmentIcon}
                strokeWidth={2}
                className="text-muted-foreground"
              />
            </Button>
            <Input
              value={message}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
              placeholder="Type Your Message"
              className="h-9 flex-1 border-0 bg-transparent p-2.5 text-base shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 dark:bg-transparent"
            />
            <Button
              type="submit"
              variant="default"
              size="icon-lg"
              aria-label={hasMessage ? "Send message" : "Voice input"}
              className="size-10 [&_svg]:size-5!"
            >
              <span
                key={hasMessage ? "send" : "voice"}
                className="flex items-center justify-center animate-in fade-in-0 zoom-in-50 duration-200 ease-out"
              >
                <HugeiconsIcon
                  icon={hasMessage ? ArrowUp02Icon : WaveIcon}
                  strokeWidth={2.25}
                />
              </span>
            </Button>
          </form>
        </div>
      </div>

      <div
        aria-hidden={!historyOpen}
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          historyOpen ? "ml-2 w-[30%]" : "ml-0 w-0"
        }`}
      >
        <div className="flex h-full w-full min-w-[300px] flex-col rounded-lg border bg-card">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2.5 text-foreground">
              <HugeiconsIcon
                icon={TimeSetting03Icon}
                className="size-5 text-primary"
                strokeWidth={2}
              />
              <h2 className="text-base font-medium">Sessions</h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Close history"
              onClick={() => setHistoryOpen(false)}
              className="size-8 text-muted-foreground [&_svg]:size-[20px]! hover:bg-transparent hover:text-foreground"
            >
              <HugeiconsIcon icon={PanelRightCloseIcon} strokeWidth={2} />
            </Button>
          </div>
          <Separator />
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="flex flex-col gap-1 p-4 px-6 text-left outline-none transition-colors hover:bg-muted"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-foreground">
                      {s.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {s.time}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground/75">
                    {s.preview}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

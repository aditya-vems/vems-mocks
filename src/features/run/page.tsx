import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AttachmentIcon,
  TimeSetting03Icon,
  WaveIcon,
  ArrowUp02Icon,
  PanelRightCloseIcon,
  File02Icon,
  Image02Icon,
  Copy01Icon,
  Tick02Icon,
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

import {
  sessions as initialSessions,
  type ChatMessage,
  type Session,
} from "@/data/sessions";
import { Markdown } from "./markdown";
import { generateReply, makeSessionTitle, formatTime } from "./fake-ai";

const voices = [
  { value: "aurora", label: "Aurora" },
  { value: "nova", label: "Nova" },
  { value: "echo", label: "Echo" },
];

function makeId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function RunPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [voice, setVoice] = useState("aurora");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyListVisible, setHistoryListVisible] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const activeSession = activeSessionId
    ? sessions.find((s) => s.id === activeSessionId) ?? null
    : null;
  const chatActive = activeSession !== null;
  const messages = activeSession?.messages ?? [];
  const hasMessage = message.trim().length > 0;

  useEffect(() => {
    if (historyOpen) {
      const t = setTimeout(() => setHistoryListVisible(true), 450);
      return () => clearTimeout(t);
    }
    setHistoryListVisible(false);
  }, [historyOpen]);

  const lastContentLen =
    messages.length > 0 ? messages[messages.length - 1].content.length : 0;

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, lastContentLen, activeSessionId, isThinking]);

  const appendMessage = (sessionId: string, msg: ChatMessage) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: [...s.messages, msg],
              preview: msg.content.slice(0, 140).replace(/\n+/g, " "),
              time: `Today ${formatTime()}`,
            }
          : s,
      ),
    );
  };

  const patchMessage = (
    sessionId: string,
    messageId: string,
    patch: Partial<ChatMessage>,
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId ? { ...m, ...patch } : m,
              ),
              preview:
                patch.content !== undefined
                  ? patch.content.slice(0, 140).replace(/\n+/g, " ")
                  : s.preview,
            }
          : s,
      ),
    );
  };

  const streamReply = (sessionId: string, fullContent: string) => {
    const replyId = makeId();
    const replyMsg: ChatMessage = {
      id: replyId,
      role: "agent",
      content: "",
      timestamp: formatTime(),
      streaming: true,
    };
    appendMessage(sessionId, replyMsg);
    setIsThinking(false);

    const tokens = fullContent.match(/\s+|\S+/g) ?? [];
    let i = 0;
    let current = "";

    const tick = () => {
      if (i >= tokens.length) {
        patchMessage(sessionId, replyId, { streaming: false });
        return;
      }
      const burst = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < burst && i < tokens.length; k++) {
        current += tokens[i];
        i++;
      }
      patchMessage(sessionId, replyId, { content: current });
      const base = 32;
      const jitter = Math.random() * 45;
      const punctuationPause = /[.!?\n]\s*$/.test(current) ? 140 : 0;
      setTimeout(tick, base + jitter + punctuationPause);
    };

    setTimeout(tick, 40);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
      timestamp: formatTime(),
    };

    let sessionId = activeSessionId;
    if (!sessionId) {
      const newSession: Session = {
        id: `s-${Date.now()}`,
        title: makeSessionTitle(text),
        time: `Today ${formatTime()}`,
        preview: text.slice(0, 140),
        messages: [userMsg],
      };
      sessionId = newSession.id;
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(sessionId);
    } else {
      appendMessage(sessionId, userMsg);
    }

    setMessage("");
    setIsThinking(true);

    const replySessionId = sessionId;
    const thinkDelay = 1100 + Math.random() * 1200;
    const fullContent = generateReply(text);
    setTimeout(() => {
      streamReply(replySessionId, fullContent);
    }, thinkDelay);
  };

  const selectSession = (id: string) => {
    setActiveSessionId(id);
  };

  return (
    <>
      <div className="relative flex h-full flex-1 flex-col overflow-hidden rounded-lg border bg-card">
        <div
          className={`absolute right-6 top-4 z-10 flex items-center gap-6 transition-opacity duration-300 ease-out ${
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
            <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
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

        <div
          className={`grid h-full w-full px-6 pb-6 transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            chatActive
              ? "grid-rows-[1fr_0fr_auto_0fr]"
              : "grid-rows-[1fr_auto_auto_1fr]"
          }`}
        >
          <div
            ref={chatScrollRef}
            className="min-h-0 w-full overflow-y-auto"
          >
            {chatActive && (
              <div
                key={activeSessionId}
                className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-2 py-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-out"
              >
                {messages.map((msg) => (
                  <MessageView key={msg.id} message={msg} />
                ))}
                {isThinking && <ThinkingIndicator />}
              </div>
            )}
          </div>

          <div
            className={`flex items-center justify-center overflow-hidden transition-opacity duration-300 ${
              chatActive ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="animate-in fade-in-0 zoom-in-95 duration-700 ease-out py-4">
              <LogoMark size={85} className="text-primary" />
            </div>
          </div>

          <div className="flex items-center justify-center pt-4">
            <form
              onSubmit={handleSubmit}
              className="group flex w-full max-w-3xl items-center gap-2 rounded-full bg-muted/75 px-2 py-2 transition-colors focus-within:border-foreground/20 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-150 ease-out fill-mode-backwards"
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

          <div />
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
            <div
              className={`flex flex-col transition-opacity duration-500 ease-out ${
                historyListVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSession(s.id)}
                    className={`flex flex-col gap-1 p-4 px-6 text-left outline-none transition-colors hover:bg-muted ${
                      isActive ? "bg-muted" : ""
                    }`}
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageView({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-[22px] bg-muted px-4 py-2.5 text-foreground animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out">
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <AttachmentsGrid attachments={message.attachments} compact />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-full animate-in fade-in-0 slide-in-from-bottom-1 duration-300 ease-out">
        <div className="relative">
          <Markdown>{message.content}</Markdown>
          {message.streaming && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[0.05em] animate-pulse bg-foreground align-middle"
            />
          )}
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <AttachmentsGrid attachments={message.attachments} />
        )}
        {!message.streaming && (
          <div className="mt-2 animate-in fade-in-0 duration-300 ease-out">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy message"}
      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span
        key={copied ? "tick" : "copy"}
        className="flex items-center justify-center animate-in fade-in-0 zoom-in-75 duration-200 ease-out"
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          strokeWidth={2}
          className="size-4"
        />
      </span>
    </button>
  );
}

function AttachmentsGrid({
  attachments,
  compact = false,
}: {
  attachments: NonNullable<ChatMessage["attachments"]>;
  compact?: boolean;
}) {
  const images = attachments.filter((a) => a.kind === "image");
  const files = attachments.filter((a) => a.kind === "file");
  return (
    <div className={`flex flex-col gap-2 ${compact ? "mt-2" : "mt-3"}`}>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-lg border bg-muted"
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.name}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center text-muted-foreground">
                  <HugeiconsIcon icon={Image02Icon} strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <HugeiconsIcon icon={File02Icon} strokeWidth={2} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </span>
                {file.size && (
                  <span className="text-xs text-muted-foreground">
                    {file.size}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
    </div>
  );
}

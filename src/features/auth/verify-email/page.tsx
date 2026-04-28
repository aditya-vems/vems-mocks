import { Button } from "@v-ems/element";
import { HugeiconsIcon } from "@hugeicons/react";
import { InboxIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@iconify/react";
import googleGmail from "@iconify-icons/logos/google-gmail";
import microsoftOutlook from "@iconify-icons/vscode-icons/file-type-outlook";
import { Fragment, useRef, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { AuthLayout } from "@/features/auth/auth-layout";

const OTP_LENGTH = 6;

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "";
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  if (!email) {
    return <Navigate to="/sign-in" replace />;
  }

  function focusBox(index: number) {
    const next = inputs.current[index];
    if (next) {
      next.focus();
      next.select();
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    e.target.value = value;
    if (value && index < OTP_LENGTH - 1) {
      focusBox(index + 1);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      focusBox(index - 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    pasted.split("").forEach((char, i) => {
      const box = inputs.current[i];
      if (box) box.value = char;
    });
    focusBox(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-8 max-w-[640px] w-full px-6 sm:px-0 text-center">
        <div
          className="flex items-center justify-center animate-in fade-in-0 zoom-in-95 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "80ms" }}
        >
          <HugeiconsIcon
            icon={InboxIcon}
            size={56}
            strokeWidth={1.5}
            className="text-muted-foreground/75"
          />
        </div>
        <div
          className="flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "160ms" }}
        >
          <h1 className="text-lg font-bold">Verify Your Email</h1>
          <p className="text-base text-muted-foreground/50">
            A verification link has been sent to{" "}
            <span className="text-foreground">{email}</span>.
            <br />
            Please check your inbox to continue.
          </p>
        </div>
        <div
          className="flex w-full max-w-[420px] overflow-hidden rounded-lg border border-border animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "240ms" }}
          onPaste={handlePaste}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <Fragment key={i}>
              {i > 0 ? (
                <div aria-hidden className="w-px bg-border" />
              ) : null}
              <input
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onFocus={(e) => e.currentTarget.select()}
                className="h-14 flex-1 min-w-0 border-0 bg-transparent text-center text-xl text-foreground outline-none transition-colors duration-200 ease-out focus-visible:bg-foreground/5 focus-visible:ring-0"
              />
            </Fragment>
          ))}
        </div>
        <div
          className="flex w-full justify-center flex-col sm:flex-row items-center gap-3 sm:gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "320ms" }}
        >
          <Button
            type="button"
            variant="secondary"
            className="h-11 px-4 max-w-48 w-full rounded-full"
            onClick={() => {
              window.open("https://mail.google.com/", "_blank", "noopener");
            }}
          >
            <Icon icon={googleGmail} className="size-5" />
            Gmail
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 px-4 max-w-48 w-full rounded-full"
            onClick={() => {
              window.open("https://outlook.live.com/", "_blank", "noopener");
            }}
          >
            <Icon icon={microsoftOutlook} className="size-5" />
            Outlook
          </Button>
        </div>
        <p
          className="text-base text-muted-foreground/50 animate-in fade-in-0 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "400ms" }}
        >
          If you don&rsquo;t see the email, check your spam folder.
          <br />
          Wrong email address?{" "}
          <button
            type="button"
            onClick={() => navigate("/sign-in")}
            className="text-primary transition-colors duration-200 ease-out hover:text-primary/80"
          >
            Update it
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

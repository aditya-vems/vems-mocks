import {
  Button,
  FieldError,
  FieldGroup,
  Input,
  Label,
  Separator,
} from "@v-ems/element";
import { LogoLine } from "@v-ems/element/brand";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const WEBSITE_URL = "http://localhost:5173/";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      width={22}
      height={22}
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  function handleEmailSignIn() {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    navigate("/home");
  }

  return (
    <div className="dark relative h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 18%, transparent) 0%, color-mix(in oklch, var(--primary) 6%, transparent) 25%, transparent 60%)",
        }}
      />
      <div className="relative flex h-full flex-col">
        <header className="w-full pt-10 pb-4 flex justify-center items-center animate-in fade-in-0 duration-500 ease-out fill-mode-both">
          <LogoLine className="[&>path]:text-primary" />
        </header>
        <main className="relative w-full flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col justify-center items-center py-8">
            <div className="flex flex-col gap-8 max-w-[520px] w-full px-6 sm:px-0">
                <FieldGroup className="gap-4">
                  <div className="flex flex-col gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out delay-[80ms] fill-mode-both">
                    <div className="relative pt-5">
                      <Input
                        id="email"
                        type="email"
                        placeholder=" "
                        value={email}
                        aria-invalid={emailError !== null}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError(null);
                        }}
                        className="peer h-11 rounded-none border-0 border-b border-border bg-transparent dark:bg-transparent px-0 text-base shadow-none placeholder:text-transparent transition-colors duration-300 ease-out focus-visible:border-foreground focus-visible:ring-0 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:ring-0 dark:aria-invalid:ring-0"
                      />
                      <Label
                        htmlFor="email"
                        className="pointer-events-none absolute left-0 top-0 text-xs text-muted-foreground transition-all duration-300 ease-out peer-placeholder-shown:top-7.5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-foreground peer-aria-invalid:text-destructive"
                      >
                        Email
                      </Label>
                    </div>
                    <FieldError
                      className={`transition-opacity duration-200 ease-out ${emailError ? "opacity-100" : "opacity-0"}`}
                    >
                      {emailError ?? " "}
                    </FieldError>
                  </div>
                  <Button
                    type="button"
                    className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out delay-[160ms] fill-mode-both"
                    onClick={handleEmailSignIn}
                  >
                    Sign In with Email
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-11 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out delay-[240ms] fill-mode-both"
                    onClick={() => navigate("/home")}
                  >
                    Sign In with Passkey
                  </Button>
                </FieldGroup>
                <div className="flex w-full items-center gap-4 animate-in fade-in-0 duration-500 ease-out delay-[320ms] fill-mode-both">
                  <Separator className="flex-1" />
                  <span className="text-xs tracking-widest text-muted-foreground">
                    OR
                  </span>
                  <Separator className="flex-1" />
                </div>
                <FieldGroup className="gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-11 relative animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out delay-[400ms] fill-mode-both"
                    onClick={() => navigate("/home")}
                  >
                    Continue with Google
                    <GoogleMark className="absolute right-4 top-1/2 -translate-y-1/2" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-11 relative animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out delay-[480ms] fill-mode-both"
                    onClick={() => navigate("/home")}
                  >
                    Continue with SAML
                    <HugeiconsIcon
                      icon={LockIcon}
                      size={22}
                      strokeWidth={1.75}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </Button>
                </FieldGroup>
                <p className="text-center text-muted-foreground/50 animate-in fade-in-0 duration-500 ease-out delay-[560ms] fill-mode-both">
                  New here?{" "}
                  <a
                    href={WEBSITE_URL}
                    className="text-foreground transition-colors duration-200 ease-out hover:text-primary"
                  >
                    Explore VEMS!
                  </a>
                </p>
              </div>
            </div>
        </main>
        <footer className="w-full py-4 flex justify-center items-center gap-6 text-sm animate-in fade-in-0 duration-500 ease-out delay-[640ms] fill-mode-both">
          <span className="text-muted-foreground/50">
            © 2026 VEMS. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}

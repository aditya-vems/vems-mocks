import { Button, FieldGroup, FloatingField, Separator, Spinner } from "@v-ems/element";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/features/auth/auth-layout";

const WEBSITE_URL = "http://localhost:5173/";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`size-5 ${className ?? ""}`}
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleEmailSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      navigate("/verify-email", { state: { email } });
    }, 1500);
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleEmailSignIn}
        className="flex flex-col gap-8 max-w-[520px] w-full px-6 sm:px-0"
      >
        <FieldGroup className="gap-4">
          <FloatingField
            id="email"
            type="email"
            label="Email"
            value={email}
            error={emailError}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
            style={{ animationDelay: "80ms" }}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full h-11 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-100 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
            style={{ animationDelay: "160ms" }}
          >
            <span
              className={`transition-all duration-200 ease-out ${isSubmitting ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
            >
              Sign In with Email
            </span>
            <span
              aria-hidden
              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${isSubmitting ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"}`}
            >
              <Spinner className="size-5" />
            </span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full h-11 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
            style={{ animationDelay: "240ms" }}
            onClick={() => navigate("/home")}
          >
            Sign In with Passkey
          </Button>
        </FieldGroup>
        <div
          className="flex w-full items-center gap-4 animate-in fade-in-0 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "320ms" }}
        >
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
            className="w-full h-11 relative animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
            style={{ animationDelay: "400ms" }}
            onClick={() => navigate("/home")}
          >
            Continue with Google
            <GoogleMark className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full h-11 relative animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
            style={{ animationDelay: "480ms" }}
            onClick={() => navigate("/home")}
          >
            Continue with SAML
            <HugeiconsIcon
              icon={LockIcon}
              strokeWidth={1.75}
              className="size-5 absolute right-4 top-1/2 -translate-y-1/2"
            />
          </Button>
        </FieldGroup>
        <p
          className="text-center text-muted-foreground/50 animate-in fade-in-0 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "560ms" }}
        >
          New here?{" "}
          <a
            href={WEBSITE_URL}
            className="text-foreground transition-colors duration-200 ease-out hover:text-primary"
          >
            Explore VEMS!
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}

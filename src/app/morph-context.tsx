import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type MorphPhase = "expanding" | "arrived" | "fading";

type MorphState = {
  source: DOMRect;
  target: DOMRect;
  arrived: boolean;
  expanded: boolean;
  phase: MorphPhase;
};

type MorphContextValue = {
  startMorph: (
    source: DOMRect,
    target: DOMRect,
    onArrival?: () => void,
    onStart?: () => void,
  ) => void;
  isMorphing: boolean;
};

const MorphContext = createContext<MorphContextValue | null>(null);

const EXPAND_MS = 650;
const FADE_MS = 420;

export function MorphProvider({ children }: { children: ReactNode }) {
  const [morph, setMorph] = useState<MorphState | null>(null);
  const timersRef = useRef<number[]>([]);
  const arrivalRef = useRef<(() => void) | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const arrive = useCallback(() => {
    const fn = arrivalRef.current;
    arrivalRef.current = null;
    fn?.();
    setMorph((prev) =>
      prev ? { ...prev, arrived: true, phase: "fading" } : prev,
    );
    timersRef.current.push(
      window.setTimeout(() => {
        setMorph(null);
      }, FADE_MS),
    );
  }, []);

  const startMorph = useCallback(
    (
      source: DOMRect,
      target: DOMRect,
      onArrival?: () => void,
      onStart?: () => void,
    ) => {
      clearTimers();
      arrivalRef.current = onArrival ?? null;
      setMorph({
        phase: "expanding",
        source,
        target,
        arrived: false,
        expanded: false,
      });

      // One RAF so initial state paints before transitioning.
      requestAnimationFrame(() => {
        setMorph((prev) => (prev ? { ...prev, expanded: true } : prev));
        requestAnimationFrame(() => {
          onStart?.();
        });
      });
    },
    [clearTimers],
  );

  return (
    <MorphContext.Provider value={{ startMorph, isMorphing: morph !== null }}>
      {children}
      {morph
        ? createPortal(
            <div className="pointer-events-none fixed inset-0 z-50">
              <div
                className="absolute rounded-lg bg-card ring-1 ring-foreground/10 shadow-xl"
                onTransitionEnd={(e) => {
                  if (morph.arrived) return;
                  if (e.propertyName !== "height") return;
                  arrive();
                }}
                style={{
                  top: morph.expanded
                    ? morph.target.top
                    : morph.source.top,
                  left: morph.expanded
                    ? morph.target.left
                    : morph.source.left,
                  width: morph.expanded
                    ? morph.target.width
                    : morph.source.width,
                  height: morph.expanded
                    ? morph.target.height
                    : morph.source.height,
                  opacity: morph.phase === "fading" ? 0 : 1,
                  transition: [
                    `top ${EXPAND_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    `left ${EXPAND_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    `width ${EXPAND_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    `height ${EXPAND_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                    `opacity ${FADE_MS}ms ease-out`,
                  ].join(", "),
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </MorphContext.Provider>
  );
}

export function useMorph() {
  const ctx = useContext(MorphContext);
  if (!ctx) {
    throw new Error("useMorph must be used inside <MorphProvider>");
  }
  return ctx;
}

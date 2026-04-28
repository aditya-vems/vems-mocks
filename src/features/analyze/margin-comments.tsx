import { Avatar, AvatarFallback, AvatarImage, initials } from "@v-ems/element";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

type MarginComment = {
  id: string;
  user: string;
  time: string;
  text: string;
  resolved?: boolean;
  reference: string;
};

const comments: MarginComment[] = [
  {
    id: "c1",
    user: "Mira Reyes",
    time: "1h ago",
    reference: "Daily generation profile",
    text: "Worth flagging the 11:30 dip — passing cloud or genuine shading?",
  },
  {
    id: "c2",
    user: "Jaya Krishnan",
    time: "2h ago",
    reference: "Scenarios compared",
    text: "Should we run an ROI sweep on bifacial across roof albedos?",
  },
  {
    id: "c3",
    user: "Noah Lim",
    time: "Yesterday",
    reference: "Methodology",
    text: "Resolved — soiling rate matches the field calibration sheet.",
    resolved: true,
  },
];

function CommentCard({ comment }: { comment: MarginComment }) {
  return (
    <article className="rounded-lg border border-border/60 bg-card/80 p-3 backdrop-blur-sm transition-colors hover:border-border">
      <header className="flex items-center gap-2">
        <Avatar className="size-6 shrink-0">
          <AvatarImage
            src={`https://i.pravatar.cc/96?u=${encodeURIComponent(comment.user)}`}
            alt=""
          />
          <AvatarFallback className="bg-muted text-[10px] font-medium">
            {initials(comment.user)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-xs font-medium text-foreground">
            {comment.user}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {comment.time}
          </span>
        </div>
        <HugeiconsIcon
          icon={comment.resolved ? CheckmarkCircle02Icon : Comment01Icon}
          strokeWidth={2}
          className={`size-3.5 ${comment.resolved ? "text-emerald-500" : "text-muted-foreground/70"}`}
        />
      </header>
      <p
        className={`mt-2 text-xs leading-relaxed ${comment.resolved ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground"}`}
      >
        {comment.text}
      </p>
      <span className="mt-2 block text-[10px] uppercase tracking-wider text-muted-foreground/60">
        on {comment.reference}
      </span>
    </article>
  );
}

export function MarginComments() {
  const totalComments = comments.length;
  const openCount = comments.filter((c) => !c.resolved).length;

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-3 lg:flex">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Comments</span>
        <span className="tabular-nums text-muted-foreground/70">
          {openCount} open · {totalComments - openCount} resolved
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>
    </aside>
  );
}

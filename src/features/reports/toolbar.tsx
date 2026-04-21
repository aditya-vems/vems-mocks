import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuoteDownIcon,
  ArrowReloadHorizontalIcon,
  ArrowTurnBackwardIcon,
  ArrowTurnForwardIcon,
} from "@hugeicons/core-free-icons";
import type { Editor } from "@tiptap/react";
import { Button, Separator, Tooltip, TooltipContent, TooltipTrigger } from "@v-ems/element";
import type { HugeiconsIconProps } from "@hugeicons/react";

type ToolAction = {
  id: string;
  label: string;
  icon: HugeiconsIconProps["icon"];
  isActive?: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
};

const groups: ToolAction[][] = [
  [
    {
      id: "undo",
      label: "Undo",
      icon: ArrowTurnBackwardIcon,
      run: (e) => e.chain().focus().undo().run(),
    },
    {
      id: "redo",
      label: "Redo",
      icon: ArrowTurnForwardIcon,
      run: (e) => e.chain().focus().redo().run(),
    },
  ],
  [
    {
      id: "paragraph",
      label: "Paragraph",
      icon: TextIcon,
      isActive: (e) => e.isActive("paragraph"),
      run: (e) => e.chain().focus().setParagraph().run(),
    },
    {
      id: "h1",
      label: "Heading 1",
      icon: Heading01Icon,
      isActive: (e) => e.isActive("heading", { level: 1 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      id: "h2",
      label: "Heading 2",
      icon: Heading02Icon,
      isActive: (e) => e.isActive("heading", { level: 2 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      id: "h3",
      label: "Heading 3",
      icon: Heading03Icon,
      isActive: (e) => e.isActive("heading", { level: 3 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      id: "bold",
      label: "Bold",
      icon: TextBoldIcon,
      isActive: (e) => e.isActive("bold"),
      run: (e) => e.chain().focus().toggleBold().run(),
    },
    {
      id: "italic",
      label: "Italic",
      icon: TextItalicIcon,
      isActive: (e) => e.isActive("italic"),
      run: (e) => e.chain().focus().toggleItalic().run(),
    },
  ],
  [
    {
      id: "bullet",
      label: "Bullet list",
      icon: LeftToRightListBulletIcon,
      isActive: (e) => e.isActive("bulletList"),
      run: (e) => e.chain().focus().toggleBulletList().run(),
    },
    {
      id: "ordered",
      label: "Numbered list",
      icon: LeftToRightListNumberIcon,
      isActive: (e) => e.isActive("orderedList"),
      run: (e) => e.chain().focus().toggleOrderedList().run(),
    },
    {
      id: "quote",
      label: "Quote",
      icon: QuoteDownIcon,
      isActive: (e) => e.isActive("blockquote"),
      run: (e) => e.chain().focus().toggleBlockquote().run(),
    },
    {
      id: "rule",
      label: "Divider",
      icon: ArrowReloadHorizontalIcon,
      run: (e) => e.chain().focus().setHorizontalRule().run(),
    },
  ],
];

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background px-3 py-2">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1">
          {group.map((action) => {
            const active = action.isActive?.(editor) ?? false;
            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="icon"
                    aria-label={action.label}
                    aria-pressed={active}
                    onClick={() => action.run(editor)}
                  >
                    <HugeiconsIcon icon={action.icon} size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{action.label}</TooltipContent>
              </Tooltip>
            );
          })}
          {gi < groups.length - 1 ? <Separator orientation="vertical" className="mx-1 h-5" /> : null}
        </div>
      ))}
    </div>
  );
}

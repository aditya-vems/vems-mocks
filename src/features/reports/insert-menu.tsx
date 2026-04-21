import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  ChartLineData01Icon,
  MinusSignIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import type { Editor } from "@tiptap/react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@v-ems/element";
import { graphIds, graphs } from "@/shared/mock-data/graphs";

export function InsertMenu({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          <span className="ml-1.5">Insert</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Blocks</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertCallout({ tone: "info" })
              .run()
          }
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={14} />
          <span className="ml-2">Callout</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <HugeiconsIcon icon={MinusSignIcon} size={14} />
          <span className="ml-2">Divider</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Graphs</DropdownMenuLabel>
        {graphIds.map((id) => (
          <DropdownMenuItem
            key={id}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertGraph({ graphId: id, title: graphs[id].title, kind: "line" })
                .run()
            }
          >
            <HugeiconsIcon icon={ChartLineData01Icon} size={14} />
            <span className="ml-2 truncate">{graphs[id].title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

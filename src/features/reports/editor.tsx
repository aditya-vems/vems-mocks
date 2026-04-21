import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { GraphNode } from "./extensions/graph-node";
import { CalloutNode } from "./extensions/callout-node";
import { useReportsStore } from "./store";
import { EditorToolbar } from "./toolbar";
import { InsertMenu } from "./insert-menu";
import { Button, Separator, Badge } from "@v-ems/element";
import { toast } from "sonner";

export function ReportEditor() {
  const activeId = useReportsStore((s) => s.activeId);
  const report = useReportsStore((s) => s.reports.find((r) => r.id === s.activeId));
  const markSaved = useReportsStore((s) => s.markSaved);
  const savedAt = useReportsStore((s) => s.savedAt);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Start typing, or press Insert to add a graph or callout…",
        }),
        GraphNode,
        CalloutNode,
      ],
      content: report?.content,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm dark:prose-invert max-w-3xl min-h-[60vh] focus:outline-none [&_h1]:scroll-m-20 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold",
        },
      },
    },
    [activeId],
  );

  useEffect(() => {
    if (editor && report) {
      editor.commands.setContent(report.content, false);
    }
  }, [editor, report]);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <EditorToolbar editor={editor} />
      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <InsertMenu editor={editor} />
        <Separator orientation="vertical" className="h-5" />
        <div className="min-w-0 flex-1 truncate text-sm font-medium">{report?.title}</div>
        {savedAt ? (
          <Badge variant="secondary" className="text-[10px]">
            Saved {savedAt}
          </Badge>
        ) : null}
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            markSaved();
            toast.success("Report saved");
          }}
        >
          Save
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-4xl px-8 py-10">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

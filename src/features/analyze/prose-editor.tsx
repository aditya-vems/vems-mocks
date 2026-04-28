import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type ProseEditorProps = {
  content: string;
  placeholder?: string;
  className?: string;
  editable?: boolean;
  onUpdate?: () => void;
};

export function ProseEditor({
  content,
  placeholder,
  className,
  editable = true,
  onUpdate,
}: ProseEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Type / for commands…",
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose-report focus:outline-none min-h-[100px] text-foreground",
      },
    },
    onUpdate: () => {
      onUpdate?.();
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return <EditorContent editor={editor} className={className} />;
}

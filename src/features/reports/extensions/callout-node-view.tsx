import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Alert, AlertDescription } from "@v-ems/element";
import type { CalloutAttrs, CalloutTone } from "./callout-node";

const toneToVariant: Record<CalloutTone, "default" | "destructive"> = {
  info: "default",
  warning: "destructive",
  success: "default",
};

export function CalloutNodeView({ node, selected, editor }: NodeViewProps) {
  const attrs = node.attrs as CalloutAttrs;
  return (
    <NodeViewWrapper className="my-3 block">
      <Alert
        variant={toneToVariant[attrs.tone]}
        className={selected ? "ring-2 ring-ring" : ""}
        data-tone={attrs.tone}
      >
        <AlertDescription>
          <NodeViewContent as="div" className={editor.isEditable ? "outline-none" : ""} />
        </AlertDescription>
      </Alert>
    </NodeViewWrapper>
  );
}

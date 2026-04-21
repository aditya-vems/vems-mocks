import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CalloutNodeView } from "./callout-node-view";

export type CalloutTone = "info" | "warning" | "success";

export type CalloutAttrs = {
  tone: CalloutTone;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      insertCallout: (attrs?: CalloutAttrs) => ReturnType;
    };
  }
}

export const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      tone: { default: "info" as CalloutTone },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='callout']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "callout" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutNodeView);
  },

  addCommands() {
    return {
      insertCallout:
        (attrs = { tone: "info" }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
            content: [{ type: "text", text: "Callout text…" }],
          });
        },
    };
  },
});

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { GraphNodeView } from "./graph-node-view";

export type GraphKind = "line" | "bar" | "area";

export type GraphAttrs = {
  graphId: string;
  title: string;
  kind: GraphKind;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    graph: {
      insertGraph: (attrs: GraphAttrs) => ReturnType;
    };
  }
}

export const GraphNode = Node.create({
  name: "graph",
  group: "block",
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      graphId: { default: "energy-24h" },
      title: { default: "Untitled graph" },
      kind: { default: "line" as GraphKind },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='graph']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "graph" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GraphNodeView);
  },

  addCommands() {
    return {
      insertGraph:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});

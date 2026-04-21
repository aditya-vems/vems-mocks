import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import {
  Badge,
  Button,
  Field,
  FieldLabel,
  FieldGroup,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "@v-ems/element";
import { useSimulationStore } from "./store";
import { unitCatalog } from "./unit-catalog";

export function Inspector() {
  const selectedNodeId = useSimulationStore((s) => s.selectedNodeId);
  const node = useSimulationStore((s) =>
    s.nodes.find((n) => n.id === s.selectedNodeId),
  );
  const updateNodeData = useSimulationStore((s) => s.updateNodeData);
  const updateSpec = useSimulationStore((s) => s.updateSpec);
  const duplicateNode = useSimulationStore((s) => s.duplicateNode);
  const deleteNode = useSimulationStore((s) => s.deleteNode);

  if (!selectedNodeId || !node) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a unit on the canvas to inspect and edit it.
      </div>
    );
  }

  const def = unitCatalog[node.data.type];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-3">
        <div
          className={[
            "flex size-8 items-center justify-center rounded-md bg-muted",
            def.accent,
          ].join(" ")}
        >
          <HugeiconsIcon icon={def.icon} size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{node.data.label}</div>
          <Badge variant="secondary" className="mt-0.5 text-[10px]">
            {def.displayName}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Duplicate"
          onClick={() => duplicateNode(node.id)}
        >
          <HugeiconsIcon icon={Copy01Icon} size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete"
          onClick={() => deleteNode(node.id)}
        >
          <HugeiconsIcon icon={Delete02Icon} size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="unit-label">Label</FieldLabel>
            <Input
              id="unit-label"
              value={node.data.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateNodeData(node.id, { label: e.target.value })
              }
            />
          </Field>

          <Separator className="my-2" />

          {def.specFields.map((field) => {
            const id = `spec-${field.key}`;
            const value = node.data.spec[field.key];

            if (field.kind === "text") {
              return (
                <Field key={field.key}>
                  <FieldLabel htmlFor={id}>{humanize(field.key)}</FieldLabel>
                  <Input
                    id={id}
                    value={String(value ?? "")}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSpec(node.id, field.key, e.target.value)
                    }
                  />
                </Field>
              );
            }

            if (field.kind === "number") {
              return (
                <Field key={field.key}>
                  <FieldLabel htmlFor={id}>
                    {humanize(field.key)}
                    {field.unit ? (
                      <span className="ml-1 text-muted-foreground">({field.unit})</span>
                    ) : null}
                  </FieldLabel>
                  <Input
                    id={id}
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={Number(value ?? 0)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSpec(node.id, field.key, Number(e.target.value))
                    }
                  />
                </Field>
              );
            }

            if (field.kind === "boolean") {
              return (
                <Field key={field.key} orientation="horizontal">
                  <Label htmlFor={id}>{humanize(field.key)}</Label>
                  <Switch
                    id={id}
                    checked={Boolean(value)}
                    onCheckedChange={(v: boolean) => updateSpec(node.id, field.key, v)}
                  />
                </Field>
              );
            }

            if (field.kind === "select") {
              return (
                <Field key={field.key}>
                  <FieldLabel htmlFor={id}>{humanize(field.key)}</FieldLabel>
                  <Select
                    value={String(value ?? field.options[0])}
                    onValueChange={(v: string) => updateSpec(node.id, field.key, v)}
                  >
                    <SelectTrigger id={id}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              );
            }

            return null;
          })}
        </FieldGroup>
      </div>
    </div>
  );
}

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

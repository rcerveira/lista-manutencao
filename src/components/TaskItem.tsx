
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Wrench, Settings, Trash2, Pencil, X, Check, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TaskItemProps {
  task: string;
  isCompleted?: boolean;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  draggable?: boolean;
}

export function TaskItem({ 
  task, 
  isCompleted = false, 
  onToggle, 
  onDelete,
  onEdit,
  draggable = true
}: TaskItemProps) {
  const [checked, setChecked] = useState(isCompleted);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task);

  const handleCheck = (checked: boolean) => {
    setChecked(checked);
    onToggle(checked);
  };

  const handleEditSave = () => {
    if (editedText.trim()) {
      onEdit(editedText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(task);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-accent",
        checked && "bg-muted/50",
        "animate-task-bounce cursor-move"
      )}
      draggable={draggable}
    >
      {draggable && (
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
      )}
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheck}
        className="h-5 w-5 transition-all"
      />
      <div className="flex-1 space-y-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="h-8"
              autoFocus
            />
            <button
              onClick={handleEditSave}
              className="p-1 hover:text-green-600 transition-colors"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:text-red-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <p
            className={cn(
              "text-sm font-medium leading-none",
              checked && "text-muted-foreground line-through"
            )}
          >
            {task}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:text-blue-600 transition-colors"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
        {!isEditing && (checked ? (
          <Settings className="h-5 w-5 text-muted-foreground transition-all" />
        ) : (
          <Wrench className="h-5 w-5 text-muted-foreground transition-all" />
        ))}
      </div>
    </div>
  );
}

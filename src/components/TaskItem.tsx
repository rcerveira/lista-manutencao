
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Wrench, Settings } from "lucide-react";

interface TaskItemProps {
  task: string;
  isCompleted?: boolean;
  onToggle: (completed: boolean) => void;
}

export function TaskItem({ task, isCompleted = false, onToggle }: TaskItemProps) {
  const [checked, setChecked] = useState(isCompleted);

  const handleCheck = (checked: boolean) => {
    setChecked(checked);
    onToggle(checked);
  };

  return (
    <div
      className={cn(
        "group flex items-center space-x-4 rounded-lg border p-4 transition-all hover:bg-accent",
        checked && "bg-muted/50",
        "animate-task-bounce"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheck}
        className="h-5 w-5 transition-all"
      />
      <div className="flex-1 space-y-1">
        <p
          className={cn(
            "text-sm font-medium leading-none",
            checked && "text-muted-foreground line-through"
          )}
        >
          {task}
        </p>
      </div>
      {checked ? (
        <Settings className="h-5 w-5 text-muted-foreground transition-all" />
      ) : (
        <Wrench className="h-5 w-5 text-muted-foreground transition-all" />
      )}
    </div>
  );
}

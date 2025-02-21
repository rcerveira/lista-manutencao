
import { Progress } from "@/components/ui/progress";

interface MaintenanceProgressProps {
  progress: number;
}

export function MaintenanceProgress({ progress }: MaintenanceProgressProps) {
  return (
    <div className="mt-6 space-y-1">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progresso</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

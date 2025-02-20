
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MaintenanceRecord {
  id: string;
  clientName: string;
  serialNumber: string;
  model: string;
  year: string;
  progress: number;
}

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    clientName: "Cliente Exemplo 1",
    serialNumber: "SN001",
    model: "Modelo A",
    year: "2023",
    progress: 75,
  },
  {
    id: "2",
    clientName: "Cliente Exemplo 2",
    serialNumber: "SN002",
    model: "Modelo B",
    year: "2022",
    progress: 30,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [maintenanceRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);

  const handleCreateNew = () => {
    navigate("/manutencao/nova");
  };

  const handleViewDetails = (id: string) => {
    navigate(`/manutencao/${id}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manutenções</h1>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Manutenção
          </Button>
        </div>

        <div className="grid gap-4">
          {maintenanceRecords.map((record) => (
            <Card
              key={record.id}
              className="hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => handleViewDetails(record.id)}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <h2 className="font-semibold">{record.clientName}</h2>
                  <div className="text-sm text-muted-foreground space-x-4">
                    <span>Série: {record.serialNumber}</span>
                    <span>•</span>
                    <span>Modelo: {record.model}</span>
                    <span>•</span>
                    <span>Ano: {record.year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{record.progress}%</div>
                    <Progress value={record.progress} className="w-24 h-2" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

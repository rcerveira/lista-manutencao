
import { Input } from "@/components/ui/input";

interface MaintenanceInfo {
  clientName: string;
  serialNumber: string;
  year: string;
  model: string;
  maintenanceDate: string;
}

interface MaintenanceInfoProps {
  maintenanceInfo: MaintenanceInfo;
  onInfoChange: (field: keyof MaintenanceInfo, value: string) => void;
}

export function MaintenanceInfo({ maintenanceInfo, onInfoChange }: MaintenanceInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="space-y-2">
        <label htmlFor="clientName" className="text-sm font-medium">
          Nome do Cliente
        </label>
        <Input
          id="clientName"
          placeholder="Nome do cliente"
          value={maintenanceInfo.clientName}
          onChange={(e) => onInfoChange("clientName", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="serialNumber" className="text-sm font-medium">
          Número de Série
        </label>
        <Input
          id="serialNumber"
          placeholder="Número de série"
          value={maintenanceInfo.serialNumber}
          onChange={(e) => onInfoChange("serialNumber", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium">
            Ano
          </label>
          <Input
            id="year"
            placeholder="Ano"
            value={maintenanceInfo.year}
            onChange={(e) => onInfoChange("year", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">
            Modelo
          </label>
          <Input
            id="model"
            placeholder="Modelo"
            value={maintenanceInfo.model}
            onChange={(e) => onInfoChange("model", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="maintenanceDate" className="text-sm font-medium">
          Data da Manutenção
        </label>
        <Input
          id="maintenanceDate"
          type="date"
          value={maintenanceInfo.maintenanceDate}
          onChange={(e) => onInfoChange("maintenanceDate", e.target.value)}
        />
      </div>
    </div>
  );
}

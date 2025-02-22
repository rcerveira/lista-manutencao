
export interface MaintenanceInfo {
  clientName: string;
  serialNumber: string;
  year: string;
  model: string;
  maintenanceDate: string;
}

export const initialMaintenanceInfo: MaintenanceInfo = {
  clientName: "",
  serialNumber: "",
  year: "",
  model: "",
  maintenanceDate: "",
};

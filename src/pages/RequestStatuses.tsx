
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ListChecks } from "lucide-react";
import { RequestStatus } from "@/types/request";

const STATUS_LABELS: Record<RequestStatus, string> = {
  solicitado: "Solicitado",
  em_estoque: "Em Estoque",
  compra_solicitada: "Compra Solicitada",
  necessario_fazer_compra: "Necessário Fazer Compra",
  compra_negada: "Compra Negada"
};

const STATUS_COLORS: Record<RequestStatus, string> = {
  solicitado: "bg-blue-100 text-blue-700",
  em_estoque: "bg-green-100 text-green-700",
  compra_solicitada: "bg-yellow-100 text-yellow-700",
  necessario_fazer_compra: "bg-orange-100 text-orange-700",
  compra_negada: "bg-red-100 text-red-700"
};

export default function RequestStatuses() {
  const navigate = useNavigate();
  const statuses = Object.entries(STATUS_LABELS) as [RequestStatus, string][];

  const handleBack = () => {
    navigate("/solicitacoes");
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6" />
              Gerenciar Status
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3">
            {statuses.map(([status, label]) => (
              <div
                key={status}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-md text-sm font-medium ${STATUS_COLORS[status]}`}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

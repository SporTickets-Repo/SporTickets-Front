"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Exemplo simples de Skeleton
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
);

const dateFilters = [
  "Todos",
  "Hoje",
  "7 Dias",
  "30 Dias",
  "90 Dias",
  "365 Dias",
];

export function MetricDashboardSkeleton() {
  return (
    <div className="space-y-2">
      {/* Filtros de data e botão de filtro */}
      <div className="flex flex-1 justify-between items-center">
        <div className="flex gap-2">
          {dateFilters.map((_, index) => (
            <Skeleton key={index} className="w-16 h-8 rounded-full" />
          ))}
        </div>
        <Skeleton className="w-32 h-10 rounded-sm" />
      </div>

      {/* Cartão com as métricas principais */}
      <Card className="bg-sporticket-offWhite shadow-none border-0 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-4 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between p-0 mb-2">
                <Skeleton className="w-28 h-3" />
              </CardHeader>
              <CardContent className="flex items-center gap-2 p-0">
                <Skeleton className="w-12 h-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>

      {/* Cartão com gráfico de faturamento */}
      <Card className="bg-sporticket-offWhite shadow-none border-0">
        <CardHeader className="flex flex-row flex-1 items-center justify-between py-3">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-24 h-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-72" />
        </CardContent>
      </Card>

      {/* Cartões de Principais Eventos e Cupons */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card
            key={index}
            className="bg-sporticket-offWhite shadow-none border-0"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-24 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de Inscritos */}
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-32 h-10" />
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {[
                "Usuário",
                "Categoria",
                "Lote",
                "Campos Personalizados",
                "Evento",
                "Status da Transação",
                "Valor Pago",
                "Código do Ticket",
                "Team ID",
              ].map((_, index) => (
                <th key={index} className="px-4 py-2">
                  <Skeleton className="w-24 h-4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 9 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2">
                    <Skeleton className="w-full h-4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

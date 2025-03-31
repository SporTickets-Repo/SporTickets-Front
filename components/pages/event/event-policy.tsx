"use client";

import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

interface EventPolicyProps {
  regulation?: string;
}

export default function EventPolicy({ regulation }: EventPolicyProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-50 mb-4 p-4 rounded-lg">
      <div className="flex align-center items-center gap-3 mb-2 ">
        <ShieldCheck size={20} className="text-zinc-400" />
        <h2 className="text-lg font-bold">Política</h2>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        {regulation && (
          <div>
            <h3 className="font-medium">Regulamento do evento</h3>

            <div
              className={`relative ${
                expanded ? "" : "max-h-24 overflow-hidden"
              }`}
            >
              <div
                className="text-sm text-gray-700 tiptap whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: regulation }}
              />
              {!expanded && (
                <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-zinc-50 to-transparent"></div>
              )}
            </div>

            <Button
              variant="link"
              className="mt-1 h-auto p-0 text-sm font-medium underline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ver menos" : "Ver mais"}
            </Button>
          </div>
        )}

        <div>
          <h3 className="font-medium">Cancelamento de pedidos pagos</h3>
          <p>
            Cancelamentos de pedidos serão aceitos até 7 dias após a compra,
            desde que a solicitação seja enviada até 48 horas antes do início do
            evento.
          </p>
        </div>

        <div>
          <h3 className="font-medium">Edição de participantes</h3>
          <p>
            Você poderá editar o participante de um ingresso apenas uma vez.
            Essa opção ficará disponível até 24 horas antes do início do evento.
          </p>
        </div>
      </div>
    </div>
  );
}

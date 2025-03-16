"use client";

import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface EventPolicyProps {
  linkRanking?: string;
}

export default function EventRanking({ linkRanking }: EventPolicyProps) {
  const handleOpenRanking = () => {
    console.log("open ranking");
  };
  return (
    <div className="bg-zinc-50 mb-4 p-4 rounded-lg">
      <div className="flex align-center items-center gap-3 mb-2 ">
        <Trophy size={20} className="text-zinc-400" />
        <h2 className="text-lg font-bold">Ranqueamento</h2>
      </div>

      <div className="text-sm text-gray-700">
        <p>
          Veja sua posição no ranking e ganhe benefícios conforme sua pontuação
          aumenta!
        </p>
        {linkRanking ? (
          <Button variant="link" onClick={handleOpenRanking}>
            {" "}
            Ver Ranqueamento
          </Button>
        ) : (
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-sm font-medium"
          >
            {" "}
            Ainda não disponível
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Bracket } from "@/interface/bracket";
import { Split } from "lucide-react";

interface EventBracketProps {
  brackets: Bracket[];
}

export default function EventBracket({ brackets }: EventBracketProps) {
  const handleOpenBracket = (ulr: string) => {
    console.log("open ranking");
  };
  return (
    <div className="bg-zinc-50 mb-4 p-4 rounded-lg">
      <div className="flex align-center items-center gap-3 mb-2 ">
        <Split size={20} className="text-zinc-400" />
        <h2 className="text-lg font-bold">Chaveamento</h2>
      </div>

      <div className="text-sm text-gray-700">
        <p>
          Veja o chaveamento do torneio e acompanhe os resultados das partidas!
        </p>
        {brackets.length > 0 ? (
          <>
            {brackets.map((bracket) => (
              <Button
                key={bracket.id}
                variant="link"
                onClick={() => handleOpenBracket(bracket.url)}
                className="mt-2 h-auto p-0 text-sm font-medium mr-3 underline"
              >
                {"• "}
                {bracket.name}
              </Button>
            ))}
          </>
        ) : (
          <Button variant="link"> Ainda não disponível</Button>
        )}
      </div>
    </div>
  );
}

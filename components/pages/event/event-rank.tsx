"use client";

import TranslatedLink from "@/components/translated-link";
import { Button } from "@/components/ui/button";
import { Ranking } from "@/interface/ranking";
import { Trophy } from "lucide-react";

interface EventPolicyProps {
  rankings: Ranking[];
}

export default function EventRanking({ rankings }: EventPolicyProps) {
  const handleOpenRanking = (ulr: string) => {
    console.log("open ranking");
  };
  return (
    <div className="bg-zinc-50 mb-4 p-4 rounded-lg">
      <TranslatedLink href="/ranking">
        <div className="flex align-center items-center gap-3 mb-2 ">
          <Trophy size={20} className="text-zinc-400" />
          <h2 className="text-lg font-bold">Ranqueamento</h2>
        </div>
      </TranslatedLink>

      <div className="text-sm text-gray-700">
        <p>
          Veja sua posição no ranking e ganhe benefícios conforme sua pontuação
          aumenta!
        </p>
        {rankings?.length > 0 ? (
          <>
            {rankings.map((ranking) => (
              <TranslatedLink
                target="_blank"
                href={`/ranking/${encodeURIComponent(ranking.id)}`}
                key={ranking.id}
              >
                <Button
                  key={ranking.id}
                  variant="link"
                  onClick={() => handleOpenRanking(ranking.url)}
                  className="mt-2 h-auto p-0 text-sm font-medium mr-3 underline"
                >
                  {"• "}
                  {ranking.name}
                </Button>
              </TranslatedLink>
            ))}
          </>
        ) : (
          <Button
            className="mt-2 h-auto p-0 text-sm font-medium mr-3 underline"
            variant="link"
          >
            {" "}
            Ainda não disponível
          </Button>
        )}
      </div>
    </div>
  );
}

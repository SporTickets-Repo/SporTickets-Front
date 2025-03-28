"use client";

import { Button } from "@/components/ui/button";
import { rankingService } from "@/service/ranking";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RankingPage() {
  const { id } = useParams() as { id: string };
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankingUrl = async () => {
      try {
        const response = await rankingService.getRankingsById(id);
        setUrl(response.url);
      } catch (error) {
        console.error("Erro ao buscar o Ranking:", error);
      }
    };

    fetchRankingUrl();
  }, [id]);

  if (0) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(80vh_-_81px)] overflow-x-hidden container justify-center items-center text-center gap-4">
        <h2 className="text-sporticket-purple text-4xl font-bold">
          Desculpe mas não conseguimos encontrar o ranking
        </h2>
        <p className="text-lg">
          É possível que esse ranking está sendo atualizado
        </p>
        <Link href="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container pb-4">
      <div
        className="rounded-lg overflow-hidden border h-[80vh]"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}
      >
        <iframe
          src={"https://challonge.com/pt/951bs87n/module"}
          title="Ranking"
          width="100%"
          height="100%"
          className="w-full h-full  border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}

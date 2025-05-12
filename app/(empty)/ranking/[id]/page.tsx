"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { rankingService } from "@/service/ranking";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RankingPage() {
  const { id } = useParams() as { id: string };
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankingUrl = async () => {
      try {
        const response = await rankingService.getRankingsById(id);
        setUrl(response.url);
      } catch (error) {
        console.error("Erro ao buscar o Ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingUrl();
  }, [id]);

  return (
    <div className="">
      {loading ? (
        <RankingSkeleton />
      ) : url === null || !url.includes("http") ? (
        <div className="flex-1 flex flex-col  overflow-x-hidden container justify-center items-center text-center gap-4">
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
      ) : (
        <div
          className=" overflow-hidden h-[100vh]"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          <iframe
            src={url}
            title="Ranking"
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

function RankingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 container">
      <div className="space-y-4 w-full max-w-4xl">
        <div className="rounded-lg overflow-hidden border h-[80vh]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { bracketService } from "@/service/bracket";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function BracketPage() {
  const { id } = useParams() as { id: string };
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBracketUrl = async () => {
    try {
      const response = await bracketService.getBracketsById(id);
      setUrl(response.url);
    } catch (error) {
      console.error("Erro ao buscar o chaveamento:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracketUrl();

    pollingRef.current = setInterval(() => {
      fetchBracketUrl();
    }, 15000); // 15s

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id]);

  return (
    <div className="">
      {loading ? (
        <BracketSkeleton />
      ) : (
        <div
          className="overflow-hidden h-[100vh]"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          {url === null || !url.includes("http") ? (
            <div className="flex-1 flex flex-col overflow-x-hidden justify-center items-center text-center gap-4">
              <h2 className="text-sporticket-purple text-4xl font-bold">
                Desculpe, mas não conseguimos encontrar o chaveamento
              </h2>
              <p className="text-lg">
                É possível que este chaveamento esteja sendo atualizado ou ainda
                não esteja disponível.
              </p>
              <Link href="/">
                <Button>Voltar para a página inicial</Button>
              </Link>
            </div>
          ) : (
            <iframe
              key={url}
              src={url}
              title="Chaveamento"
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              allowFullScreen
            />
          )}
        </div>
      )}
    </div>
  );
}

function BracketSkeleton() {
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

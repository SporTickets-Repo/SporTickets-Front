"use client";

import { Button } from "@/components/ui/button";
import { bracketService } from "@/service/bracket";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BracketPage() {
  const { id } = useParams() as { id: string };
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBracketUrl = async () => {
      try {
        const response = await bracketService.getBracketsById(id);
        setUrl(response.url);
      } catch (error) {
        console.error("Erro ao buscar o chaveamento:", error);
      }
    };

    fetchBracketUrl();
  }, [id]);

  if (!url) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(80vh_-_81px)] overflow-x-hidden container justify-center items-center text-center gap-4">
        <h2 className="text-sporticket-purple text-4xl font-bold">
          Desculpe mas não conseguimos encontrar o chaveamento
        </h2>
        <p className="text-lg">
          É possível que esse chaveamento está sendo atualizado ou ainda não
          está disponível
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
          title="Chaveamento"
          width="100%"
          height="100%"
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
}

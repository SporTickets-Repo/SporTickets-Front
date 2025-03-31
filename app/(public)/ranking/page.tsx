"use client";

import RankingCard from "@/components/pages/rankings/ranking-card";
import { Button } from "@/components/ui/button";
import { useEvent } from "@/context/event";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RankingPage() {
  const { event } = useEvent();
  const router = useRouter();
  if (!event || !event?.ranking) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(80vh_-_81px)] overflow-x-hidden container justify-center items-center text-center gap-4">
        <h2 className="text-sporticket-purple text-4xl font-bold">
          Rankings do Evento
        </h2>
        <p className="text-lg">Nenhum Ranking disponível nesse evento!</p>
        <Link href="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mt-2 mb-4 ">
        <Button
          variant="tertiary"
          className="rounded-full"
          size="icon"
          onClick={() => router.push("/")}
        >
          <ChevronLeft size={16} className="text-zinc-500" />
        </Button>
        <h1 className="text-2xl font-bold ">Rankings do Evento</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {event?.ranking?.length > 0 ? (
          event.ranking.map((ranking) => (
            <RankingCard key={ranking.id} ranking={ranking} />
          ))
        ) : (
          <p className="text-muted-foreground">Nenhum Ranking disponível.</p>
        )}
      </div>
    </div>
  );
}

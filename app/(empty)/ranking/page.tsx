"use client";

import RankingCard from "@/components/pages/rankings/ranking-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvent } from "@/context/event";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RankingPage() {
  const { event } = useEvent();
  const router = useRouter();

  if (!event) {
    return <RankingSkeleton />;
  }

  if (!event?.ranking || event.ranking.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-[calc(80vh_-_81px)] overflow-x-hidden container justify-center items-center text-center gap-4">
        <h2 className="text-sporticket-purple text-4xl font-bold">
          Rankings do Evento
        </h2>
        <p className="text-lg">Nenhum Ranking disponível nesse evento!</p>
        <Link href={`/evento/${event?.slug}`}>
          <Button>Voltar para o evento</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mt-2 mb-4">
        <Button
          variant="tertiary"
          className="rounded-full"
          size="icon"
          onClick={() => router.push(`/evento/${event?.slug}`)}
        >
          <ChevronLeft size={16} className="text-zinc-500" />
        </Button>
        <h1 className="text-2xl font-bold">Rankings do Evento</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {event.ranking.map((ranking) => (
          <RankingCard key={ranking.id} ranking={ranking} />
        ))}
      </div>
    </div>
  );
}

function RankingSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mt-2 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

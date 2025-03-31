"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ranking } from "@/interface/ranking";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface rankingCardProps {
  ranking: Ranking;
}

export default function RankingCard({ ranking }: rankingCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow bg-gray-50 border-0">
      <CardContent className="py-4 px-6">
        <h3 className="text-xl font-base mb-2">{ranking.name}</h3>
        <div className="flex items-center gap-2 justify-between">
          <p className="text-sm text-muted-foreground font-semibold bg-gray-200 rounded-md px-4 py-[3px]">
            {ranking.isActive ? "Ativo" : "Inativo"}
          </p>
          <Link href={`/chaveamento/${ranking.id}`}>
            <Button variant="link" className="m-0 underline">
              Visualizar <ArrowRight className="" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

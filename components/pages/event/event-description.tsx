"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EventDescription() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <h2 className="mb-2 text-lg font-bold">Descrição</h2>
      <div className={expanded ? "" : "line-clamp-3"}>
        <p className="text-sm text-gray-700">
          Prepare-se para uma experiência única no Velódromo Experimental! Dia
          29 de março, o BLUE - Long Distance Triathlon irá premiar os mais um
          evento inesquecível, repleto de atrações incríveis. Você poderá ver de
          perto carros réplicas dos filmes, explorar cenários...
        </p>
      </div>
      <Button
        variant="link"
        className="mt-1 h-auto p-0 text-sm font-medium text-blue-600"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Ver menos" : "Ver mais"}
      </Button>
    </div>
  );
}

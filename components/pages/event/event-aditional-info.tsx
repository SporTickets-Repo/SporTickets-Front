"use client";

import { Button } from "@/components/ui/button";
import { TableOfContents } from "lucide-react";
import { useState } from "react";

interface EventAditionalInfoProps {
  additionalInfo: string;
}

export default function EventAditionalInfo({
  additionalInfo,
}: EventAditionalInfoProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-50 mb-4 p-4 rounded-lg">
      <div className="flex align-center items-center gap-3 mb-2 ">
        <TableOfContents size={20} className="text-zinc-400" />
        <h2 className="text-lg font-bold">Informações Adicionais</h2>
      </div>
      <div className={`relative ${expanded ? "" : "max-h-24 overflow-hidden"}`}>
        {/* Renderiza o HTML da descrição */}
        <div
          className="text-sm text-gray-700 tiptap whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: additionalInfo }}
        />
        {!expanded && (
          <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-zinc-50 to-transparent"></div>
        )}
      </div>

      <Button
        variant="link"
        className="mt-1 h-auto p-0 text-sm font-medium"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Ver menos" : "Ver mais"}
      </Button>
    </div>
  );
}

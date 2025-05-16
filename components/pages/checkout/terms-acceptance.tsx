"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEvent } from "@/context/event";
import type { Term } from "@/interface/event";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TermsAcceptanceProps {
  terms: Term[];
}

export function TermsAcceptance({ terms }: TermsAcceptanceProps) {
  const { setAcceptedTermIds } = useEvent();

  const [acceptedTerms, setAcceptedTerms] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (terms?.length) {
      const initial = terms.reduce((acc, t) => {
        acc[t.id] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setAcceptedTerms(initial);
    }
  }, [terms]);

  useEffect(() => {
    const ids = Object.entries(acceptedTerms)
      .filter(([, ok]) => ok)
      .map(([id]) => id);

    setAcceptedTermIds(ids);
  }, [acceptedTerms, setAcceptedTermIds]);

  const handleToggle = (id: string, checked: boolean) =>
    setAcceptedTerms((p) => ({ ...p, [id]: checked }));

  const allRequiredAccepted = terms
    .filter((t) => t.isObligatory)
    .every((t) => acceptedTerms[t.id]);

  if (!terms?.length) return null;

  return (
    <div className="space-y-4 p-4 bg-zinc-50 rounded-lg">
      <h3 className="font-semibold text-lg">Termos e Condições</h3>

      <div className="space-y-3">
        {terms.map((term) => (
          <div key={term.id} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`term-${term.id}`}
                checked={acceptedTerms[term.id] || false}
                onCheckedChange={(c) => handleToggle(term.id, c === true)}
              />
              <div className="flex items-center gap-1">
                <Label
                  htmlFor={`term-${term.id}`}
                  className="font-medium cursor-pointer"
                >
                  {term.fileUrl ? (
                    <a
                      href={term.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileIcon className="h-3 w-3 mr-1 inline" />
                      {term.title}
                    </a>
                  ) : (
                    term.title
                  )}
                </Label>
                {term.isObligatory && <span className="text-red-500">*</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!allRequiredAccepted && (
        <p className="text-sm text-red-500">
          * Você precisa aceitar todos os termos obrigatórios para continuar.
        </p>
      )}

      <div className="mt-4 text-sm text-gray-600 italic">
        Ao marcar as caixas acima, você confirma que leu, compreendeu e concorda
        com os termos e condições apresentados. Esta aceitação constitui um
        compromisso legal entre você e a organização do evento.
      </div>
    </div>
  );
}

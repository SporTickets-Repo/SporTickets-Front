"use client";

import TranslatedLink from "@/components/translated-link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function TransactionSuccess() {
  return (
    <div className="text-center space-y-8">
      <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
      <h2 className="text-2xl font-bold text-green-600">Pagamento aprovado!</h2>
      <p className="text-muted-foreground">
        Sua inscrição foi confirmada com sucesso. Você pode consultar os
        detalhes no seu perfil.
      </p>
      <div>
        <TranslatedLink href="/perfil">
          <Button variant="default">Ir para meu perfil</Button>
        </TranslatedLink>
      </div>
    </div>
  );
}

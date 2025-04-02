"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  onRefresh: () => void;
}

export function TransactionAwaiting({ onRefresh }: Props) {
  return (
    <div className="space-y-10 text-center">
      <Loader2 className="mx-auto h-16 w-16 animate-spin text-zinc-600" />
      <h2 className="text-xl font-bold">
        Aguardando confirmação do pagamento...
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Assim que o pagamento for confirmado, sua inscrição será ativada
        automaticamente.
      </p>
      <Button variant="default" onClick={onRefresh}>
        Já paguei!
      </Button>
    </div>
  );
}

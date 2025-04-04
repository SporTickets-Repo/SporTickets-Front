"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  onRefresh: (isUserAction: boolean) => Promise<void>;
}

export function TransactionAwaiting({ onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onRefresh(true);
    setLoading(false);
  };

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
      <Button variant="default" onClick={handleClick} disabled={loading}>
        {loading ? (
          <>
            Verificando...
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          "Já paguei!"
        )}
      </Button>
    </div>
  );
}

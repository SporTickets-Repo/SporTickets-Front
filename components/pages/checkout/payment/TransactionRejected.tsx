"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export function TransactionRejected() {
  return (
    <div className="text-center space-y-4">
      <XCircle className="mx-auto h-20 w-20 text-red-500" />
      <h2 className="text-2xl font-bold text-red-600">
        Pagamento não aprovado
      </h2>
      <p className="text-muted-foreground">
        Infelizmente seu pagamento foi recusado ou cancelado. Verifique os dados
        e tente novamente.
      </p>
      <div>
        <Link href="/perfil">
          <Button variant="default">Sair</Button>
        </Link>
      </div>
    </div>
  );
}

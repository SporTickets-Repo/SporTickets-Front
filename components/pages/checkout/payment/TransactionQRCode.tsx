"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  pixQRCode: string | null;
  onRefresh: (isUserAction: boolean) => Promise<void>;
}

export function TransactionQRCode({ pixQRCode, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!pixQRCode) return;
    try {
      await navigator.clipboard.writeText(pixQRCode);
      toast.success("Código PIX copiado!");
    } catch (err) {
      toast.error("Não foi possível copiar o código.");
    }
  };

  const handleClick = async () => {
    setLoading(true);
    await onRefresh(true);
    setLoading(false);
  };

  if (!pixQRCode) {
    return (
      <div className="space-y-6 text-center max-w-md w-full">
        <h2 className="text-xl font-bold">Carregando QR Code...</h2>
        <div className="w-full flex justify-center items-center h-64 bg-zinc-100 rounded-md">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-500" />
        </div>
        <p className="text-sm text-muted-foreground">
          Estamos gerando o seu QR Code. Isso pode levar alguns segundos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center max-w-md w-full">
      <h2 className="text-xl font-bold">Aguardando pagamento via PIX</h2>
      <div className="bg-white p-4 rounded-md inline-block">
        <QRCodeSVG value={pixQRCode} size={256} />
      </div>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Escaneie o QR Code com seu aplicativo bancário ou copie o código abaixo
        para efetuar o pagamento.
      </p>
      <div className="w-full h-32 md:h-24 p-2 text-sm border rounded-md bg-zinc-100 overflow-hidden whitespace-pre-wrap break-words">
        <p className="text-center">{pixQRCode}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={handleCopy} variant="outline">
          Copiar código PIX
        </Button>
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
    </div>
  );
}

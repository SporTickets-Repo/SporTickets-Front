"use client";

import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface Props {
  pixQRCode: string;
  onRefresh: () => void;
}

export function TransactionQRCode({ pixQRCode, onRefresh }: Props) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixQRCode);
      toast.success("Código PIX copiado!");
    } catch (err) {
      toast.error("Não foi possível copiar o código.");
    }
  };

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
        <Button variant="default" onClick={onRefresh}>
          Já paguei!
        </Button>
      </div>
    </div>
  );
}

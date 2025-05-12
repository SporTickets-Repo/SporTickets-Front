"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateEventContext } from "@/context/create-event";
import { eventService } from "@/service/event";
import { Loader2, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export function TaxesTab() {
  const { watch, setValue, getValues } = useFormContext<{ eventFee: number }>();
  const { eventId } = useCreateEventContext();
  const rawFee = watch("eventFee");

  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveTaxes() {
    try {
      setIsSaving(true);
      const feePercentage = getValues("eventFee") ?? 0;

      const normalizedFee = parseFloat((feePercentage / 100).toFixed(2));
      await eventService.eventFee(eventId as string, normalizedFee);

      toast.success("Taxa de ingressos salva com sucesso!");
      await mutate(`/events/${eventId}`);
    } catch (error) {
      console.error("Error saving ticket fee:", error);
      toast.error("Erro ao salvar a taxa de ingressos. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-full px-0 sm:px-6">
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Taxa dos ingressos</h2>
          <p className="text-sm text-muted-foreground">Valor: {rawFee ?? 0}%</p>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium">
          Insira o valor da taxa (%)
        </label>
        <Input
          className="w-1/2"
          placeholder="Ex: 5"
          value={rawFee ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, "");
            const num = Number(value);
            setValue("eventFee", Math.min(100, isNaN(num) ? 0 : num));
          }}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSaveTaxes}
          className="[&_svg]:size-5 items-center"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            <>
              Salvar alterações
              <SaveIcon className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

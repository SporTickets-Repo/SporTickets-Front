"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateEventContext } from "@/context/create-event";
import { eventService } from "@/service/event";
import { Loader2, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function TaxesTab() {
  const { register, watch, setValue } = useFormContext();
  const { eventId } = useCreateEventContext();
  const eventFee = watch("eventFee");

  useEffect(() => {
    if (eventFee !== undefined && eventFee > 0 && eventFee <= 1) {
      setValue("eventFee", eventFee * 100);
    }
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveTaxes() {
    try {
      setIsSaving(true);

      const feePercentage = watch("eventFee");

      const normalizedFee = feePercentage / 100;
      await eventService.eventFee(eventId as string, normalizedFee);
    } catch (error) {
      console.error("Error saving ticket fee:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-full px-0 sm:px-6">
      <div className="flex flex-row items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Taxa dos ingressos</h2>
          <p className="text-sm text-muted-foreground">Valor: {eventFee}%</p>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium">
          Insira o valor da taxa (%)
        </label>
        <Input
          className="w-1/2"
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="Ex: 5"
          {...register("eventFee", { valueAsNumber: true })}
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

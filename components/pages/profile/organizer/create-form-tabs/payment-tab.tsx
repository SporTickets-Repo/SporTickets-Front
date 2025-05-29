"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth";
import { useCreateEventContext } from "@/context/create-event";
import { Country } from "@/interface/auth";
import { Currency, PaymentMethod } from "@/interface/event";
import { cn } from "@/lib/utils";
import { CreateEventFormValues } from "@/schemas/createEventSchema";
import { eventService } from "@/service/event";
import { Circle, CircleCheck, Loader2, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaCreditCard, FaPix } from "react-icons/fa6";
import { toast } from "sonner";
import { mutate } from "swr";

const countryConfig: Record<
  Country,
  { currency: Currency; defaultMethods: PaymentMethod[] }
> = {
  [Country.BRAZIL]: {
    currency: Currency.BRL,
    defaultMethods: [PaymentMethod.PIX],
  },
  [Country.AUSTRALIA]: {
    currency: Currency.AUD,
    defaultMethods: [PaymentMethod.STRIPE],
  },
};

export function PaymentTab() {
  const { user } = useAuth();
  const isMaster = user?.role === "MASTER";

  const { control, watch, setValue, getValues, trigger } =
    useFormContext<CreateEventFormValues>();
  const { eventId } = useCreateEventContext();
  const [isSaving, setIsSaving] = useState(false);

  const country = watch("event.country");
  const rawFee = watch("event.eventFee");
  const paymentMethods = watch("event.paymentMethods") || [];

  useEffect(() => {
    const cfg = countryConfig[country];
    if (!cfg) return;
    setValue("event.currency", cfg.currency, {
      shouldValidate: false,
      shouldDirty: true,
    });
    if (cfg.defaultMethods.length > 0) {
      setValue(
        "event.paymentMethods",
        cfg.defaultMethods as [PaymentMethod, ...PaymentMethod[]],
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  }, [country, setValue]);

  const handleSavePayment = async () => {
    const isValid = await trigger([
      "event.country",
      "event.currency",
      "event.eventFee",
      "event.paymentMethods",
    ]);
    if (!isValid) {
      toast.error("Por favor corrija os campos marcados.");
      return;
    }

    setIsSaving(true);
    try {
      if (!eventId) throw new Error("Evento não identificado");
      const data = {
        country: getValues("event.country"),
        currency: getValues("event.currency"),
        eventFee: getValues("event.eventFee")! / 100,
        paymentMethods: getValues("event.paymentMethods")!,
      };
      await eventService.updatePaymentSettings(eventId, data);
      toast.success("Configurações de pagamento salvas!");
      await mutate(`/events/${eventId}/payment`);
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full px-0 sm:px-6">
      <h2 className="text-2xl font-semibold">Configurações de Pagamento</h2>

      <FormField
        control={control}
        name="event.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>País</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Selecione o país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Country.BRAZIL}>Brasil</SelectItem>
                <SelectItem value={Country.AUSTRALIA}>Austrália</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="event.currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Moeda</FormLabel>
            <FormControl>
              <Input className="w-1/2" value={field.value} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {isMaster && (
        <>
          <FormField
            control={control}
            name="event.eventFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa do Evento (%)</FormLabel>
                <FormControl>
                  <Input
                    className="w-1/2"
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      field.onChange(Math.min(100, Math.max(0, num)));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="event.paymentMethods"
            render={({ field }) => {
              const current = field.value as PaymentMethod[];
              const isBR = country === Country.BRAZIL;
              const isAU = country === Country.AUSTRALIA;

              return (
                <FormItem>
                  <FormLabel>Métodos de Pagamento</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {isBR && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn("gap-2", {
                              "text-primary border-primary": current.includes(
                                PaymentMethod.PIX
                              ),
                            })}
                            onClick={() =>
                              field.onChange(
                                current.includes(PaymentMethod.PIX)
                                  ? current.filter(
                                      (m) => m !== PaymentMethod.PIX
                                    )
                                  : [...current, PaymentMethod.PIX]
                              )
                            }
                          >
                            <FaPix /> Pix{" "}
                            {current.includes(PaymentMethod.PIX) ? (
                              <CircleCheck />
                            ) : (
                              <Circle />
                            )}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            className={cn("gap-2", {
                              "text-primary border-primary": current.includes(
                                PaymentMethod.CREDIT_CARD
                              ),
                            })}
                            onClick={() =>
                              field.onChange(
                                current.includes(PaymentMethod.CREDIT_CARD)
                                  ? current.filter(
                                      (m) => m !== PaymentMethod.CREDIT_CARD
                                    )
                                  : [...current, PaymentMethod.CREDIT_CARD]
                              )
                            }
                          >
                            <FaCreditCard /> Cartão{" "}
                            {current.includes(PaymentMethod.CREDIT_CARD) ? (
                              <CircleCheck />
                            ) : (
                              <Circle />
                            )}
                          </Button>
                        </>
                      )}

                      {isAU && (
                        <Button
                          type="button"
                          disabled
                          variant="outline"
                          className="gap-2 text-primary border-primary"
                        >
                          <FaCreditCard /> Stripe automático <CircleCheck />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSavePayment}
          disabled={isSaving}
          className="[&_svg]:size-5 items-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Salvando...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" /> Salvar alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

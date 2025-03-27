"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { useCreateEventContext } from "@/context/create-event";
import { CreateEventFormValues } from "@/schemas/createEventSchema";
import { couponService } from "@/service/coupon";
import { mutate } from "swr";

export function CouponsTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { eventId } = useCreateEventContext();

  const { control, getValues, trigger } =
    useFormContext<CreateEventFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "coupons",
  });

  async function handleSaveCoupons() {
    const isValid = await trigger("coupons");
    if (!isValid) {
      toast.error("Corrija os erros nos cupons antes de salvar.");
      const firstErrorElement = document.querySelector(
        "[id$='-form-item-message']"
      );
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      setIsSaving(true);
      const formValues = getValues();
      const { coupons } = formValues;
      const response = await couponService.updateCouponsList(
        eventId as string,
        (coupons || []).map((coupon) => ({
          ...coupon,
          percentage: coupon.percentage / 100,
        }))
      );
      console.log("Cupons salvos:", response);
      toast.success("Cupons salvos com sucesso!");
      await mutate(`/events/${eventId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar cupons");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 px-0 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h2 className="text-lg font-semibold">Cupons</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {fields.length}
          </p>
        </div>
        <Button
          size="sm"
          type="button"
          onClick={() => {
            const newIndex = fields.length;
            append({
              name: "",
              percentage: 0,
              quantity: 0,
              isActive: true,
            });
            setOpenItems((prev) => [...prev, `coupon-${newIndex}`]);
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Cupom
        </Button>
      </div>

      <Accordion
        value={openItems}
        onValueChange={(val) => setOpenItems(val)}
        type="multiple"
        className="space-y-4 sm:p-4"
      >
        {fields.map((item, index) => (
          <AccordionItem
            key={item.id}
            value={`coupon-${index}`}
            className="border rounded-md"
          >
            <AccordionTrigger className="flex items-center justify-between">
              <div className="flex items-center justify-between w-full px-2">
                <div>
                  <h3 className="font-medium">
                    {item.name || `Cupom ${index + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.percentage}% • Quantidade: {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2">
                  <FormField
                    control={control}
                    name={`coupons.${index}.isActive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            onClick={(e) => e.stopPropagation()}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label>Ativo</Label>
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 sm:p-6 space-y-4 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`coupons.${index}.id`}
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <FormField
                  control={control}
                  name={`coupons.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do cupom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NOME DO CUPOM"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const upper = raw.toUpperCase();
                            const clean = upper
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "");
                            field.onChange(clean);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
                  <FormField
                    control={control}
                    name={`coupons.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Percentual de Desconto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = Math.min(
                                100,
                                Number(e.target.value.replace(/\D/g, ""))
                              );
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`coupons.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Quantidade"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.onChange(Number(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={handleSaveCoupons} disabled={isSaving}>
          {isSaving && (
            <Loader2 className="animate-spin self-center w-4 h-4 mr-2" />
          )}
          Salvar cupons
        </Button>
      </div>
    </div>
  );
}

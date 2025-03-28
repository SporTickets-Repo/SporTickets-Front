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
import { Loader2, PlusIcon, SaveIcon, Ticket, Trash2Icon } from "lucide-react";
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
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Cupons</h2>
          <p className="text-sm text-muted-foreground">
            Quantidade total: {fields.length}
          </p>
        </div>
        {fields.length > 0 && (
          <Button
            variant="linkPurple"
            className="gap-2 self-start sm:self-center"
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
            <PlusIcon />
            Novo Cupom
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum cupom cadastrado</h3>
          <p className="text-muted-foreground mb-6">
            Clique em "Novo cupom" para começar a configurar os cupoms do seu
            evento.
          </p>
          <Button
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
            type="button"
            className="gap-2"
          >
            <PlusIcon />
            Novo Cupom
          </Button>
        </div>
      )}

      {fields.length > 0 && (
        <Accordion
          value={openItems}
          onValueChange={(val) => setOpenItems(val)}
          type="multiple"
          className="rounded-md overflow-hidden space-y-4"
        >
          {fields.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={`coupon-${index}`}
              className="border-0 rounded-md"
            >
              <AccordionTrigger className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="font-medium">
                      {item.name || `Cupom ${index + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.percentage}% • Quantidade: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mr-3">
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
                          <Label className="font-light text-gray-600">
                            Ativo
                          </Label>
                        </FormItem>
                      )}
                    />

                    <Button
                      variant="default-inverse"
                      type="button"
                      size="icon"
                      className="p-[10px] [&_svg]:size-4 rounded-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(index);
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent
                style={{ padding: 0 }}
                className="pt-4 pb-5 px-4 border rounded-b-xl rounded-t-none border-t-0"
              >
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
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleSaveCoupons}
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
